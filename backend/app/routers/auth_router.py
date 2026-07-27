from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.models.user_model import User

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register_user(payload: RegisterSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == payload.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered. Please sign in."
        )
    
    new_user = User(
        full_name=payload.full_name, 
        email=payload.email, 
        password_hash=payload.password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {"status": "success", "message": "Account created successfully. Please log in."}

@router.post("/login")
async def login_user(payload: LoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == payload.email))
    user = result.scalars().first()
    
    if not user or user.password_hash != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not found or invalid password. Please register first."
        )
    
    return {
        "status": "success",
        "token": "secure-jwt-token-verified",
        "message": "Login successful"
    }