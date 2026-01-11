from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, guardian
from .database import engine, get_db
import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Consent Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","trust-layer-sage.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root to check status
@app.get("/")
def read_root():
    return {"status": "Digital Consent Platform is running"}

# Organization Management
@app.get("/organizations", response_model=List[schemas.Organization])
def get_organizations(db: Session = Depends(get_db)):
    orgs = db.query(models.Organization).all()
    if not orgs:
        # Seed initial organizations if empty
        seed_orgs = [
            models.Organization(name="HealthPlus", description="Healthcare data provider"),
            models.Organization(name="FinanceFlow", description="Financial analytics services"),
            models.Organization(name="RetailReach", description="Marketing and retail platform")
        ]
        db.add_all(seed_orgs)
        db.commit()
        orgs = db.query(models.Organization).all()
    return orgs

# Consent Management
@app.post("/consents", response_model=schemas.Consent)
def create_consent(consent: schemas.ConsentCreate, db: Session = Depends(get_db)):
    db_consent = models.Consent(**consent.dict())
    db.add(db_consent)
    db.commit()
    db.refresh(db_consent)
    return db_consent

@app.get("/consents", response_model=List[schemas.Consent])
def get_consents(user_id: str = "default_user", db: Session = Depends(get_db)):
    return db.query(models.Consent).filter(models.Consent.user_id == user_id, models.Consent.is_active == True).all()

@app.delete("/consents/{consent_id}")
def revoke_consent(consent_id: int, db: Session = Depends(get_db)):
    db_consent = db.query(models.Consent).filter(models.Consent.id == consent_id).first()
    if not db_consent:
        raise HTTPException(status_code=404, detail="Consent not found")
    db_consent.is_active = False
    db.commit()
    return {"status": "revoked"}

# Simulated Data Access
@app.post("/simulate-access")
def simulate_access(request: schemas.AccessRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Check if active consent exists for this org and purpose
    now = datetime.datetime.utcnow()
    # Find ANY active consent for this org and user
    # We check if the specific requested purpose matches OR if there's a violation
    
    consent = db.query(models.Consent).filter(
        models.Consent.org_id == request.org_id,
        models.Consent.is_active == True,
        models.Consent.expiration_date > now
    ).first()

    status = "Denied"
    reason = "No active consent found"

    if consent:
        if consent.purpose == request.purpose:
            status = "Granted"
            reason = "Valid consent for purpose"
        else:
            status = "Denied"
            reason = f"Purpose mismatch: Requested {request.purpose}, allowed {consent.purpose}"

    # Log the access
    log = models.AccessLog(
        org_id=request.org_id,
        requested_purpose=request.purpose,
        status=status,
        reason=reason
    )
    db.add(log)
    db.commit()

    # Trigger AI Guardian check as background task
    background_tasks.add_task(guardian.run_guardian_cycle, db)

    return {"status": status, "reason": reason}

@app.get("/logs", response_model=List[schemas.AccessLog])
def get_logs(db: Session = Depends(get_db)):
    return db.query(models.AccessLog).order_by(models.AccessLog.timestamp.desc()).limit(50).all()
