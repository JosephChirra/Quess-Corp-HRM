@echo off
echo Starting HRMS Lite Backend...
call venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
