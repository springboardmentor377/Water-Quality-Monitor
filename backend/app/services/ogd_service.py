import urllib.request
import urllib.parse
import json
import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class OGDService:
    def __init__(self):
        self.api_key = os.getenv("OGD_API_KEY")
        # Default Resource ID for Surface Water Quality
        self.resource_id = os.getenv("OGD_RESOURCE_ID", "da2f1066-6b22-4464-924b-3543d463e8a4")
        self.base_url = "https://api.data.gov.in/resource/"

    def fetch_water_quality_data(self, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Fetch water quality data from OGD (data.gov.in) using built-in urllib
        """
        if not self.api_key:
            logger.error("OGD_API_KEY not found in environment")
            return []

        # Construct the URL with query parameters
        params = {
            "api-key": self.api_key,
            "format": "json",
            "limit": limit
        }
        url = f"{self.base_url}{self.resource_id}?" + urllib.parse.urlencode(params)

        try:
            logger.info(f"Fetching OGD data from {url}")
            with urllib.request.urlopen(url, timeout=10) as response:
                if response.getcode() == 200:
                    data = json.loads(response.read().decode())
                    # The structure of OGD API response usually has a 'records' field
                    records = data.get("records", [])
                    logger.info(f"Successfully fetched {len(records)} records from OGD")
                    return records
                else:
                    logger.error(f"Error: Received status code {response.getcode()}")
                    return []
            
        except Exception as e:
            logger.error(f"Error fetching data from OGD via urllib: {e}")
            return []

    def get_live_readings(self) -> List[Dict[str, Any]]:
        """
        Returns processed live readings for the dashboard
        """
        records = self.fetch_water_quality_data()
        
        processed_data = []
        for rec in records:
            # Flexible mapping for various OGD field names
            station = rec.get("station_name") or rec.get("monitoring_station") or rec.get("station_code") or rec.get("location") or "Unknown Station"
            
            ph = rec.get("ph") or rec.get("ph_level") or 7.0
            # Convert to float if it's a string
            try: ph = float(ph)
            except: ph = 7.0
            
            do = rec.get("dissolved_oxygen_d_o_") or rec.get("dissolved_oxygen_mg_l_") or rec.get("do") or 0.0
            try: do = float(do)
            except: do = 0.0
                
            turbidity = rec.get("turbidity") or rec.get("turbidity_ntu") or 0.0
            try: turbidity = float(turbidity)
            except: turbidity = 0.0

            processed_data.append({
                "time": rec.get("date_of_collection") or rec.get("collection_date") or rec.get("date") or "Real-time",
                "ph": ph,
                "do": do,
                "turbidity": turbidity,
                "station": str(station),
                "state": rec.get("state", "Unknown")
            })
            
        if records and not processed_data:
            logger.warning(f"Records found but none could be processed. Keys: {records[0].keys()}")
            
        return processed_data

# Singleton instance
ogd_service = OGDService()
