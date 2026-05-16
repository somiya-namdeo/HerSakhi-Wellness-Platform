"""
services/wellness_service.py
-----------------------------
Business logic for daily wellness tracking (hydration, sleep, energy, etc.).

Supabase table: wellness_logs
  - UNIQUE constraint on (user_id, log_date) enables safe upsert.
"""

from datetime import date
from fastapi import HTTPException, status
from database.supabase_client import supabase
from models.wellness_models import (
    WellnessLogRequest,
    WellnessLogResponse,
    WellnessLogListResponse,
)


async def save_wellness_log(payload: WellnessLogRequest) -> WellnessLogResponse:
    """
    Insert or update a daily wellness log.
    """
    row = {
        "user_id":        payload.user_id,
        "log_date":       str(payload.log_date),
        "hydration":      payload.hydration,
        "sleep_hours":    payload.sleep_hours,
        "energy_level":   payload.energy_level,
        "stress_level":   payload.stress_level,
        "activity_count": payload.activity_count,
    }

    try:
        result = (
            supabase.table("wellness_logs")
            .upsert(row, on_conflict="user_id,log_date")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save wellness log: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wellness log save returned no data.",
        )

    return WellnessLogResponse(**result.data[0])


async def get_wellness_logs(user_id: str) -> WellnessLogListResponse:
    """
    Fetch all wellness logs for a user, sorted by date.
    """
    try:
        result = (
            supabase.table("wellness_logs")
            .select("*")
            .eq("user_id", user_id)
            .order("log_date", desc=True)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch wellness logs: {exc}",
        )

    logs = [WellnessLogResponse(**row) for row in (result.data or [])]
    return WellnessLogListResponse(logs=logs, total=len(logs))


async def get_today_wellness_log(user_id: str) -> WellnessLogResponse:
    """
    Fetch today's wellness log for a user.
    """
    today = str(date.today())
    try:
        result = (
            supabase.table("wellness_logs")
            .select("*")
            .eq("user_id", user_id)
            .eq("log_date", today)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch today's log: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No wellness log found for today.",
        )

    return WellnessLogResponse(**result.data[0])
