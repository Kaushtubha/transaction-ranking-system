from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone, timedelta
import models, schemas
import json

IDEMPOTENCY_TTL_HOURS = 24

def check_idempotency(db: Session, idempotency_key: str, user_id: str):
    """
    Checks if an idempotency key exists for the user.
    If it does and is within TTL, returns the stored response.
    """
    record = db.query(models.IdempotencyRecord).filter(
        models.IdempotencyRecord.idempotency_key == idempotency_key,
        models.IdempotencyRecord.user_id == user_id
    ).first()
    
    if record:
        # Check TTL
        created_at = record.created_at.replace(tzinfo=timezone.utc) if record.created_at.tzinfo is None else record.created_at
        if datetime.now(timezone.utc) - created_at < timedelta(hours=IDEMPOTENCY_TTL_HOURS):
            return record.response_body
    return None

def store_idempotency(db: Session, idempotency_key: str, user_id: str, response_body: dict):
    """
    Stores the idempotency key and response.
    Because of the unique constraint on (idempotency_key, user_id),
    concurrent requests will fail with IntegrityError if they try to insert the same key.
    """
    record = models.IdempotencyRecord(
        idempotency_key=idempotency_key,
        user_id=user_id,
        response_body=response_body
    )
    try:
        db.add(record)
        db.commit()
    except IntegrityError:
        db.rollback()
        # This means another thread just inserted it. We can handle it in the caller.
        raise

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(
        transaction_id=transaction.transactionId,
        user_id=transaction.userId,
        amount=transaction.amount,
        timestamp=transaction.timestamp,
        type=transaction.type,
        metadata_json=transaction.metadata
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_user_transactions(db: Session, user_id: str):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).order_by(models.Transaction.timestamp.desc()).all()

def get_all_transactions(db: Session):
    return db.query(models.Transaction).all()
