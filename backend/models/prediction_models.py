"""
models/prediction_models.py
----------------------------
Pydantic schemas for the ML prediction outputs.

Expected Supabase table — 'predictions':
  id                    uuid  primary key default gen_random_uuid()
  user_id               uuid  not null references profiles(id) unique
  next_period_date      date
  period_start          date
  period_end            date
  predicted_cycle_length int
  ovulation_date        date
  fertile_window_start  date
  fertile_window_end    date
  confidence_score      int
  regularity_score      int
  cycle_regularity      text
  symptom_summary       text
  wellness_insight      text
  recommendation        text
  created_at            timestamptz default now()
  updated_at            timestamptz default now()
"""

from pydantic import BaseModel
from datetime import date


class NextCycleResponse(BaseModel):
    """Response for GET /predictions/next-cycle/{user_id}"""
    next_period_date: date
    predicted_cycle_length: int
    confidence_score: int


class OvulationResponse(BaseModel):
    """Response for GET /predictions/ovulation/{user_id}"""
    ovulation_date: date
    fertile_window_start: date
    fertile_window_end: date


class InsightsResponse(BaseModel):
    """Response for GET /predictions/insights/{user_id}"""
    cycle_regularity: str
    symptom_summary: str
    wellness_insight: str
    recommendation: str


class FullPredictionResponse(BaseModel):
    """Response for GET /predictions/full/{user_id}"""
    next_period_date: date
    period_start: date
    period_end: date
    ovulation_date: date
    fertile_window_start: date
    fertile_window_end: date
    confidence_score: int
    regularity_score: int
    symptom_summary: str
    recommendation: str

    model_config = {"from_attributes": True}
