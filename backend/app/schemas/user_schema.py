import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Schema for incoming registration requests
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

# Schema for incoming login requests
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema returned after successful registration or user details fetch
class UserResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Schema returned after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"