"""
models/onboarding_models.py
-----------------------------
Pydantic schemas for the onboarding flow.

Expected Supabase table — 'onboarding_data':
  id                  uuid  primary key default gen_random_uuid()
  user_id             uuid  not null references profiles(id) unique
  age                 int
  last_period_date    date
  average_cycle_length int
  common_symptoms     text[]   (array of symptom strings)
  created_at          timestamptz default now()
  updated_at          timestamptz default now()
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------

class OnboardingRequest(BaseModel):
    """Payload for POST /users/onboarding."""

    user_id: str = Field(
        ...,
        description="UUID of the authenticated user from the profiles table",
        examples=["d290f1ee-6c54-4b01-90e6-d701748f0851"],
    )
    age: Optional[int] = Field(
        None,
        ge=10,
        le=100,
        description="User's age in years",
        examples=[24],
    )
    last_period_date: Optional[date] = Field(
        None,
        description="Start date of the most recent menstrual period (YYYY-MM-DD)",
        examples=["2026-05-01"],
    )
    average_cycle_length: Optional[int] = Field(
        None,
        ge=15,
        le=60,
        description="Average number of days between period start dates",
        examples=[28],
    )
    common_symptoms: Optional[List[str]] = Field(
        default_factory=list,
        description="Symptoms the user commonly experiences",
        examples=[["Cramps", "Fatigue", "Bloating"]],
    )


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------

class OnboardingResponse(BaseModel):
    """Response returned after a successful onboarding save."""

    message: str
    data: dict
