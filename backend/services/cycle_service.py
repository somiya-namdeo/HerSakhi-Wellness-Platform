"""
services/cycle_service.py
--------------------------
Business logic for the daily period tracker.

Supabase table: cycle_logs
  - UNIQUE constraint on (user_id, log_date) enables safe upsert.
  - All queries are scoped to the requesting user's user_id.
"""

from typing import List
from fastapi import HTTPException, status

from database.supabase_client import supabase
from models.cycle_models import (
    CycleLogRequest,
    CycleLogResponse,
    CycleLogListResponse,
)


async def save_cycle_log(payload: CycleLogRequest) -> CycleLogResponse:
    """
    Insert or update a daily cycle log.

    Uses Supabase upsert on the UNIQUE(user_id, log_date) constraint,
    so calling this endpoint multiple times for the same date safely
    updates the existing record rather than creating duplicates.

    Steps:
      1. Build the row dict from the payload.
      2. Upsert into 'cycle_logs'.
      3. Return the saved row as CycleLogResponse.

    Raises:
      500 — database error
    """
    row = {
        "user_id":        payload.user_id,
        "log_date":       str(payload.log_date),
        "flow_intensity": payload.flow_intensity,
        "pain_level":     payload.pain_level,
        "mood":           payload.mood,
        "symptoms":       payload.symptoms or [],
        "notes":          payload.notes,
    }

    try:
        result = (
            supabase.table("cycle_logs")
            .upsert(row, on_conflict="user_id,log_date")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save cycle log: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cycle log save returned no data from the database.",
        )

    saved = result.data[0]
    return CycleLogResponse(**saved)


async def get_cycle_logs(user_id: str) -> CycleLogListResponse:
    """
    Fetch all cycle logs for a user, sorted by log_date ascending.

    Raises:
      500 — database error
    """
    try:
        result = (
            supabase.table("cycle_logs")
            .select("*")
            .eq("user_id", user_id)
            .order("log_date", desc=False)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch cycle logs: {exc}",
        )

    logs = [CycleLogResponse(**row) for row in (result.data or [])]
    return CycleLogListResponse(logs=logs, total=len(logs))
