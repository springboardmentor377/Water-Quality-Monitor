from sqlmodel import Session, select
from sqlalchemy import func
from app.database import engine
from app.models import WaterStation, StationReading, Report, Alert
import traceback

try:
    with Session(engine) as session:
        def _get_count(model):
            res = session.exec(select(func.count()).select_from(model)).one()
            return res[0] if isinstance(res, (tuple, list)) else res

        total_waterstations = _get_count(WaterStation)
        total_readings_collected = _get_count(StationReading)
        total_reports = _get_count(Report)
        all_alerts = session.exec(select(Alert)).all()
        print('tws:', total_waterstations)
        print('trc:', total_readings_collected)
        print('total_reports:', total_reports)
        print('alerts_len:', len(all_alerts))
except Exception as e:
    print('Exception occurred:')
    traceback.print_exc()
