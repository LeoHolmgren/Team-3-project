from pydantic import EmailStr
from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime, timezone

class Subscriber(SQLModel, table=True):
    __tablename__ = "email_subscribers"

    email_id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True)
    name: str
    zone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
