from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app import crud, schemas, models
from app.database import get_db

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"]
)

@router.post("/", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return crud.mark_attendance(db=db, attendance=attendance)

@router.get("/{employee_id}", response_model=List[schemas.Attendance])
def read_employee_attendance(employee_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if employee exists
    if not crud.get_employee(db, employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    records = crud.get_attendance_records(db, employee_id=employee_id, skip=skip, limit=limit)
    return records

@router.get("/", response_model=List[schemas.Attendance])
def read_all_attendance(
    date: Optional[date] = Query(None, description="Format: YYYY-MM-DD"),
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    records = crud.get_attendance_records(db, filter_date=date, skip=skip, limit=limit)
    return records
