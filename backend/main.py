from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models, schemas, crud, ranking
from database import SessionLocal, engine
import time

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Transaction & Ranking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/transaction", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    idempotency_key = request.headers.get("Idempotency-Key")
    if not idempotency_key:
        raise HTTPException(status_code=400, detail="Idempotency-Key header is required")

    if transaction.amount < 0 and transaction.type == models.TransactionType.credit:
        raise HTTPException(status_code=400, detail="Invalid payload: credit amount cannot be negative")

    # 1. Check idempotency
    existing_response = crud.check_idempotency(db, idempotency_key, transaction.userId)
    if existing_response:
        return existing_response

    # 2. Process transaction (with locking / safe constraints)
    try:
        # In SQLite, the whole DB is locked for write, so concurrency is inherently safe at DB level.
        # Unique constraints prevent duplicate transactionId.
        created_tx = crud.create_transaction(db, transaction)
    except IntegrityError as e:
        db.rollback()
        # This might be a duplicate transactionId or idempotency_key inserted just now
        raise HTTPException(status_code=409, detail="Transaction conflict or duplicate detected.")

    # Prepare response
    response_data = schemas.TransactionResponse(
        transactionId=created_tx.transaction_id,
        userId=created_tx.user_id,
        amount=created_tx.amount,
        timestamp=created_tx.timestamp,
        type=created_tx.type,
        status="success"
    ).model_dump()

    # Need to convert datetime to string for JSON serialization in SQLite
    response_data["timestamp"] = response_data["timestamp"].isoformat()

    # 3. Store idempotency key
    try:
        crud.store_idempotency(db, idempotency_key, transaction.userId, response_data)
    except IntegrityError:
        # If storing fails, it means another thread just finished processing the exact same key.
        # We can fetch the other thread's result and return it.
        existing = crud.check_idempotency(db, idempotency_key, transaction.userId)
        if existing:
             return existing
        raise HTTPException(status_code=500, detail="Failed to store idempotency record.")

    return response_data

@app.get("/summary/{userId}", response_model=schemas.UserSummary)
def get_summary(userId: str, db: Session = Depends(get_db)):
    txs = crud.get_user_transactions(db, userId)
    if not txs:
        return schemas.UserSummary(
            userId=userId,
            total_amount=0.0,
            transaction_count=0,
            last_transaction_date=None,
            transactions=[]
        )
    
    total = sum(tx.amount for tx in txs)
    
    # Mapping for response
    tx_responses = []
    for tx in txs:
        tx_responses.append(schemas.TransactionResponse(
            transactionId=tx.transaction_id,
            userId=tx.user_id,
            amount=tx.amount,
            timestamp=tx.timestamp,
            type=tx.type,
            status="success"
        ))

    return schemas.UserSummary(
        userId=userId,
        total_amount=total,
        transaction_count=len(txs),
        last_transaction_date=txs[0].timestamp,
        transactions=tx_responses
    )

@app.get("/ranking", response_model=list[schemas.RankEntry])
def get_ranking(db: Session = Depends(get_db)):
    txs = crud.get_all_transactions(db)
    rankings = ranking.calculate_rankings(txs)
    # Return top 20 for demo performance
    return rankings[:20]
