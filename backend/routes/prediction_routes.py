"""
routes/prediction_routes.py
----------------------------
ML prediction endpoints:
  GET /predictions/next-cycle/{user_id} — predict next period start date
  GET /predictions/ovulation/{user_id}  — predict ovulation window
  GET /predictions/insights/{user_id}   — personalised wellness insights
  GET /predictions/full/{user_id}       — get all prediction data
"""

from fastapi import APIRouter

from models.prediction_models import (
    NextCycleResponse,
    OvulationResponse,
    InsightsResponse,
    FullPredictionResponse
)
from services.prediction_service import (
    predict_next_cycle,
    predict_ovulation,
    get_insights,
    get_full_prediction
)

router = APIRouter()


@router.get(
    "/next-cycle/{user_id}",
    response_model=NextCycleResponse,
    summary="Predict next cycle details",
    description="Calculates the next period date and cycle length using user history."
)
async def get_next_cycle(user_id: str):
    """Predict the user's next period start date."""
    return await predict_next_cycle(user_id)


@router.get(
    "/ovulation/{user_id}",
    response_model=OvulationResponse,
    summary="Predict fertile window",
    description="Calculates the ovulation date and fertile window based on the user's cycle."
)
async def get_ovulation(user_id: str):
    """Predict the fertile window and ovulation day."""
    return await predict_ovulation(user_id)


@router.get(
    "/insights/{user_id}",
    response_model=InsightsResponse,
    summary="Get personalised wellness insights",
    description="Generates actionable wellness insights from cycle and symptom history."
)
async def get_user_insights(user_id: str):
    """Return personalised wellness insights."""
    return await get_insights(user_id)


@router.get(
    "/full/{user_id}",
    response_model=FullPredictionResponse,
    summary="Get full prediction profile",
    description="Returns all cycle predictions, metrics, and insights in a single response."
)
async def get_all_predictions(user_id: str):
    """Get the full prediction profile for the user."""
    return await get_full_prediction(user_id)
