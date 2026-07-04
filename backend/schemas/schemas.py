from datetime import date, time
from typing import List, Optional

from pydantic import BaseModel


# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: str
    name: str
    role: str = "employee"
    designation: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    password: Optional[str] = "Pulse@123"


class UserOut(UserBase):
    id: int
    employee_id: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    name: Optional[str] = None


# --- LOGIN SCHEMA ---
class LoginRequest(BaseModel):
    email: str
    password: str


# --- SALARY SCHEMAS ---
class SalaryTemplateBase(BaseModel):
    designation: str
    basic: float
    hra: float
    special: float


class SalaryTemplateOut(SalaryTemplateBase):
    id: int

    class Config:
        from_attributes = True


class LeaveCreate(BaseModel):
    user_id: int
    leave_type: str
    start_date: date
    end_date: date


class LeaveOut(LeaveCreate):
    id: int
    status: str
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


class SalaryTemplateUpdate(BaseModel):
    designation: str
    basic: float
    hra: float
    special: float


class UserBasicOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class AttendanceOut(BaseModel):
    id: int
    user_id: int
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: str
    user: Optional[UserBasicOut] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_employees: int
    pending_leaves: int
    attendance_today: int


class PasswordChange(BaseModel):
    old_password: str
    new_password: str
