"""
routes/auth_routes.py
----------------------
Authentication endpoints exposed under the /auth prefix.

  POST /auth/register  — create a new account → AuthResponse
  POST /auth/login     — authenticate → AuthResponse
  GET  /auth/me        — return the currently authenticated user's profile
  POST /auth/logout    — client-side token invalidation hint
"""

from fastapi import APIRouter, Depends, status

from models.user_models import UserRegister, UserLogin, AuthResponse, UserOut
from services.auth_service import register_user, login_user
from utils.security import get_current_user
from database.supabase_client import supabase
from fastapi import HTTPException

router = APIRouter()


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description=(
        "Creates a new user account, stores a bcrypt-hashed password in the "
        "`profiles` table, and returns a signed JWT along with the user's public profile."
    ),
)
async def register(payload: UserRegister):
    """Register a new HerSakhi user."""
    return await register_user(payload)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login with email and password",
    description=(
        "Authenticates an existing user by verifying the bcrypt password hash "
        "stored in `profiles`. Returns a signed JWT on success."
    ),
)
async def login(payload: UserLogin):
    """Authenticate an existing user and receive a JWT."""
    return await login_user(payload)


# ---------------------------------------------------------------------------
# Get current user (protected)
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current authenticated user",
    description="Requires a valid Bearer token. Returns the user's public profile.",
)
async def get_me(user_id: str = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    try:
        result = (
            supabase.table("profiles")
            .select("id, full_name, email, created_at")
            .eq("id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    return UserOut(**result.data)


# ---------------------------------------------------------------------------
# Logout (client-side)
# ---------------------------------------------------------------------------

@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout (client-side token discard)",
    description=(
        "Signals a logout intent. Since JWTs are stateless, the client must "
        "delete the stored token. No server-side session is invalidated here."
    ),
)
async def logout(user_id: str = Depends(get_current_user)):
    """Acknowledge logout — instruct the client to discard its JWT."""
    return {"message": "Logged out successfully. Please delete your token on the client."}
