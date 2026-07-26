from pydantic import BaseModel, EmailStr
from app.schemas.user_schema import UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse  # Changed from 'object' to 'UserResponse'

    class Config:
        from_attributes = True