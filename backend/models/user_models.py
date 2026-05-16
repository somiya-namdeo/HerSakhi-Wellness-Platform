"""
models/user_models.py
----------------------
Pydantic schemas for authentication and user profile operations.

Classes:
  UserRegister      — POST /auth/register request body
  UserLogin         — POST /auth/login request body
  UserOut           — safe user representation (no password)
  AuthResponse      — unified response for register & login
  UserProfileUpdate — PATCH /users/me request body
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    """Payload for POST /auth/register."""

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["Priya Sharma"],
        description="Full display name of the user",
    )
    email: EmailStr = Field(
        ...,
        examples=["priya@example.com"],
        description="Unique email address",
    )
    password: str = Field(
        ...,
        min_length=8,
        examples=["SecurePass@123"],
        description="Plain-text password (min 8 chars); stored as bcrypt hash",
    )


class UserLogin(BaseModel):
    """Payload for POST /auth/login."""

    email: EmailStr = Field(..., examples=["priya@example.com"])
    password: str = Field(..., examples=["SecurePass@123"])


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class UserOut(BaseModel):
    """
    Safe user representation returned in API responses.
    Never includes the password hash.
    """

    id: str = Field(..., description="UUID assigned by Supabase / the profiles table")
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    """
    Unified response for both /auth/register and /auth/login.
    Carries the JWT access token and the safe user payload.
    """

    access_token: str = Field(..., description="HS256-signed JWT; put in Authorization: Bearer <token>")
    token_type: str = Field(default="bearer")
    user: UserOut


# ---------------------------------------------------------------------------
# Profile update schema (used by user_routes / user_service)
# ---------------------------------------------------------------------------

class UserProfileUpdate(BaseModel):
    """Payload for PUT /users/profile/{user_id}"""

    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None


class UserStatsResponse(BaseModel):
    """Payload for GET /users/stats/{user_id}"""
    days_tracked: int
    cycles_logged: int
    insights_gained: int
