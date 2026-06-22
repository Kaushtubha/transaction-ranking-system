# Demo Script: FinRank (3-5 Minutes)

## 0:00 - 0:30: Introduction
* **Visual:** Camera looking at the recruiter/screen, then sharing the live frontend deployed URL.
* **Script:** "Hi, this is my submission for the internship assignment. I built a full-stack application using FastAPI and React, focusing heavily on robust backend concurrency and a visually impressive 3D frontend. Let's dive in."

## 0:30 - 1:30: The Frontend & Transaction Flow
* **Visual:** Show the 'Submit Transaction' page. Fill out a transaction.
* **Script:** "Here we have a sleek, glassmorphism UI. I'll submit a $500 credit transaction for `user_123`. Under the hood, the frontend automatically generates a UUID for the `transactionId` and an `Idempotency-Key`."
* **Visual:** Go to the 'Summary' tab. Search `user_123`.
* **Script:** "In the summary dashboard, we can see the live total volume and the transaction history updating instantly."

## 1:30 - 2:30: Backend Architecture & Concurrency Safegaurds
* **Visual:** Bring up the code editor, showing `crud.py` and `main.py`.
* **Script:** "To handle duplicate requests safely, the backend enforces an `Idempotency-Key` header. When a request arrives, we attempt to insert this key into the database. A unique constraint ensures that even if two requests hit the server at the exact same millisecond, the database engine prevents a race condition. The second request gracefully catches an `IntegrityError` and returns the successful payload of the first. This is fully tested via automated integration tests which simulate concurrent API calls."

## 2:30 - 3:30: Ranking Algorithm & The 3D Visualization
* **Visual:** Switch back to the frontend, click on the '3D Ranking' tab. Let the 3D scene load and animate.
* **Script:** "For the ranking requirement, I didn't want to just build a boring table. I built this interactive 3D podium using React Three Fiber. The algorithm calculates a fair score composed of 40% volume, 20% frequency, 20% recency, and 20% reliability (penalizing abuse like micro-transaction farming)."
* **Visual:** Hover the mouse over different glowing 3D bars to show the tooltips updating in real-time.
* **Script:** "As you can see, hovering over the top users provides a breakdown of exactly how their score was calculated."

## 3:30 - 4:00: Conclusion
* **Visual:** Show the GitHub repo and the automated test results running in the terminal.
* **Script:** "The code is fully typed, tested, and modular. You can easily switch out the SQLite database for Postgres in production. All instructions are in the README. Thank you for your time!"
