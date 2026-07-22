from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    dto: UserCreate, 
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(UserRepository(db))
    return await service.register_user(dto)

@router.post("/login", response_model=TokenResponse)
async def login(
    dto: UserLogin, 
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(UserRepository(db))
    return await service.authenticate_user(dto)