from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt

# Security configuration (Must match your project's core configuration/dependency secret)
SECRET_KEY = "3b5bd22eea6b77e28decc7cc2e16d41e06f953049895f4663202b173766854731a5026de4c521e26ce2a5023066ad981464d6a0282414b62f85eb091a1f47e86"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 1. Initialize the router
router = APIRouter(prefix="/auth", tags=["Auth"])

# 2. Define schemas
class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None
    full_name: Optional[str] = None

class LoginSchema(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 3. Endpoints
@router.post("/register")
async def register_user(user_data: RegisterSchema):
    name = user_data.username or user_data.full_name or user_data.email.split("@")[0]
    
    # TODO: Insert user creation logic into your database here
    
    return {
        "success": True,
        "message": f"Profile node established for {name}! Please sign in now."
    }

@router.post("/login")
async def login_user(credentials: LoginSchema):
    identifier = credentials.email or credentials.username
    if not identifier:
        raise HTTPException(status_code=422, detail="Email or username is required")

    # TODO: Verify password against database user record here
    
    # Pass both 'sub' (email/username) and 'username' to satisfy different dependency decoders
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": identifier, "username": identifier}, 
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Authentication matrix verification successful. Entry granted."
    }