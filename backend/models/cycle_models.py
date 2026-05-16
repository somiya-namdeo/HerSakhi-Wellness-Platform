"""
models/cycle_models.py
-----------------------
Pydantic schemas for the daily period tracker log.

Expected Supabase table — 'cycle_logs':
  id              uuid  primary key default gen_random_uuid()
  user_id         uuid  not null references profiles(id)
  log_date        date  not null
  flow_intensity  text  (light | medium | heavy | spotting)
  pain_level      int   (0–10)
  mood            text
  symptoms        text[]
  notes           text
  created_at      timestamptz default now()
  updated_at      timestamptz default now()

  CONSTRAINT uq_cycle_logs_user_date UNIQUE (user_id, log_date)
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------

class CycleLogRequest(BaseModel):
    """Payload for POST /cycles/log — save or update a daily tracker entry."""

    user_id: str = Field(
        ...,
        description="UUID of the authenticated user",
        examples=["d290f1ee-6c54-4b01-90e6-d701748f0851"],
    )
    log_date: date = Field(
        ...,
        description="Calendar date for this entry (YYYY-MM-DD)",
        examples=["2026-05-15"],
    )
    flow_intensity: Optional[str] = Field(
        None,
        description="Flow intensity selected by the user",
        examples=["Medium"],
    )
    pain_level: Optional[int] = Field(
        None,
        ge=0,
        le=10,
        description="Pain level on a 0-10 scale",
        examples=[4],
    )
    mood: Optional[str] = Field(
        None,
        description="Mood label selected by the user",
        examples=["Happy"],
    )
    symptoms: Optional[List[str]] = Field(
        default_factory=list,
        description="List of symptom strings selected by the user",
        examples=[["Cramps", "Fatigue"]],
    )
    notes: Optional[str] = Field(
        None,
        max_length=1000,
        description="Free-text notes for the day",
        examples=["Felt a bit tired today."],
    )


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------

class CycleLogResponse(BaseModel):
    """Single cycle log entry returned by the API."""

    id: str
    user_id: str
    log_date: str          # returned as ISO string from Supabase
    flow_intensity: Optional[str] = None
    pain_level: Optional[int] = None
    mood: Optional[str] = None
    symptoms: Optional[List[str]] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class CycleLogListResponse(BaseModel):
    """Response for GET /cycles/logs/{user_id}."""

    logs: List[CycleLogResponse]
    total: int


# ---------------------------------------------------------------------------
# Legacy schemas kept for backward compatibility with existing stub routes
# ---------------------------------------------------------------------------

class CycleSummary(BaseModel):
    """Aggregated statistics returned by GET /cycles/summary (future)."""
    average_cycle_length: Optional[float] = None
    average_period_length: Optional[float] = None
    most_common_symptoms: Optional[List[str]] = None
    total_logs: int = 0
