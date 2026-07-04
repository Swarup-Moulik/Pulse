from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from models import models
from schemas import schemas
from sqlalchemy.orm import Session
from utils import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    # 1. Find user by email
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # 2. Verify existence and password using bcrypt
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    # 3. Generate JWT payload
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id}
    )

    # 4. Return standard token response + user metadata
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "employee_id": user.employee_id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "designation": user.designation,
        },
    }
