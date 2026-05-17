"""
services/prediction_service.py
--------------------------------
Business logic for cycle and wellness predictions.

Fetches onboarding data and cycle logs to generate personalised predictions.
"""

from fastapi import HTTPException, status
from datetime import timedelta, datetime
from database.supabase_client import supabase
from models.prediction_models import (
    NextCycleResponse,
    OvulationResponse,
    InsightsResponse,
    FullPredictionResponse
)
from ml.cycle_predictor import CyclePredictor
from ml.symptom_analyzer import SymptomAnalyzer
from ml.recommendation_engine import RecommendationEngine


async def _generate_and_save_prediction(user_id: str) -> dict:
    """
    Core function to generate all predictions for a user and save them.
    Fetches onboarding data and cycle logs, computes metrics, and upserts into `predictions`.
    """
    # 1. Fetch onboarding data
    try:
        onboarding_res = (
            supabase.table("onboarding_data")
            .select("last_period_date, average_cycle_length, common_symptoms")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while fetching onboarding data: {exc}",
        )

    if not onboarding_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding data not found for user. Please complete onboarding first.",
        )

    onboarding_data = onboarding_res.data

    # 2. Fetch cycle logs
    try:
        cycle_logs_res = (
            supabase.table("cycle_logs")
            .select("*")
            .eq("user_id", user_id)
            .order("log_date", desc=True)
            .limit(100) # Increased limit to capture multiple cycles
            .execute()
        )
        cycle_logs = cycle_logs_res.data or []
    except Exception:
        cycle_logs = []

    # 3. Calculate baseline predictions via CyclePredictor
    predictor = CyclePredictor(cycle_logs=cycle_logs, onboarding_data=onboarding_data)
    metrics = predictor.generate_prediction_metrics()
    
    # 4. Analyze Symptoms
    analyzer = SymptomAnalyzer(cycle_logs=cycle_logs)
    symptom_analysis = analyzer.get_full_analysis(cycle_regularity=metrics["cycle_regularity"])
    
    most_common_symptom = symptom_analysis["most_common_symptom"]
    if most_common_symptom:
        symptom_summary = f"Your most frequent symptom is {most_common_symptom}."
    else:
        symptom_summary = "No major symptoms reported recently."

    # 5. Generate dynamic insights and recommendations
    # Determine cycle phase based on dates
    today = datetime.now().date()
    cycle_phase = "menstrual"
    if today >= metrics["fertile_window_start"] and today <= metrics["fertile_window_end"]:
        cycle_phase = "ovulatory"
    elif today > metrics["period_end"] and today < metrics["fertile_window_start"]:
        cycle_phase = "follicular"
    elif today > metrics["fertile_window_end"]:
        cycle_phase = "luteal"
        
    flow_intensities = [log.get("flow_intensity", "") for log in cycle_logs if log.get("flow_intensity")]
        
    rec_engine = RecommendationEngine(
        cycle_phase=cycle_phase,
        top_symptoms=[most_common_symptom] if most_common_symptom else [],
        mood_pattern=symptom_analysis["mood_pattern"],
        average_pain=symptom_analysis["average_pain_level"],
        high_pain_days=symptom_analysis["high_pain_days_count"],
        flow_intensities=flow_intensities
    )
    
    structured_recs = rec_engine.get_structured_recommendations()
    
    if metrics["cycle_regularity"] == "Irregular":
        wellness_insight = "Your cycle shows some irregularity. Prioritize stress management and adequate sleep."
    elif metrics["cycle_regularity"] == "Slightly Irregular":
        wellness_insight = "Your cycle is slightly irregular. Make sure you are staying hydrated and resting well."
    else:
        wellness_insight = "Your cycle appears to follow a standard pattern. Stay hydrated and rested."

    # Recommendation string for database fallback
    recommendation_str = " ".join(structured_recs[:2]) if structured_recs else "Maintain a balanced diet and regular rest."

    prediction_dict = {
        "user_id": user_id,
        "next_period_date": str(metrics["next_period_date"]),
        "period_start": str(metrics["period_start"]),
        "period_end": str(metrics["period_end"]),
        "predicted_cycle_length": metrics["predicted_cycle_length"],
        "ovulation_date": str(metrics["ovulation_date"]),
        "fertile_window_start": str(metrics["fertile_window_start"]),
        "fertile_window_end": str(metrics["fertile_window_end"]),
        "confidence_score": metrics["confidence_score"],
        "regularity_score": metrics["regularity_score"],
        "cycle_regularity": metrics["cycle_regularity"],
        "symptom_summary": symptom_summary,
        "wellness_insight": wellness_insight,
        "recommendation": recommendation_str,
    }

    # 6. Upsert into predictions table
    try:
        upsert_res = (
            supabase.table("predictions")
            .upsert(prediction_dict, on_conflict="user_id")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving prediction: {exc}",
        )

    if not upsert_res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save prediction to database.",
        )

    result_data = upsert_res.data[0]
    
    # Inject dynamically computed arrays for the API response without breaking DB schema
    result_data["risk_flags"] = symptom_analysis["risk_flags"]
    result_data["recommendations"] = structured_recs
    result_data["period_length"] = metrics["period_length"]
    result_data["predicted_cycle_length"] = metrics["predicted_cycle_length"]
    
    return result_data


async def predict_next_cycle(user_id: str) -> NextCycleResponse:
    data = await _generate_and_save_prediction(user_id)
    return NextCycleResponse(**data)


async def predict_ovulation(user_id: str) -> OvulationResponse:
    data = await _generate_and_save_prediction(user_id)
    return OvulationResponse(**data)


async def get_insights(user_id: str) -> InsightsResponse:
    data = await _generate_and_save_prediction(user_id)
    return InsightsResponse(**data)


async def get_full_prediction(user_id: str) -> FullPredictionResponse:
    data = await _generate_and_save_prediction(user_id)
    return FullPredictionResponse(**data)
