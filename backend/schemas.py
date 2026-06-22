from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from models import TransactionType

class TransactionCreate(BaseModel):
    transactionId: str
    userId: str
    amount: float
    timestamp: datetime
    type: TransactionType
    metadata: Optional[Dict[str, Any]] = None

class TransactionResponse(BaseModel):
    transactionId: str
    userId: str
    amount: float
    timestamp: datetime
    type: TransactionType
    status: str

    class Config:
        from_attributes = True

class UserSummary(BaseModel):
    userId: str
    total_amount: float
    transaction_count: int
    last_transaction_date: Optional[datetime]
    transactions: list[TransactionResponse]

class RankEntry(BaseModel):
    userId: str
    score: float
    rank: int
    breakdown: Dict[str, float]
