from .database import engine, Base
from .models import Organization, Consent, AccessLog
import datetime

def init_db():
    print("Creating tables in Supabase...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    # Create initial organizations if they don't exist
    from sqlalchemy.orm import Session
    from .database import SessionLocal

    db = SessionLocal()
    try:
        # Check if we already have data
        if db.query(Organization).count() == 0:
            print("Seeding initial data...")
            orgs = [
                Organization(name="Medical Lab", description="General medical diagnostics lab"),
                Organization(name="Insurance Corp", description="Health and life insurance provider"),
                Organization(name="Research Center", description="Data-driven medical research")
            ]
            db.add_all(orgs)
            db.commit()
            print("Seeding completed.")
        else:
            print("Database already contains data, skipping seeding.")
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
