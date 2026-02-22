from enum import Enum

class UserRole(str, Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"

class ReportStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class ReadingParameter(str, Enum):
    ph = "pH"
    turbidity = "turbidity"
    do = "DO"
    lead = "lead"
    arsenic = "arsenic"

class AlertType(str, Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"
