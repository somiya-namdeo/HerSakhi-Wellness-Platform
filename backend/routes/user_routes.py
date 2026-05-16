"""
routes/user_routes.py
----------------------
User profile and onboarding endpoints (prefix: /users).

  POST  /users/onboarding  — save onboarding health data       [implemented]
  GET   /users/me          — fetch the authenticated user's profile [stub]
  PATCH /users/me          — update profile fields             [stub]
  DELETE /users/me         — delete account                    [stub]
"""

from fastapi import APIRouter, Depends, HTTPException, status

from models.user_models import UserOut, UserProfileUpdate, UserStatsResponse
from models.onboarding_models import OnboardingRequest, OnboardingResponse
from services.user_service import (
    save_onboarding, 
    update_user_profile, 
    get_user_stats, 
    get_onboarding_data
)
from utils.security import get_current_user

router = APIRouter()


# ---------------------------------------------------------------------------
# Onboarding (no JWT guard — user_id comes from localStorage/frontend)
# We keep this unguarded for now so the frontend can call it immediately
# after registration without worrying about passing the token separately.
# Add Depends(get_current_user) here later when the frontend sends the token.
# ---------------------------------------------------------------------------

@router.post(
    "/onboarding",
    response_model=OnboardingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save onboarding health data",
    description=(
        "Receives the health profile collected during the onboarding flow and "
        "persists it in the `onboarding_data` table. Also patches `profiles.age` "
        "if an age value is provided. Safe to call multiple times — uses upsert."
    ),
)
async def onboarding(payload: OnboardingRequest):
    """Persist the user's onboarding health data."""
    return await save_onboarding(payload)


# ---------------------------------------------------------------------------
# Profile Management
# ---------------------------------------------------------------------------

@router.put(
    "/profile/{user_id}",
    response_model=UserOut,
    summary="Update user profile",
    description="Updates user's full name, phone, and date of birth in the profiles table."
)
async def edit_profile(user_id: str, payload: UserProfileUpdate):
    """Update user profile by ID."""
    return await update_user_profile(user_id, payload)


# ---------------------------------------------------------------------------
# Profile (JWT-protected stubs — implement with user_service later)
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current user profile",
)
async def get_profile(user_id: str = Depends(get_current_user)):
    """Retrieve the authenticated user's profile from the profiles table."""
    # TODO: delegate to user_service.get_profile(user_id)
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Coming soon")


@router.patch(
    "/me",
    response_model=UserOut,
    summary="Update user profile",
)
async def update_profile(
    payload: UserProfileUpdate,
    user_id: str = Depends(get_current_user),
):
    """Update mutable profile fields for the authenticated user."""
    # TODO: delegate to user_service.update_profile(user_id, payload)
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Coming soon")


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete account",
)
async def delete_account(user_id: str = Depends(get_current_user)):
    """Permanently delete the authenticated user's account and all associated data."""
    # TODO: call Supabase admin API / cascade delete
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Coming soon")


@router.get("/stats/{user_id}", response_model=UserStatsResponse)
async def fetch_user_stats(user_id: str):
    """Retrieve dynamic usage statistics for a user."""
    return await get_user_stats(user_id)


@router.get("/onboarding/{user_id}")
async def fetch_onboarding(user_id: str):
    """Retrieve onboarding data for a user."""
    data = await get_onboarding_data(user_id)
    if not data:
        raise HTTPException(status_code=404, detail="Onboarding data not found")
    return data
