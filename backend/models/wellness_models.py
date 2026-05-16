"""
models/wellness_models.py
--------------------------
Pydantic schemas for the daily wellness tracker (hydration, sleep, energy, etc.).

Expected Supabase table — 'wellness_logs':
  id              uuid  primary key default gen_random_uuid()
  user_id         uuid  not null references profiles(id)
  log_date        date  not null
  hydration       int   (cups of water)
  sleep_hours     float (hours of sleep)
  energy_level    int   (0-10 or mapped labels)
  stress_level    int   (0-10)
  activity_count  int   (steps or exercise sessions)
  created_at      timestamptz default now()
  updated_at      timestamptz default now()

  CONSTRAINT uq_wellness_logs_user_date UNIQUE (user_id, log_date)
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class WellnessLogRequest(BaseModel):
    """Payload for POST /wellness/log — save or update a daily wellness entry."""

    user_id: str = Field(..., description="UUID of the authenticated user")
    log_date: date = Field(..., description="Calendar date for this entry (YYYY-MM-DD)")
    hydration: int = Field(0, ge=0, description="Cups of water consumed")
    sleep_hours: float = Field(0.0, ge=0, description="Hours of sleep")
    energy_level: int = Field(5, ge=0, le=10, description="Energy level on a 0-10 scale")
    stress_level: int = Field(0, ge=0, le=10, description="Stress level on a 0-10 scale")
    activity_count: int = Field(0, ge=0, description="Count of physical activities or sessions")


class WellnessLogResponse(BaseModel):
    """Single wellness log entry returned by the API."""

    id: str
    user_id: str
    log_date: str          # ISO string from database
    hydration: int
    sleep_hours: float
    energy_level: int
    stress_level: int
    activity_count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class WellnessLogListResponse(BaseModel):
    """Response for GET /wellness/logs/{user_id}."""
    logs: List[WellnessLogResponse]
    total: int
