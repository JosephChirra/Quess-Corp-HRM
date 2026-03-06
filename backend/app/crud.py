from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from fastapi import HTTPException
from datetime import date

# Employees CRUD

def get_employee(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    # Check if ID exists
    if get_employee(db, employee.employee_id):
        raise HTTPException(status_code=400, detail="Employee with this ID already exists")
    # Check if email exists
    if get_employee_by_email(db, employee.email):
        raise HTTPException(status_code=400, detail="Employee with this email already exists")

    db_employee = models.Employee(**employee.model_dump())
    try:
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Integrity error creating employee")

def delete_employee(db: Session, employee_id: str):
    db_employee = get_employee(db, employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return db_employee

# Attendance CRUD

def get_attendance_records(db: Session, employee_id: str = None, filter_date: date = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Attendance)
    if employee_id:
        query = query.filter(models.Attendance.employee_id == employee_id)
    if filter_date:
        query = query.filter(models.Attendance.date == filter_date)
    return query.order_by(models.Attendance.date.desc()).offset(skip).limit(limit).all()

def mark_attendance(db: Session, attendance: schemas.AttendanceCreate):
    # Check if employee exists
    if not get_employee(db, attendance.employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already marked for this date and employee
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    if existing:
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing

    db_attendance = models.Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance
