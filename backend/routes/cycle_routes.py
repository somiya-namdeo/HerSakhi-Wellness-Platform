"""
routes/cycle_routes.py
-----------------------
Period tracker endpoints (prefix: /cycles).

  POST /cycles/log              — save/update a daily cycle log  [implemented]
  GET  /cycles/logs/{user_id}   — fetch all logs for a user      [implemented]

Future endpoints (stubs retained):
  GET  /cycles/summary          — aggregated statistics
"""

from fastapi import APIRouter, HTTPException, status
from typing import List

from models.cycle_models import (
    CycleLogRequest,
    CycleLogResponse,
    CycleLogListResponse,
    CycleSummary,
)
from services.cycle_service import save_cycle_log, get_cycle_logs

router = APIRouter()


# ---------------------------------------------------------------------------
# Save / update a daily log (upsert)
# ---------------------------------------------------------------------------

@router.post(
    "/log",
    response_model=CycleLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save or update a daily cycle log",
    description=(
        "Creates a new daily log entry or updates the existing one if a log "
        "already exists for the same `user_id` and `log_date`. "
        "Requires a UNIQUE constraint on `(user_id, log_date)` in the "
        "`cycle_logs` Supabase table."
    ),
)
async def log_cycle(payload: CycleLogRequest):
    """Save or update a period tracker daily log entry."""
    return await save_cycle_log(payload)


# ---------------------------------------------------------------------------
# Fetch all logs for a user
# ---------------------------------------------------------------------------

@router.get(
    "/logs/{user_id}",
    response_model=CycleLogListResponse,
    summary="Get all cycle logs for a user",
    description=(
        "Returns all daily logs for the given `user_id`, sorted by "
        "`log_date` ascending. Designed to be called on page load to "
        "populate calendar highlights."
    ),
)
async def list_logs(user_id: str):
    """Retrieve all cycle log entries for a user."""
    return await get_cycle_logs(user_id)


# ---------------------------------------------------------------------------
# Future stub
# ---------------------------------------------------------------------------

@router.get(
    "/summary/{user_id}",
    response_model=CycleSummary,
    summary="Get aggregated cycle statistics (coming soon)",
)
async def get_summary(user_id: str):
    """Return aggregated cycle statistics — not yet implemented."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Cycle summary coming soon.",
    )
