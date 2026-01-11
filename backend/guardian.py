from sqlalchemy.orm import Session
from . import models
import datetime

def run_guardian_cycle(db: Session):
    """
    Simulates an AI Agent checking for policy violations.
    In a real system, this might use LLMs or complex rules to analyze logs.
    """
    now = datetime.datetime.utcnow()
    
    # 1. Cleanup expired consents
    expired_consents = db.query(models.Consent).filter(
        models.Consent.is_active == True,
        models.Consent.expiration_date < now
    ).all()
    
    for c in expired_consents:
        c.is_active = False
        # Log the revocation
        guardian_log = models.AccessLog(
            org_id=c.org_id,
            requested_purpose="SYSTEM_AUTO_REVOKE",
            status="REVOKED",
            reason=f"Time-bound consent expired for purpose: {c.purpose}"
        )
        db.add(guardian_log)

    # 2. Check for Purpose Violations in recent logs
    # If an organization attempted to access data for a purpose they don't have consent for,
    # and they HAVE an active consent for something else, we might treat it as a breach and revoke all.
    
    recent_denials = db.query(models.AccessLog).filter(
        models.AccessLog.status == "Denied",
        models.AccessLog.reason.like("Purpose mismatch%")
    ).all()

    for log in recent_denials:
        # AI Guardian decides this is a violation of trust and revokes active consents for this org
        violation_consents = db.query(models.Consent).filter(
            models.Consent.org_id == log.org_id,
            models.Consent.is_active == True
        ).all()
        
        for vc in violation_consents:
            vc.is_active = False
            revocation_log = models.AccessLog(
                org_id=vc.org_id,
                requested_purpose="AI_GUARDIAN_ACTION",
                status="REVOKED",
                reason=f"Trust violation: Org attempted access for unauthorized purpose '{log.requested_purpose}'"
            )
            db.add(revocation_log)

    db.commit()
