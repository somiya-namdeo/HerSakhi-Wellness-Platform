"""
services/user_service.py
-------------------------
Business logic for user profile and onboarding operations.

Supabase tables used:
  - profiles        : core user data (id, full_name, email, age)
  - onboarding_data : detailed health data collected during onboarding
"""

from fastapi import HTTPException, status
from datetime import datetime

from database.supabase_client import supabase
from models.onboarding_models import OnboardingRequest, OnboardingResponse
from models.user_models import UserOut, UserProfileUpdate


async def save_onboarding(payload: OnboardingRequest) -> OnboardingResponse:
    """
    Persist onboarding data for a user.

    Steps:
      1. Verify the user exists in 'profiles' — raise 404 if not found.
      2. Upsert a row in 'onboarding_data' (insert or update on conflict user_id).
      3. If age is provided, patch the 'profiles' row with it.
      4. Return the saved onboarding record.

    Raises:
      404 — user_id not found in profiles
      500 — any Supabase database error
    """

    # ------------------------------------------------------------------
    # 1. Verify user exists
    # ------------------------------------------------------------------
    try:
        user_check = (
            supabase.table("profiles")
            .select("id")
            .eq("id", payload.user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Ensure the user is registered before onboarding.",
        )

    if not user_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Ensure the user is registered before onboarding.",
        )

    # ------------------------------------------------------------------
    # 2. Upsert onboarding_data
    # ------------------------------------------------------------------
    onboarding_row = {
        "user_id":              payload.user_id,
        "age":                  payload.age,
        "last_period_date":     str(payload.last_period_date) if payload.last_period_date else None,
        "average_cycle_length": payload.average_cycle_length,
        "common_symptoms":      payload.common_symptoms or [],
    }

    try:
        result = (
            supabase.table("onboarding_data")
            .upsert(onboarding_row, on_conflict="user_id")
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save onboarding data: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Onboarding save returned no data from the database.",
        )

    saved = result.data[0]

    # ------------------------------------------------------------------
    # 3. Patch profiles.age if provided
    # ------------------------------------------------------------------
    if payload.age is not None:
        try:
            supabase.table("profiles").update({"age": payload.age}).eq("id", payload.user_id).execute()
        except Exception:
            # Non-fatal — onboarding data already saved; just skip the age patch
            pass

    # ------------------------------------------------------------------
    # 4. Return response
    # ------------------------------------------------------------------
    return OnboardingResponse(
        message="Onboarding data saved successfully.",
        data=saved,
    )


async def update_user_profile(user_id: str, payload: UserProfileUpdate) -> UserOut:
    """
    Update mutable profile fields (full_name, phone, date_of_birth) in the profiles table.
    """
    update_data = {
        "full_name": payload.full_name,
        "phone": payload.phone,
        "date_of_birth": payload.date_of_birth,
    }

    try:
        result = (
            supabase.table("profiles")
            .update(update_data)
            .eq("id", user_id)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Update failed.",
        )

    return UserOut(**result.data[0])


async def get_user_stats(user_id: str) -> dict:
    """
    Calculate usage statistics for the user across different tables.
    """
    try:
        # 1. Fetch relevant logs
        cycle_res = supabase.table("cycle_logs").select("log_date, flow_intensity").eq("user_id", user_id).execute()
        wellness_res = supabase.table("wellness_logs").select("log_date").eq("user_id", user_id).execute()
        onboarding_res = supabase.table("onboarding_data").select("last_period_date").eq("user_id", user_id).execute()
        
        cycle_logs = cycle_res.data or []
        wellness_logs = wellness_res.data or []
        onboarding_data = onboarding_res.data[0] if onboarding_res.data else None
        
        # 1. Days Tracked (unique log_date from cycle_logs + wellness_logs)
        unique_dates = set()
        for row in cycle_logs:
            unique_dates.add(row["log_date"])
        for row in wellness_logs:
            unique_dates.add(row["log_date"])
            
        days_tracked = len(unique_dates)

        # 2. Cycles Logged
        # Requirement: Count distinct cycle months (YYYY-MM).
        # Multiple logs in the same month count as 1.
        cycle_months = set()
        
        # Add month from onboarding initial period
        if onboarding_data and onboarding_data.get("last_period_date"):
            try:
                lp_dt = datetime.strptime(onboarding_data["last_period_date"], "%Y-%m-%d")
                cycle_months.add(lp_dt.strftime("%Y-%m"))
            except:
                pass
        
        # Add months from cycle logs where flow was recorded
        for row in cycle_logs:
            if row.get("flow_intensity"):
                try:
                    l_dt = datetime.strptime(row["log_date"], "%Y-%m-%d")
                    cycle_months.add(l_dt.strftime("%Y-%m"))
                except:
                    pass
        
        cycles_count = len(cycle_months)

        # Fallback: If onboarding exists but no specific dates found, default to 1
        if cycles_count == 0 and onboarding_data:
            cycles_count = 1

        # 3. Insights Gained
        # Count prediction records + AI chat recommendations (responses from HerSakhi)
        predictions_res = supabase.table("predictions").select("id").eq("user_id", user_id).execute()
        chat_res = supabase.table("chat_history").select("id").eq("user_id", user_id).eq("sender", "ai").execute()
        
        insights_gained = len(predictions_res.data or []) + len(chat_res.data or [])

        return {
            "days_tracked": days_tracked,
            "cycles_logged": cycles_count,
            "insights_gained": insights_gained
        }
    except Exception as exc:
        print(f"Stats fetch error for {user_id}: {exc}")
        return {
            "days_tracked": 0,
            "cycles_logged": 0,
            "insights_gained": 0
        }


async def get_onboarding_data(user_id: str):
    """
    Fetch raw onboarding data row for health preference display.
    """
    try:
        result = supabase.table("onboarding_data").select("*").eq("user_id", user_id).single().execute()
        return result.data
    except Exception:
        return None
