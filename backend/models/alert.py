from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.core.database import Base
from backend.models.enums import AlertType

class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[AlertType] = mapped_column(Enum(AlertType, name="alert_type"))
    message: Mapped[str] = mapped_column(Text)
    location: Mapped[str] = mapped_column(String(255))
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    station_id: Mapped[Optional[int]] = mapped_column(ForeignKey("water_stations.id"), nullable=True)
    report_id: Mapped[Optional[int]] = mapped_column(ForeignKey("reports.id"), nullable=True)

    station = relationship("WaterStation", back_populates="alerts")
    report = relationship("Report", back_populates="alerts")
