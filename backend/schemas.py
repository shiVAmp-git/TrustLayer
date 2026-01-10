from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class OrganizationBase(BaseModel):
    name: str
    description: str

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int

    class Config:
        from_attributes = True

class ConsentBase(BaseModel):
    org_id: int
    purpose: str
    expiration_date: datetime

class ConsentCreate(ConsentBase):
    user_id: str

class Consent(ConsentBase):
    id: int
    user_id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AccessLogBase(BaseModel):
    org_id: int
    requested_purpose: str

class AccessLog(AccessLogBase):
    id: int
    timestamp: datetime
    status: str
    reason: Optional[str]

    class Config:
        from_attributes = True

class AccessRequest(BaseModel):
    org_id: int
    purpose: str
