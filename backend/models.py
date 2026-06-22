from sqlalchemy import Column, String, Float, DateTime, Enum, JSON, Integer, UniqueConstraint
import enum
from datetime import datetime, timezone
from database import Base

class TransactionType(str, enum.Enum):
    credit = "credit"
    debit = "debit"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    metadata_json = Column(JSON, nullable=True)

class IdempotencyRecord(Base):
    __tablename__ = "idempotency_keys"

    id = Column(Integer, primary_key=True, index=True)
    idempotency_key = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)
    response_body = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Prevent duplicate idempotency keys per user to avoid race conditions
    __table_args__ = (UniqueConstraint('idempotency_key', 'user_id', name='uix_idemp_user'),)
