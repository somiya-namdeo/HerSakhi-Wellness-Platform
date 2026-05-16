"""
routes/wellness_routes.py
--------------------------
Endpoints for the wellness tracker (prefix: /wellness).

  POST /wellness/log              — save/update a daily wellness log
  GET  /wellness/logs/{user_id}   — fetch all logs for a user
  GET  /wellness/today/{user_id}  — fetch today's log
"""

from fastapi import APIRouter, status
from models.wellness_models import (
    WellnessLogRequest,
    WellnessLogResponse,
    WellnessLogListResponse,
)
from services.wellness_service import (
    save_wellness_log,
    get_wellness_logs,
    get_today_wellness_log,
)

router = APIRouter()


@router.post(
    "/log",
    response_model=WellnessLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save or update a daily wellness log",
)
async def log_wellness(payload: WellnessLogRequest):
    """Save or update a daily wellness tracker entry."""
    return await save_wellness_log(payload)


@router.get(
    "/logs/{user_id}",
    response_model=WellnessLogListResponse,
    summary="Get all wellness logs for a user",
)
async def list_wellness_logs(user_id: str):
    """Retrieve all wellness log entries for a user."""
    return await get_wellness_logs(user_id)


@router.get(
    "/today/{user_id}",
    response_model=WellnessLogResponse,
    summary="Get today's wellness log",
)
async def today_wellness_log(user_id: str):
    """Retrieve the wellness log entry for today's date."""
    return await get_today_wellness_log(user_id)
