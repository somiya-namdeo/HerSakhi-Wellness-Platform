"""
routes/ai_routes.py
--------------------
AI chatbot endpoints:
  POST /ai/chat        — send a message to the Gemini-powered wellness assistant
  GET  /ai/tips        — fetch personalised wellness tips
"""

from fastapi import APIRouter, Depends, HTTPException, status

from models.ai_models import ChatRequest, ChatTurnResponse, ChatHistoryItem, WellnessTip
from services.ai_service import chat, get_chat_history
from services.rag_service import retrieve_relevant_context
from typing import List

router = APIRouter()


@router.get("/rag-test")
async def rag_test(query: str):
    """
    Test endpoint for RAG retrieval logic.
    Returns the top 3 relevant entries from the knowledge base.
    """
    try:
        results = retrieve_relevant_context(query)
        return {
            "query": query,
            "results_count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in RAG retrieval: {str(e)}"
        )


@router.post("/chat", response_model=ChatTurnResponse)
async def ai_chat(payload: ChatRequest):
    """
    Send a message to the AI assistant and get a mock response.
    Saves both to the chat_history table.
    """
    return await chat(payload.user_id, payload)


@router.get("/history/{user_id}", response_model=List[ChatHistoryItem])
async def get_history(user_id: str):
    """
    Retrieve all chat history for a specific user.
    """
    return await get_chat_history(user_id)
