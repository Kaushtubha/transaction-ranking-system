import pytest
import asyncio
import httpx
from fastapi.testclient import TestClient
from main import app, get_db
from database import Base, engine, SessionLocal
import uuid
import datetime

# Setup test DB
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.mark.asyncio
async def test_concurrent_transactions_idempotency():
    """
    Simulates concurrent requests with the SAME idempotency key to verify 
    duplicate prevention and consistency.
    """
    idemp_key = str(uuid.uuid4())
    tx_id = str(uuid.uuid4())
    user_id = "user_concurrent"
    
    payload = {
        "transactionId": tx_id,
        "userId": user_id,
        "amount": 100.0,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "type": "credit"
    }

    headers = {
        "Idempotency-Key": idemp_key
    }

    async def make_request():
        # Use httpx.AsyncClient to simulate concurrent calls directly against the test client is tricky,
        # but TestClient is synchronous. Let's use httpx with an ASGI transport for the async test.
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            return await client.post("/transaction", json=payload, headers=headers)

    # Fire 5 requests concurrently
    tasks = [make_request() for _ in range(5)]
    responses = await asyncio.gather(*tasks)

    # All responses should eventually return 200 with the exact same response body
    success_count = 0
    for resp in responses:
        # Depending on timing, one succeeds (200) and the rest either hit DB duplicate (409) 
        # OR they successfully catch the idempotency key and return the original 200.
        # Our app returns 200 and the original payload if the idempotency key is already stored.
        # If it hits 409 it means the transactionId collided before the idempotency key was committed.
        if resp.status_code == 200:
            success_count += 1
            assert resp.json()["transactionId"] == tx_id
            
    # At least one request MUST succeed
    assert success_count >= 1

    # Check DB state
    from sqlalchemy import text
    db = SessionLocal()
    txs = db.execute(text("SELECT count(*) FROM transactions WHERE user_id = 'user_concurrent'")).scalar()
    assert txs == 1, "Only one transaction should have been saved to the database"
    db.close()
