"""
database/supabase_client.py
----------------------------
Initialises and exports a shared Supabase client instance.

Usage in any service or route:
    from database.supabase_client import supabase
"""

from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load variables from the .env file located in the backend root
load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError(
        "SUPABASE_URL and SUPABASE_KEY must be set in the .env file."
    )

# Shared client — import this wherever Supabase access is needed
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
