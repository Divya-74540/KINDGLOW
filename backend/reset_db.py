import asyncio
import sys
from pathlib import Path
from sqlalchemy import text

sys.path.append(str(Path(__file__).resolve().parent))

from app.core.database import Base, engine
from app.models.user_model import User

async def reset_database():
    print("⏳ Dropping all tables...")
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS profiles, users CASCADE;"))
        print("🗑️ Dropped tables successfully.")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables re-created successfully!")

if __name__ == "__main__":
    asyncio.run(reset_database())