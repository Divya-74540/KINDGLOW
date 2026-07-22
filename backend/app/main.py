from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.routers import auth_router, profile_router, ai_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing KINDGLOW API Backend...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    print("🛑 Shutting down server...")

app = FastAPI(title="KINDGLOW API", lifespan=lifespan)

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(profile_router.router, prefix="/api/v1/profile", tags=["Profile"])
app.include_router(ai_router.router, prefix="/api/v1/ai", tags=["AI Consultation"])