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
import re

import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are HerSakhi, a warm, safe, caring, and deeply empathetic women's wellness assistant.

You help users with general questions on menstrual health, PMS, cramps, PCOS awareness, hygiene, nutrition, mental wellness, and self-care.

Strict Style & Health Safety Rules:
1. RESPONSE LENGTH:
   - Keep your entire response concise and direct, limited strictly to around 4 to 6 sentences. Do not write long paragraphs or generate massive list walls.
2. TONALITY & STYLE:
   - Always maintain a warm, gentle, friendly, and caring tone.
   - For normal, low-risk questions (e.g., basic period care, nutrition tips, hygiene, regular cramps), keep the response calm, practical, and highly focused on simple tips.
3. STRICT WARNING POLICY (AVOID OVER-WARNING):
   - Do NOT mention emergency symptoms, doctors, or medical warnings unless the user's query explicitly describes or includes high-risk conditions: severe pain, very heavy bleeding, fainting, chest pain, suicidal thoughts, high fever, vomiting, dizziness, or unusual discharge.
   - For normal questions, answer with practical tips only. Absolutely avoid repetitive boilerplate warning templates or unnecessary canned medical disclaimers.
4. RAG CONTEXT PRIVACY (INTERNAL USE ONLY):
   - The provided reference knowledge is for your internal knowledge retrieval only. NEVER cite, reference, or mention the terms "context", "dataset", "database", "knowledge base", "source", "provided document", "retrieved info", "Context 1/2/3", or bracketed references like "[1]", "[Context 1]".
   - DO NOT generate fake links, bracketed links, or URLs.
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
        for item in context_items:
            context_text += f"""
Topic: {item.get("topic", "")}
Category: {item.get("category", "")}
Severity: {item.get("severity", "")}
Question: {item.get("question", "")}
Answer: {item.get("answer", "")}
---
"""
    else:
        context_text = "No matching local knowledge base context found."

    final_prompt = f"""
{SYSTEM_PROMPT}

Reference Knowledge (Use this to formulate your response, but do NOT mention the word "context" or cite it in your reply):
{context_text}

User Question:
{user_message}

Remember: Be warm, caring, concise, and direct. Synthesize the reference knowledge naturally in your own words without mentioning dataset, context, sources, or links. Keep your response practical and focused.
"""

    return final_prompt


def clean_response(text: str) -> str:
    """
    Cleans up any leaked RAG/context terms, fake links, or citation meta-talk
    that Gemini might have outputted.
    """
    if not text:
        return text

    # Remove brackets like [Context 1], [Link to Context 2], [1], etc.
    text = re.sub(r'\[(?:[^\]]*?(?:context|link|source|dataset)[^\]]*?|\d+)\]', '', text, flags=re.IGNORECASE)

    # Remove phrases like "according to Context X", "based on the dataset", "according to the dataset"
    text = re.sub(r'\b(?:according\s+to|based\s+on)\s+(?:the\s+)?(?:(?:context|dataset|knowledge\s+base|retrieved\s+info)\s*(?:\d+)?|\d+)\b,?:?\s*', '', text, flags=re.IGNORECASE)
    
    # Remove phrases like "as seen in Context 1", "as mentioned in the context", etc.
    text = re.sub(r'\b(?:as\s+)?(?:mentioned|seen|shown|provided)\s+in\s+(?:the\s+)?(?:(?:context|dataset|knowledge\s+base|retrieved\s+info)\s*(?:\d+)?|\d+)\b,?:?\s*', '', text, flags=re.IGNORECASE)
    
    # Remove standalone patterns like "Context 1", "Context 2", "Context 3", "Context 1:", etc.
    text = re.sub(r'\bcontext\s+\d+[:\s]?', '', text, flags=re.IGNORECASE)
    
    # Clean up spaces before punctuation
    text = re.sub(r'\s+([.,!?])', r'\1', text)
    text = re.sub(r'\s{2,}', ' ', text)
    
    # Clean up leftover leading colons, periods, or commas
    text = re.sub(r'^[.,;:!?\s]+', '', text)
    text = text.strip()
    
    # Capitalize the first letter if it got lowercased during deletion
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
        
    return text


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
            cleaned = clean_response(response.text.strip())
            return cleaned if cleaned else "I understand. Let me help you with that."

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