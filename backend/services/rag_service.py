import json
import os
from typing import List, Dict

# Standard scikit-learn imports for TF-IDF similarity
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    print("Warning: scikit-learn not installed. RAG will fall back to keyword search.")

# Path to the knowledge base data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

# In-memory caches for TF-IDF vectors
_vectorizer = None
_tfidf_matrix = None
_kb = []

def load_knowledge_base() -> List[Dict]:
    """
    Loads all JSON files from the data directory and merges them.
    Skips invalid or corrupted files safely.
    """
    if not os.path.exists(DATA_DIR):
        print(f"Warning: Data directory not found at {DATA_DIR}")
        return []
    
    merged_kb = []
    files_loaded = 0
    
    try:
        filenames = os.listdir(DATA_DIR)
    except Exception as e:
        print(f"Error listing data directory: {e}")
        return []
        
    for filename in filenames:
        if filename.endswith(".json"):
            file_path = os.path.join(DATA_DIR, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        merged_kb.extend(data)
                        files_loaded += 1
                    else:
                        print(f"Warning: Expected list in {filename}, got {type(data)}")
            except Exception as e:
                print(f"Error loading file {filename}: {e}")
                continue
                
    print(f"RAG Loader: Loaded {files_loaded} files successfully.")
    print(f"RAG Loader: Total entries loaded: {len(merged_kb)}")
    return merged_kb

def initialize_tfidf(force=False):
    """
    Fits TF-IDF vectorizer and transforms the merged knowledge base into TF-IDF vectors.
    """
    global _vectorizer, _tfidf_matrix, _kb
    if _tfidf_matrix is not None and not force:
        return

    # Load merged knowledge base if not loaded
    if not _kb:
        _kb = load_knowledge_base()

    if not _kb:
        print("RAG Warning: Knowledge base is empty, cannot initialize TF-IDF.")
        return

    if not HAS_SKLEARN:
        print("RAG Warning: scikit-learn is not available. Skipping TF-IDF initialization.")
        return

    try:
        print("RAG: Creating TF-IDF matrix for knowledge base...")
        texts = []
        for entry in _kb:
            topic = entry.get("topic", "") or ""
            question = entry.get("question", "") or ""
            answer = entry.get("answer", "") or ""
            category = entry.get("category", "") or ""
            
            # Extract keywords safely
            kw_val = entry.get("keywords", [])
            if isinstance(kw_val, list):
                keywords = " ".join(kw_val)
            else:
                keywords = str(kw_val)
                
            searchable_text = f"{topic} {question} {answer} {keywords} {category}"
            texts.append(searchable_text)

        # Initialize and fit TF-IDF vectorizer
        _vectorizer = TfidfVectorizer(stop_words='english', lowercase=True)
        _tfidf_matrix = _vectorizer.fit_transform(texts)
        print("RAG: TF-IDF matrix created successfully.")
    except Exception as e:
        print(f"RAG Error: Failed to create TF-IDF matrix: {e}")
        _vectorizer = None
        _tfidf_matrix = None

def retrieve_relevant_context(user_query: str, top_k=3, debug=False) -> List[Dict]:
    """
    Retrieves the top_k most relevant entries from the knowledge base.
    Uses enhanced TF-IDF cosine similarity with keyword, topic, category intent,
    and severity boosting, falling back to keyword scoring if anything fails.
    """
    global _kb, _vectorizer, _tfidf_matrix
    
    # Ensure merged knowledge base is loaded
    if not _kb:
        _kb = load_knowledge_base()
        
    if not _kb:
        return []

    # If scikit-learn is available, attempt TF-IDF retrieval with boosting
    if HAS_SKLEARN:
        # Lazy generate TF-IDF matrix
        if _tfidf_matrix is None:
            initialize_tfidf()
            
        if _vectorizer is not None and _tfidf_matrix is not None:
            try:
                # 1. Vectorize user query
                query_vec = _vectorizer.transform([user_query])
                
                # 2. Compute base cosine similarity scores
                similarity_scores = cosine_similarity(query_vec, _tfidf_matrix)[0]
                
                # 3. Define intent and emergency mappings for boosting
                INTENT_WORDS = {
                    "mental_wellness": ["mood", "anxious", "anxiety", "stress", "sad", "emotional", "overwhelmed", "panic", "irritated", "burnout"],
                    "nutrition": ["eat", "food", "drink", "water", "hydration", "cravings", "iron", "magnesium", "calcium", "bloating"],
                    "menstrual_health": ["cramps", "bleeding", "flow", "period pain", "back pain", "spotting", "pms"],
                    "pcos_awareness": ["pcos", "acne", "facial hair", "weight gain", "irregular periods", "hormones"],
                    "hygiene": ["pad", "tampon", "cup", "smell", "odor", "infection", "discharge", "hygiene"],
                    "exercise_and_yoga": ["yoga", "exercise", "workout", "stretching", "walking"],
                    "emergency_guidance": ["fainting", "chest pain", "suicidal", "severe bleeding", "emergency", "fever", "vomiting"]
                }
                
                # Pre-process query
                user_query_lower = user_query.lower()
                query_words = [w.strip("?,.!\"'") for w in user_query_lower.split() if w.strip("?,.!\"'")]
                query_words_set = set(query_words)
                
                # Detect query intent categories safely avoiding substring bugs (e.g. "eat" in "sweat")
                detected_categories = []
                for cat, words in INTENT_WORDS.items():
                    for w in words:
                        if " " in w:
                            if w in user_query_lower:
                                detected_categories.append(cat)
                                break
                        else:
                            if w in query_words_set:
                                detected_categories.append(cat)
                                break
                                
                has_emergency = "emergency_guidance" in detected_categories
                
                # 4. Calculate boosted scores for all entries
                scored_entries = []
                for idx, entry in enumerate(_kb):
                    base_score = float(similarity_scores[idx])
                    boosted_score = base_score
                    
                    entry_category = str(entry.get("category", "")).lower().strip()
                    severity = str(entry.get("severity", "")).lower().strip()
                    
                    # A. Keyword Boosting
                    keywords = entry.get("keywords", [])
                    exact_matches = 0
                    partial_matches = 0
                    
                    kw_list = []
                    if isinstance(keywords, list):
                        kw_list = [str(k).lower().strip() for k in keywords if k]
                    elif keywords:
                        kw_list = [str(keywords).lower().strip()]
                        
                    for qw in query_words:
                        for kw in kw_list:
                            if qw == kw:
                                exact_matches += 1
                            elif qw in kw or kw in qw:
                                partial_matches += 1
                                
                    boosted_score += (exact_matches * 0.4) + (partial_matches * 0.15)
                    
                    # B. Topic Boosting
                    topic = str(entry.get("topic", "")).lower()
                    topic_words = [w.strip("?,.!\"'") for w in topic.split() if w.strip("?,.!\"'")]
                    topic_matches = 0
                    for tw in topic_words:
                        if tw in query_words:
                            topic_matches += 1
                    boosted_score += (topic_matches * 0.25)
                    
                    # C. Category Intent Boosting
                    if entry_category in detected_categories:
                        boosted_score += 0.5
                        
                    # Ensure document has some relevance before applying generic boosts
                    # A document is relevant if it has a decent TF-IDF score or got keyword/topic/intent boosts
                    is_relevant = base_score > 0.05 or boosted_score > base_score
                        
                    # D. Severity Handling
                    is_emergency_entry = (severity == "high" or entry_category == "emergency_guidance")
                    if has_emergency:
                        if is_emergency_entry:
                            boosted_score += 1.0
                    else:
                        if is_emergency_entry:
                            # Strongly penalize emergency entries if there's no emergency intent
                            boosted_score -= 1.5
                        elif is_relevant and severity in ["low", "medium"]:
                            # Only boost low/medium severity if the document is actually relevant
                            boosted_score += 0.2
                            
                    # Penalize completely irrelevant documents to drop them from results
                    if not is_relevant and boosted_score == 0.0:
                        boosted_score = -2.0
                            
                    scored_entries.append({
                        "entry": entry,
                        "boosted_score": boosted_score,
                        "base_score": base_score
                    })
                    
                # 5. Sort by boosted score descending
                scored_entries.sort(key=lambda x: x["boosted_score"], reverse=True)
                
                # 6. Extract top_k results
                results = []
                for item in scored_entries[:top_k]:
                    entry = item["entry"]
                    result_data = {
                        "topic": entry.get("topic"),
                        "question": entry.get("question"),
                        "answer": entry.get("answer"),
                        "category": entry.get("category"),
                        "severity": entry.get("severity")
                    }
                    if debug:
                        result_data["_debug_score"] = item["boosted_score"]
                        result_data["_base_score"] = item["base_score"]
                    results.append(result_data)
                return results
            except Exception as e:
                print(f"RAG Warning: Boosted TF-IDF retrieval failed, falling back to keyword search. Error: {e}")

    # Fallback keyword scoring logic
    print("RAG: Performing fallback keyword search...")
    query_words = [w.strip("?,.!\"'") for w in user_query.lower().split() if w.strip("?,.!\"'")]
    scored_entries = []

    for entry in _kb:
        score = 0
        topic = entry.get("topic", "").lower()
        keywords = [k.lower() for k in entry.get("keywords", [])]
        question = entry.get("question", "").lower()
        category = entry.get("category", "").lower()

        for word in query_words:
            if word in topic:
                score += 3
            for kw in keywords:
                if word in kw:
                    score += 3
            if word in question:
                score += 2
            if word in category:
                score += 1
        
        if score > 0:
            result_data = {
                "topic": entry.get("topic"),
                "question": entry.get("question"),
                "answer": entry.get("answer"),
                "category": entry.get("category"),
                "severity": entry.get("severity")
            }
            if debug:
                result_data["_debug_score"] = score
            scored_entries.append({
                "score": score,
                "data": result_data
            })

    scored_entries.sort(key=lambda x: x["score"], reverse=True)
    return [item["data"] for item in scored_entries[:top_k]]
