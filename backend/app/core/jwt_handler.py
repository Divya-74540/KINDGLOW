import uuid
import logging
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.user_model import User
from app.repositories.user_repository import UserRepository

logger = logging.getLogger("uvicorn.error")
security_scheme = HTTPBearer()

SECRET_KEY: str = getattr(settings, "SECRET_KEY", "3b5bd22eea6b77e28decc7cc2e16d41e06f953049895f4663202b173766854731a5026de4c521e26ce2a5023066ad981464d6a0282414b62f85eb091a1f47e86")
ALGORITHM: str = getattr(settings, "ALGORITHM", "HS256")


def create_access_token(data: dict) -> str:
    """Creates a non-expiring JWT access token (no 'exp' claim)."""
    to_encode = data.copy()
    
    # Intentionally omitting 'exp' claim so the token never expires
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decodes token without checking expiration."""
    try:
        # options={"verify_exp": False} ensures PyJWT ignores expiration if present
        return jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM], 
            options={"verify_exp": False}
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"🔒 Auth Error: Invalid Token - {e}")
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """FastAPI Dependency to authenticate non-expiring Bearer JWT tokens."""
    token = credentials.credentials
    
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if not payload:
        raise unauthorized_exception

    user_id_str: Optional[str] = payload.get("sub")
    if not user_id_str:
        logger.warning("🔒 Auth Error: 'sub' missing from token payload.")
        raise unauthorized_exception

    try:
        user_id = uuid.UUID(str(user_id_str))
    except ValueError:
        logger.warning(f"🔒 Auth Error: 'sub' ({user_id_str}) is not a valid UUID.")
        raise unauthorized_exception

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        logger.warning(f"🔒 Auth Error: User {user_id} not found in PostgreSQL.")
        raise unauthorized_exception

    return user