from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.security import hash_password, verify_password
from app.core.jwt_handler import create_access_token

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register_user(self, dto: UserCreate):
        existing_user = await self.user_repo.get_by_email(dto.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered"
            )

        hashed_pwd = hash_password(dto.password)
        user_data = {
            "full_name": dto.full_name,
            "email": dto.email,
            "hashed_password": hashed_pwd
        }
        return await self.user_repo.create(user_data)

    async def authenticate_user(self, dto: UserLogin) -> dict:
        user = await self.user_repo.get_by_email(dto.email)
        if not user or not verify_password(dto.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        token = create_access_token(data={"sub": str(user.id)})
        return {
            "access_token": token,
            "token_type": "bearer"
        }