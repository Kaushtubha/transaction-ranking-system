# FinRank: Premium SaaS Internship Project

A production-ready, highly-polished intern project demonstrating a FastAPI backend with concurrency safeguards, and a premium React frontend using Tailwind CSS and Framer Motion.

## Architecture

- **Backend**: Python, FastAPI, SQLAlchemy (SQLite)
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts

## Setup & Run Locally

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
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

## Core Features Explained

### 1. Idempotency and Concurrency Protections
The backend requires an `Idempotency-Key` header (UUID v4) on `POST /transaction`.
To prevent race conditions when two requests arrive simultaneously, we rely on a database Unique Constraint on `(idempotency_key, user_id)`. The database engine physically locks the table, allowing the first request to write and rejecting the second with an `IntegrityError`. The application catches this error and safely returns the first request's stored response.

### 2. Fair Ranking Algorithm
The algorithm normalizes metrics from 0 to 1 and applies weights:
- **Total Amount (40%)**: Normalized against the top spender.
- **Transaction Count (20%)**: Normalized against the most active user.
- **Recency (20%)**: Linearly decays to 0 after 30 days of inactivity.
- **Reliability (20%)**: Starts at 1.0. Penalized for micro-transaction farming.

## Deployment

### Frontend (Vercel)
1. Push to GitHub.
2. Import project in Vercel. Select `frontend` as the Root Directory.
3. Framework Preset: Vite. Add Environment Variable: `VITE_API_URL` pointing to your deployed backend.

### Backend (Render/Railway)
1. Push to GitHub.
2. Import project. Select `backend` as the Root Directory.
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
