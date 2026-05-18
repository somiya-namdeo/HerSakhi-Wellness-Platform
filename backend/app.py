"""
HerSakhi Backend — FastAPI Application Entry Point

This backend powers the HerSakhi Women's Wellness Platform and supports:
  - Authentication      : JWT-based register & login (profiles table + bcrypt)
  - User Profiles       : Personal data, health info, and preferences
  - Cycle Tracking      : Menstrual cycle logging, history, and analytics
  - AI Chatbot          : Gemini-powered wellness assistant (ai_routes)
  - ML Predictions      : Cycle prediction, symptom analysis (prediction_routes)
  - Wellness Analytics  : Patterns, insights, and health summaries
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.supabase_client import supabase

# ---------------------------------------------------------------------------
# Route imports
# ---------------------------------------------------------------------------
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from routes.cycle_routes import router as cycle_router
from routes.prediction_routes import router as prediction_router
from routes.ai_routes import router as ai_router
from routes.wellness_routes import router as wellness_router

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------
app = FastAPI(
    title="HerSakhi API",
    description=(
        "Backend API for the HerSakhi Women's Wellness Platform. "
        "Supports authentication, cycle tracking, AI chatbot, and ML predictions."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server (and deployed frontend) to reach the API
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://her-sakhi-wellness-platform.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth_router,       prefix="/auth",        tags=["Authentication"])
app.include_router(user_router,       prefix="/users",       tags=["Users"])
app.include_router(cycle_router,      prefix="/cycles",      tags=["Cycle Tracking"])
app.include_router(prediction_router, prefix="/predictions", tags=["ML Predictions"])
app.include_router(ai_router,         prefix="/ai",          tags=["AI Chatbot"])
app.include_router(wellness_router,   prefix="/wellness",    tags=["Wellness Tracking"])

# ---------------------------------------------------------------------------
# Health-check endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"], summary="API health check")
def root():
    """Confirms the HerSakhi backend is running."""
    return {"message": "HerSakhi Backend is running 🌸"}


@app.get("/test-db", tags=["Health"], summary="Supabase connectivity check")
def test_database():
    """
    Queries the 'profiles' table to confirm the Supabase connection is healthy.
    Returns success flag and row count (not raw data) for safety.
    """
    try:
        response = supabase.table("profiles").select("id").execute()
        return {
            "success": True,
            "profiles_count": len(response.data),
        }
    except Exception as exc:
        return {
            "success": False,
            "error": str(exc),
        }