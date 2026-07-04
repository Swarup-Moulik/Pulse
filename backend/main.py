# main.py
from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your new routers
from routers import admin, auth, employee

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pulse HRMS API")

# CORS setup for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up the routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(employee.router)


@app.get("/")
def read_root():
    return {"status": "Pulse API is online and routing correctly"}
