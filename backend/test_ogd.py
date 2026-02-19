from dotenv import load_dotenv
load_dotenv()

from app.services.ogd_service import ogd_service
import logging

logging.basicConfig(level=logging.INFO)

def test_ogd():
    print("Testing OGD Service...")
    try:
        data = ogd_service.get_live_readings()
        print(f"Successfully fetched {len(data)} records.")
        if data:
            print(f"Sample: {data[0]}")
    except Exception as e:
        print(f"OGD Service Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ogd()
