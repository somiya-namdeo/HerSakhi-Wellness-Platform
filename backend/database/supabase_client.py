"""
database/supabase_client.py
----------------------------
Initialises and exports a shared Supabase client instance.

Usage in any service or route:
    from database.supabase_client import supabase, get_supabase_admin
"""

from supabase import create_client, Client
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)

# Load variables from the .env file located in the backend root
load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError(
        "SUPABASE_URL and SUPABASE_KEY must be set in the .env file."
    )

# Shared client — import this wherever Supabase access is needed (uses Anon Key)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_admin() -> Client:
    """
    Returns a Supabase client initialized with the SERVICE_ROLE_KEY.
    Useful for backend tasks that need to bypass RLS, like keep-alive pings.
    """
    if not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("SUPABASE_SERVICE_ROLE_KEY is not set.")
        return None
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
