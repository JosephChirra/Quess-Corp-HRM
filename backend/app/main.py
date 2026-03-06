from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from fastapi.exceptions import RequestValidationError

from app.database import engine, Base
from app.routers import employees, attendance
from app.core.config import settings
from app.core.exceptions import validation_exception_handler, integrity_error_handler

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this. Using * for ease of Lite version deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)

# Routers
app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def root():
    return {"message": "Welcome to HRMS Lite API"}
