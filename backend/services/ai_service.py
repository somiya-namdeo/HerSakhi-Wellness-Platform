"""
services/ai_service.py
-----------------------
Business logic for the RAG + Gemini-powered HerSakhi AI wellness chatbot.
"""

from fastapi import HTTPException, status
import os
from dotenv import load_dotenv
from database.supabase_client import supabase
from models.ai_models import ChatRequest, ChatTurnResponse, ChatHistoryItem, WellnessTip
from services.rag_service import retrieve_relevant_context
from typing import List

import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are HerSakhi, a safe, empathetic, and knowledgeable women’s wellness assistant.

You help users with:
- menstrual health
- PMS
- cramps
- PCOS awareness
- hygiene
- nutrition
- mental wellness
- exercise and yoga
- emergency symptom awareness

Rules:
- Be supportive, clear, and beginner-friendly.
- Do not diagnose diseases.
- Do not prescribe medicine.
- For severe symptoms, encourage consulting a healthcare professional.
- If emergency symptoms are mentioned, advise urgent medical help.
- Use the provided knowledge base context whenever relevant.
"""


def build_rag_prompt(user_message: str) -> str:
    """
    Builds the RAG prompt using retrieved local dataset context.
    """
    try:
        context_items = retrieve_relevant_context(user_message, top_k=3)
    except Exception:
        context_items = []

    context_text = ""

    if context_items:
        for idx, item in enumerate(context_items, start=1):
            context_text += f"""
Context {idx}:
Topic: {item.get("topic", "")}
Category: {item.get("category", "")}
Severity: {item.get("severity", "")}
Question: {item.get("question", "")}
Answer: {item.get("answer", "")}
"""
    else:
        context_text = "No matching local knowledge base context found."

    final_prompt = f"""
{SYSTEM_PROMPT}

Relevant knowledge base context:
{context_text}

User question:
{user_message}

Answer as HerSakhi in a warm, concise, safe, and helpful way.
If the user describes severe pain, heavy bleeding, fainting, chest pain, suicidal thoughts, or emergency symptoms, clearly advise urgent professional help.
"""

    return final_prompt


def generate_gemini_response(user_message: str) -> str:
    """
    Generates AI response using Gemini + RAG context.
    """
    if not GEMINI_API_KEY:
        return "I’m currently unable to access the AI service. Please check the Gemini API key configuration."

    try:
        prompt = build_rag_prompt(user_message)

        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content(prompt)

        if response and response.text:
            return response.text.strip()

        return "I understand. Let me help you with that."

    except Exception as exc:
        print("Gemini error:", exc)
        return "I’m currently unable to answer. Please try again shortly."


async def save_chat_turn(user_id: str, user_message: str) -> ChatTurnResponse:
    """
    Persists user message and Gemini-generated AI response to chat_history table.
    """

    ai_text = generate_gemini_response(user_message)

    user_row = {
        "user_id": user_id,
        "text": user_message,
        "sender": "user"
    }

    ai_row = {
        "user_id": user_id,
        "text": ai_text,
        "sender": "ai"
    }

    try:
        result = supabase.table("chat_history").insert([user_row, ai_row]).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase error: {exc}"
        )

    if not result.data or len(result.data) < 2:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist chat history."
        )

    sorted_data = sorted(result.data, key=lambda x: x.get("created_at", ""))

    u_msg = next(m for m in sorted_data if m["sender"] == "user")
    a_msg = next(m for m in sorted_data if m["sender"] == "ai")

    return ChatTurnResponse(
        user_message=ChatHistoryItem(**u_msg),
        ai_response=ChatHistoryItem(**a_msg)
    )


async def get_chat_history(user_id: str) -> List[ChatHistoryItem]:
    """
    Fetch all historical messages for a specific user, sorted chronologically.
    """
    try:
        result = (
            supabase.table("chat_history")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch chat history: {exc}"
        )

    return [ChatHistoryItem(**row) for row in result.data]


async def chat(user_id: str, payload: ChatRequest) -> ChatTurnResponse:
    """
    RAG + Gemini chat wrapper.
    """
    return await save_chat_turn(user_id, payload.user_message)


async def get_tips(user_id: str) -> List[WellnessTip]:
    """
    Placeholder for future personalised wellness tips.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Coming soon"
    )