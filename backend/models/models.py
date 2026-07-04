from database import Base
from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="employee")
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    designation = Column(String, nullable=True)

    attendances = relationship(
        "Attendance", back_populates="user", cascade="all, delete-orphan"
    )
    leaves = relationship(
        "LeaveRequest", back_populates="user", cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    check_in = Column(Time, nullable=True)
    check_out = Column(Time, nullable=True)
    status = Column(String, default="Present")

    user = relationship("User", back_populates="attendances")


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    leave_type = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, default="Pending")

    user = relationship("User", back_populates="leaves")


class SalaryTemplate(Base):
    __tablename__ = "salary_templates"

    id = Column(Integer, primary_key=True, index=True)
    designation = Column(String, unique=True, index=True, nullable=False)
    basic = Column(Float, default=0.0)
    hra = Column(Float, default=0.0)
    special = Column(Float, default=0.0)
