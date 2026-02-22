from datetime import datetime
from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.core.database import Base
from backend.models.enums import ReadingParameter

class StationReading(Base):
    __tablename__ = "station_readings"

    id: Mapped[int] = mapped_column(primary_key=True)
    station_id: Mapped[int] = mapped_column(ForeignKey("water_stations.id"), index=True)
    parameter: Mapped[ReadingParameter] = mapped_column(Enum(ReadingParameter, name="reading_parameter"))
    value: Mapped[float] = mapped_column(Numeric(10, 3))
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    station = relationship("WaterStation", back_populates="readings")
