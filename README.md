# Transaction Ranking System

A full-stack project built to process and rank financial transactions. It features a FastAPI backend and a React frontend with a dark theme.

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
The API will run at `http://127.0.0.1:8000`. You can check the Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173`.

## Features

- **Concurrency Handling**: Uses an `Idempotency-Key` header (UUID v4) on `POST /transaction` and a database unique constraint to prevent race conditions and duplicate transaction submissions.
- **Ranking Algorithm**: Ranks users based on a combination of transaction volume, frequency, recency, and reliability.

## Deployment

### Frontend (Vercel)
1. Push to GitHub.
2. Import the project in Vercel. Select `frontend` as the Root Directory.
3. Add Environment Variable: `VITE_API_URL` pointing to your deployed backend.

### Backend (Render/Railway)
1. Push to GitHub.
2. Import the project and select `backend` as the Root Directory.
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
