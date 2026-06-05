import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from database.supabase_client import get_supabase_admin

router = APIRouter()
logger = logging.getLogger(__name__)
# Configure basic logging for the router if not already configured elsewhere
logging.basicConfig(level=logging.INFO)

@router.get("/ping")
def ping():
    """Simple health check endpoint."""
    return {
        "status": "alive",
        "service": "HerSakhi Backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/keep-alive")
def keep_alive():
    """
    Keep-alive endpoint to prevent Supabase project from pausing.
    Inserts a record into the 'keep_alive' table.
    """
    admin_client = get_supabase_admin()
    if not admin_client:
        logger.error("Keep-alive failed: SUPABASE_SERVICE_ROLE_KEY is not configured.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase service role key not configured."
        )

    try:
        data = {
            "project_name": "hersakhi",
            "pinged_at": datetime.now(timezone.utc).isoformat()
        }
        response = admin_client.table("keep_alive").insert(data).execute()
        
        logger.info("Successfully pinged Supabase keep_alive table.")
        return {
            "success": True,
            "message": "Keep-alive ping successful.",
            "data": response.data
        }
    except Exception as e:
        logger.error(f"Keep-alive ping failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase connection error: {str(e)}"
        )
