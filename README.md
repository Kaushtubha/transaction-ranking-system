# FinRank: Fullstack Internship Project

A complete, ready-to-deploy intern project demonstrating a FastAPI backend with concurrency safeguards, and an eye-catching React Three Fiber 3D frontend.

## Architecture

- **Backend**: Python, FastAPI, SQLAlchemy (SQLite)
- **Frontend**: React, Vite, React Three Fiber (3D graphics)

## Quick Start (Local Development)

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The API runs at `http://127.0.0.1:8000`. Swagger docs available at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

## Idempotency and Concurrency Protections

The backend requires an `Idempotency-Key` header (UUID v4) on `POST /transaction`.
1. **Idempotency**: The server checks the `idempotency_keys` table. If the key exists within the 24-hour TTL, it returns the previously stored response immediately without executing the transaction again.
2. **Concurrency**: A unique constraint on `(idempotency_key, user_id)` in the database prevents race conditions. If two identical requests hit the server simultaneously, SQLite's locking mechanism and the unique constraint ensure only the first one writes the key. The second request will fail with an `IntegrityError`, which the application catches and then fetches the successfully processed response from the first request to return to the client safely.

## Ranking Formula

The fair ranking algorithm normalizes metrics from 0 to 1 and applies weights to create a final score (max 100):
- **Total Amount (40%)**: Normalized against the top spender.
- **Transaction Count (20%)**: Normalized against the most active user.
- **Recency (20%)**: Linearly decays to 0 after 30 days of inactivity.
- **Reliability (20%)**: Starts at 1.0. Penalized for micro-transaction farming (50%+ tiny transactions) or negative credit (fraud flags).

## Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub.
2. Import project in Vercel. Select `frontend` as the Root Directory.
3. Framework Preset: Vite.
4. Add Environment Variable: `VITE_API_URL` pointing to your deployed backend.
5. Deploy.

### Backend (Railway/Render)
1. Push to GitHub.
2. Import project in Railway/Render. Select `backend` as the Root Directory.
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy. (Note: SQLite will be ephemeral on these platforms without a persistent volume. For production, switch `SQLALCHEMY_DATABASE_URL` to a Postgres connection string).
