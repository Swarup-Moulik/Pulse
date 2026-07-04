# reset_db.py
from database import Base, engine
from models import models

print("Dropping old tables...")
Base.metadata.drop_all(bind=engine)

print("Rebuilding tables with new columns...")
Base.metadata.create_all(bind=engine)

print("Database reset successfully! You can start your server now.")
