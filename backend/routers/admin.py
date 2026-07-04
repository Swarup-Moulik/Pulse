from datetime import date, datetime

from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import models
from schemas import schemas
from sqlalchemy.orm import Session, joinedload
from utils import get_password_hash

router = APIRouter(prefix="/api/admin", tags=["Admin Controls"])


def generate_employee_id(db: Session, name: str) -> str:
    """Generates ID format: OI + First2 + Last2 + Year + 000X"""
    name_parts = name.strip().split()

    first_part = (
        (name_parts[0][:2] if len(name_parts) > 0 else "XX").upper().ljust(2, "X")
    )
    last_part = (
        (name_parts[-1][:2] if len(name_parts) > 1 else "XX").upper().ljust(2, "X")
    )

    current_year = str(datetime.now().year)

    count_this_year = (
        db.query(models.User)
        .filter(models.User.employee_id.like(f"%{current_year}%"))
        .count()
    )

    serial_num = str(count_this_year + 1).zfill(4)

    return f"OI{first_part}{last_part}{current_year}{serial_num}"


@router.post("/users", response_model=schemas.UserOut)
def register_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    emp_id = generate_employee_id(db, user.name)
    hashed_password = get_password_hash(user.password)

    new_user = models.User(
        employee_id=emp_id,
        email=user.email,
        name=user.name,
        password=hashed_password,
        role=user.role,
        designation=user.designation,
        phone=user.phone,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/users", response_model=list[schemas.UserOut])
def get_all_employees(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.delete("/users/{user_id}")
def delete_employee(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.get("/attendance", response_model=list[schemas.AttendanceOut])
def get_global_attendance(db: Session = Depends(get_db)):
    today = date.today()
    return (
        db.query(models.Attendance)
        .options(joinedload(models.Attendance.user))
        .filter(models.Attendance.date == today)
        .all()
    )


@router.get("/leaves")
def get_all_leaves(db: Session = Depends(get_db)):
    return db.query(models.LeaveRequest).all()


@router.put("/leaves/{leave_id}")
def update_leave_status(leave_id: int, status: str, db: Session = Depends(get_db)):
    leave = (
        db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    )
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = status
    db.commit()
    return {"message": f"Leave {status}"}


@router.get("/payroll/{designation}")
def get_salary_template(designation: str, db: Session = Depends(get_db)):
    template = (
        db.query(models.SalaryTemplate)
        .filter(models.SalaryTemplate.designation == designation)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Not found")
    return template


@router.post("/payroll")
def update_salary_template(
    data: schemas.SalaryTemplateUpdate, db: Session = Depends(get_db)
):
    template = (
        db.query(models.SalaryTemplate)
        .filter(models.SalaryTemplate.designation == data.designation)
        .first()
    )
    if template:
        template.basic = data.basic
        template.hra = data.hra
        template.special = data.special
    else:
        new_template = models.SalaryTemplate(**data.dict())
        db.add(new_template)
    db.commit()
    return {"message": "Template updated"}


@router.get("/dashboard-stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today = date.today()
    return {
        "total_employees": db.query(models.User)
        .filter(models.User.role == "employee")
        .count(),
        "pending_leaves": db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.status == "Pending")
        .count(),
        "attendance_today": db.query(models.Attendance)
        .filter(models.Attendance.date == today)
        .count(),
    }


@router.patch("/users/{user_id}/designation")
def update_employee_designation(
    user_id: int, designation: str, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.designation = designation
    db.commit()
    return {"message": "Designation updated successfully"}
