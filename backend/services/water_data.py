from typing import Optional, List, Dict
import httpx
from backend.core.config import settings

async def fetch_external_station_readings() -> Optional[List[Dict]]:
    if not settings.external_water_api_url:
        return None
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(settings.external_water_api_url)
        response.raise_for_status()
        return response.json()
