from typing import List, Dict
from datetime import datetime, timezone
import models

def calculate_rankings(transactions: List[models.Transaction]) -> List[dict]:
    """
    Calculate a fair ranking algorithm based on:
    - total_amount (40%)
    - transaction_count (20%)
    - recency score (20%)
    - reliability score (20%)
    """
    user_stats = {}
    now = datetime.now(timezone.utc)
    
    # Gather raw stats per user
    for tx in transactions:
        uid = tx.user_id
        if uid not in user_stats:
            user_stats[uid] = {
                "total_amount": 0.0,
                "transaction_count": 0,
                "most_recent": datetime.min.replace(tzinfo=timezone.utc),
                "fraud_flags": 0,
                "micro_transactions": 0
            }
        
        # Calculate amount (treat debit as negative impact, or absolute depending on biz logic. Let's assume absolute volume here)
        user_stats[uid]["total_amount"] += abs(tx.amount)
        user_stats[uid]["transaction_count"] += 1
        
        # Recency
        # SQLite returns naive datetime sometimes, ensure it's timezone aware
        tx_time = tx.timestamp.replace(tzinfo=timezone.utc) if tx.timestamp.tzinfo is None else tx.timestamp
        if tx_time > user_stats[uid]["most_recent"]:
            user_stats[uid]["most_recent"] = tx_time
            
        # Abuse detection
        if abs(tx.amount) < 0.5:
            user_stats[uid]["micro_transactions"] += 1
            
        if tx.amount < 0 and tx.type == models.TransactionType.credit:
            user_stats[uid]["fraud_flags"] += 1
            
    if not user_stats:
        return []

    # Find max values for normalization
    max_amount = max(stats["total_amount"] for stats in user_stats.values()) or 1.0
    max_count = max(stats["transaction_count"] for stats in user_stats.values()) or 1

    rankings = []
    for uid, stats in user_stats.items():
        # 1. Normalized Amount (0 to 1)
        score_amount = stats["total_amount"] / max_amount
        
        # 2. Normalized Count (0 to 1)
        score_count = stats["transaction_count"] / max_count
        
        # 3. Recency Score (0 to 1 based on days since last transaction)
        days_ago = (now - stats["most_recent"]).days
        score_recency = max(0, 1 - (days_ago / 30)) # decays to 0 after 30 days
        
        # 4. Reliability Score (penalize fraud flags and excessive micro-transactions)
        reliability = 1.0
        if stats["fraud_flags"] > 0:
            reliability *= 0.5 # heavy penalty
        if stats["micro_transactions"] > (stats["transaction_count"] * 0.5):
            reliability *= 0.8 # penalty for farming
            
        score_reliability = reliability
        
        # Weighted sum
        final_score = (
            (score_amount * 0.4) +
            (score_count * 0.2) +
            (score_recency * 0.2) +
            (score_reliability * 0.2)
        )
        
        # Scale to 100 for display
        final_score_100 = round(final_score * 100, 2)
        
        rankings.append({
            "userId": uid,
            "score": final_score_100,
            "breakdown": {
                "amount": round(score_amount * 100, 2),
                "count": round(score_count * 100, 2),
                "recency": round(score_recency * 100, 2),
                "reliability": round(score_reliability * 100, 2)
            }
        })
        
    # Sort descending by score
    rankings.sort(key=lambda x: x["score"], reverse=True)
    
    # Assign ranks
    for i, rank_obj in enumerate(rankings):
        rank_obj["rank"] = i + 1
        
    return rankings
