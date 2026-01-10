from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)

    consents = relationship("Consent", back_populates="organization")
    logs = relationship("AccessLog", back_populates="organization")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # Mock user ID
    org_id = Column(Integer, ForeignKey("organizations.id"))
    purpose = Column(String)
    expiration_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="consents")

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"))
    requested_purpose = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String) # Granted / Denied
    reason = Column(String, nullable=True)

    organization = relationship("Organization", back_populates="logs")
