"""
models/ai_models.py
--------------------
Pydantic schemas for AI chatbot request/response payloads.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ChatMessage(BaseModel):
    """A single message in a conversation (role: 'user' | 'assistant')."""
    role: str = Field(..., pattern="^(user|assistant)$", example="user")
    content: str = Field(..., min_length=1, example="What should I eat during my period?")


class ChatRequest(BaseModel):
    """Payload for POST /ai/chat."""
    user_id: str
    user_message: str = Field(..., min_length=1)


class ChatHistoryItem(BaseModel):
    """A single record in the chat_history table."""
    id: str
    user_id: str
    text: str
    sender: str  # 'user' or 'ai'
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatTurnResponse(BaseModel):
    """Returns both the saved user message and the generated AI response."""
    user_message: ChatHistoryItem
    ai_response: ChatHistoryItem


class WellnessTip(BaseModel):
    """A single AI-generated wellness tip."""
    category: str = Field(..., example="nutrition")
    tip: str
    source: Optional[str] = None
