import uuid
from sqlalchemy import Column, String, ARRAY, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    skin_type = Column(String(50), nullable=False)  # oily, dry, combination, sensitive, normal
    skin_concerns = Column(ARRAY(String), nullable=False)  # ["acne", "hyperpigmentation"]
    climate = Column(String(50), nullable=True)  # humid, dry, temperate
    age_group = Column(String(20), nullable=True)  # 18-24, 25-34, etc.
    known_allergies = Column(ARRAY(String), nullable=True)  # ["fragrance", "parabens"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")