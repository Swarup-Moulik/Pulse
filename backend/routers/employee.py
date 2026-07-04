from datetime import date, datetime

from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import models
from schemas import schemas
from sqlalchemy.orm import Session
from utils import get_password_hash, verify_password

router = APIRouter(prefix="/api/employee", tags=["Employee Actions"])


@router.get("/profile/{user_id}", response_model=schemas.UserOut)
def get_my_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/profile/{user_id}", response_model=schemas.UserUpdate)
def update_profile(
    user_id: int, user_data: schemas.UserUpdate, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields
    if user_data.phone is not None:
        user.phone = user_data.phone
    if user_data.address is not None:
        user.address = user_data.address
    if user_data.name is not None:
        user.name = user_data.name

    db.commit()
    db.refresh(user)
    return user


@router.post("/attendance/check-in/{user_id}")
def check_in(user_id: int, db: Session = Depends(get_db)):
    """Creates a new attendance record for today."""
    today = date.today()

    existing = (
        db.query(models.Attendance)
        .filter(models.Attendance.user_id == user_id, models.Attendance.date == today)
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")

    new_record = models.Attendance(
        user_id=user_id, date=today, check_in=datetime.now().time(), status="Present"
    )
    db.add(new_record)
    db.commit()
    return {"message": "Check-in successful"}


@router.get("/attendance/{user_id}")
def get_my_attendance(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Attendance)
        .filter(models.Attendance.user_id == user_id)
        .order_by(models.Attendance.date.desc())
        .all()
    )


@router.post("/attendance/check-out/{user_id}")
def check_out(user_id: int, db: Session = Depends(get_db)):
    today = date.today()
    record = (
        db.query(models.Attendance)
        .filter(models.Attendance.user_id == user_id, models.Attendance.date == today)
        .first()
    )
    if not record:
        raise HTTPException(status_code=400, detail="Must check in first")
    if record.check_out:
        raise HTTPException(status_code=400, detail="Already checked out")

    record.check_out = datetime.now().time()
    db.commit()
    return {"message": "Check-out successful"}


@router.post("/leaves", response_model=schemas.LeaveOut)
def apply_leave(leave: schemas.LeaveCreate, db: Session = Depends(get_db)):
    new_leave = models.LeaveRequest(**leave.dict())
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave


@router.get("/leaves/{user_id}", response_model=list[schemas.LeaveOut])
def get_my_leaves(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.user_id == user_id)
        .all()
    )


@router.put("/change-password/{user_id}")
def change_password(
    user_id: int, data: schemas.PasswordChange, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1. Verify old password
    if not verify_password(data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    # 2. Hash and save new password
    user.password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
