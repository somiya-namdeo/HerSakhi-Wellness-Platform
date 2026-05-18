"""
services/auth_service.py
-------------------------
Business logic for user registration and login.

Strategy (profiles table + JWT):
  - Passwords are stored as bcrypt hashes in the 'profiles' table.
  - JWTs are signed with JWT_SECRET_KEY from .env (HS256, 24-hour expiry).
  - No Supabase Auth is used — FastAPI owns the auth flow completely.

Expected Supabase 'profiles' table schema:
  id            uuid  primary key default gen_random_uuid()
  full_name     text  not null
  email         text  not null unique
  password_hash text  not null
  created_at    timestamptz default now()
"""

from fastapi import HTTPException, status

from database.supabase_client import supabase
from models.user_models import UserRegister, UserLogin, AuthResponse, UserOut
from utils.security import hash_password, verify_password, create_access_token


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

async def register_user(payload: UserRegister) -> AuthResponse:
    """
    Register a new user.

    Steps:
      1. Check if email already exists in 'profiles' — raise 400 if so.
      2. Hash the password with bcrypt.
      3. Insert a new row into 'profiles'.
      4. Build and return an AuthResponse with a fresh JWT.

    Raises:
      400 — email already registered
      500 — Supabase insertion failure
    """
    try:
        # --- 1. Duplicate e-mail check ---
        existing = (
            supabase.table("profiles")
            .select("id")
            .eq("email", payload.email)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during email check: {exc}",
        )

    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # --- 2. Hash password ---
    hashed = hash_password(payload.password)

    # --- 3. Insert user ---
    try:
        result = (
            supabase.table("profiles")
            .insert(
                {
                    "full_name": payload.full_name,
                    "email": payload.email,
                    "password_hash": hashed,
                }
            )
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during registration: {exc}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed: no data returned from database.",
        )

    new_user: dict = result.data[0]

    # --- 4. Issue JWT ---
    token = create_access_token({"sub": new_user["id"]})

    return AuthResponse(
        access_token=token,
        user=UserOut(
            id=new_user["id"],
            full_name=new_user["full_name"],
            email=new_user["email"],
            created_at=new_user.get("created_at"),
        ),
    )


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

async def login_user(payload: UserLogin) -> AuthResponse:
    """
    Authenticate an existing user.

    Steps:
      1. Fetch the user row by email.
      2. Verify the supplied password against the stored bcrypt hash.
      3. Build and return an AuthResponse with a fresh JWT.

    Raises:
      401 — email not found or wrong password
      500 — database error
    """
    # --- 1. Fetch by email ---
    try:
        result = (
            supabase.table("profiles")
            .select("id, full_name, email, password_hash, created_at")
            .eq("email", payload.email)
            .single()
            .execute()
        )
    except Exception as exc:
        # postgrest raises an error (not just empty data) when .single() finds nothing
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user: dict = result.data

    # --- 2. Verify password ---
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # --- 3. Issue JWT ---
    token = create_access_token({"sub": user["id"]})

    return AuthResponse(
        access_token=token,
        user=UserOut(
            id=user["id"],
            full_name=user["full_name"],
            email=user["email"],
            created_at=user.get("created_at"),
        ),
    )


# ---------------------------------------------------------------------------
# Change Password & Delete Account
# ---------------------------------------------------------------------------

async def change_password_service(user_id: str, current_pass: str, new_pass: str):
    """Verify and update a user's password using bcrypt."""
    try:
        result = (
            supabase.table("profiles")
            .select("id, password_hash")
            .eq("id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    user = result.data

    if not verify_password(current_pass, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )

    hashed_new = hash_password(new_pass)

    try:
        supabase.table("profiles").update({"password_hash": hashed_new}).eq("id", user_id).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update password in database: {exc}"
        )

    return {"message": "Password changed successfully."}


async def delete_account_service(user_id: str, password: str, confirmation_text: str):
    """Verify password, check text, and cascade delete user records safely across all tables."""
    if confirmation_text != "DELETE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirmation text must be exactly 'DELETE'."
        )

    try:
        result = (
            supabase.table("profiles")
            .select("id, password_hash")
            .eq("id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    user = result.data

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password."
        )

    # Cascade delete child tables first
    tables_to_delete = [
        "chat_history",
        "cycle_logs",
        "wellness_logs",
        "predictions",
        "onboarding_data"
    ]

    for table in tables_to_delete:
        try:
            supabase.table(table).delete().eq("user_id", user_id).execute()
        except Exception as exc:
            # Handle missing tables gracefully without crashing
            print(f"Skipping deletion for table {table}: {exc}")

    try:
        supabase.table("profiles").delete().eq("id", user_id).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete profile: {exc}"
        )

    return {"message": "Account deleted successfully."}

