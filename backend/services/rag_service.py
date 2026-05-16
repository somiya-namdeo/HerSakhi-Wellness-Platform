import json
import os
from typing import List, Dict

# Path to the knowledge base dataset
DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "womens_wellness_knowledge.json")

def load_knowledge_base() -> List[Dict]:
    """
    Loads the JSON knowledge base from the data directory.
    Returns an empty list if the file is missing or invalid.
    """
    if not os.path.exists(DATASET_PATH):
        print(f"Warning: Knowledge base file not found at {DATASET_PATH}")
        return []
    
    try:
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading knowledge base: {e}")
        return []

def retrieve_relevant_context(user_query: str, top_k=3) -> List[Dict]:
    """
    Retrieves the top_k most relevant entries from the knowledge base based on a simple keyword scoring.
    
    Scoring Logic:
    - Matches user query (lowercased) against:
        - topic
        - keywords (list of strings)
        - question
        - category
    - Each match increases the score.
    - Fields are weighted: topic and keywords have higher weight than question and category.
    """
    kb = load_knowledge_base()
    if not kb:
        return []

    query_words = user_query.lower().split()
    scored_entries = []

    for entry in kb:
        score = 0
        
        # Prepare searchable strings
        topic = entry.get("topic", "").lower()
        keywords = [k.lower() for k in entry.get("keywords", [])]
        question = entry.get("question", "").lower()
        category = entry.get("category", "").lower()

        for word in query_words:
            # Topic match (Weight: 3)
            if word in topic:
                score += 3
            
            # Keywords match (Weight: 3 per keyword)
            for kw in keywords:
                if word in kw:
                    score += 3
            
            # Question match (Weight: 2)
            if word in question:
                score += 2
            
            # Category match (Weight: 1)
            if word in category:
                score += 1
        
        if score > 0:
            scored_entries.append({
                "score": score,
                "data": {
                    "topic": entry.get("topic"),
                    "question": entry.get("question"),
                    "answer": entry.get("answer"),
                    "category": entry.get("category"),
                    "severity": entry.get("severity")
                }
            })

    # Sort by score descending
    scored_entries.sort(key=lambda x: x["score"], reverse=True)

    # Return top_k entries (extracting the 'data' part)
    return [item["data"] for item in scored_entries[:top_k]]
