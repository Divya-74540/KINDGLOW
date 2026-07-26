from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate
from app.schemas.auth_schema import LoginRequest
from app.core.security import verify_password
from app.core.jwt_handler import create_access_token

class AuthService:
    @staticmethod
    async def register(db: AsyncSession, user_in: UserCreate):
        existing_user = await UserRepository.get_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered."
            )
        return await UserRepository.create_user(db, user_in)

    @staticmethod
    async def login(db: AsyncSession, login_in: LoginRequest):
        user = await UserRepository.get_by_email(db, login_in.email)
        if not user or not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive."
            )
            
        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer", "user": user}