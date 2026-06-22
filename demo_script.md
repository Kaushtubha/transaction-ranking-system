# Demo Script: FinRank (Premium SaaS Edition) - 3-5 Minutes

## 0:00 - 0:45: Introduction & The Startup Pitch
* **Visual:** Camera looking at the recruiter, then sharing the live frontend deployed URL.
* **Script:** "Hi, this is my submission for the internship assignment. I wanted to go beyond a typical student project and build something that looks like a funded, premium SaaS product. I used FastAPI on the backend for raw performance, and React with Tailwind CSS, Framer Motion, and Zustand on the frontend for a sleek, glassmorphism UX. Let me show you."

## 0:45 - 1:45: The Dashboard & Analytics
* **Visual:** Show the 'Dashboard' page. Hover over the Recharts graph.
* **Script:** "Here is the main dashboard. We have global state managed by Zustand, meaning data loads instantly across pages. I'll submit a $500 transaction. Notice the loading spinner and the instant Toast notification. The Recharts activity timeline and the wallet metrics update immediately."

## 1:45 - 2:45: Backend Architecture & The Idempotency Layer
* **Visual:** Bring up the code editor, showing `crud.py` and `test_concurrency.py`.
* **Script:** "What happens if a user accidentally double-clicks 'Submit' exactly at the same millisecond? On the backend, we use an `Idempotency-Key` header combined with a database Unique Constraint. Because the database engine physically locks the table, it prevents race conditions at the lowest level. If a duplicate arrives, we catch the `IntegrityError` and safely return the stored response. This is all proven by automated integration tests."

## 2:45 - 3:45: Fair Ranking Algorithm
* **Visual:** Switch back to the frontend, click on the 'Leaderboard' tab. Let the Framer Motion list animate in.
* **Script:** "For the ranking requirement, I built a fair, multi-factor algorithm. It normalizes Volume (40%), Frequency (20%), Recency (20%), and Reliability (20%). If someone tries to spam 1-cent transactions, the reliability score plummets and they get a 'Flagged' tag, preventing abuse. You can see the exact breakdown for every user in these animated cards."

## 3:45 - 4:00: Conclusion
* **Visual:** Show the GitHub repo structure and the comprehensive `interview_prep.md`.
* **Script:** "The code is fully typed, heavily documented, and includes an `interview_prep` guide explaining the architecture in simple English. Thank you for your time!"
