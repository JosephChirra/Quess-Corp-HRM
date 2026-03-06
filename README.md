# HRMS Lite

A production-ready internal Human Resource Management System for tracking employees and their attendance.

## Project Overview

HRMS Lite allows an admin to manage employees (add/view/delete) and track their daily attendance (Present/Absent). It features a clean, minimal, glassmorphism-styled UI and a robust Python backend.

## Tech Stack

- **Frontend**: React.js (Vite), Vanilla CSS, React Router, Axios, Lucide Icons
- **Backend**: FastAPI (Python), Pydantic, SQLAlchemy, Uvicorn
- **Database**: SQLite (Configured for easy local testing), easily scalable to MySQL by changing `DATABASE_URL`

## Architecture

This project follows a decoupled architecture where the Frontend and Backend communicate via RESTful APIs.

- The React Frontend manages UI state and routing.
- The FastAPI Backend validates requests, handles business logic, and persists data to the SQL Database via SQLAlchemy ORM.

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   \`cd backend\`
2. Create and activate a virtual environment:
   \`python -m venv venv\`
   \`venv\\Scripts\\activate\` (Windows) or \`source venv/bin/activate\` (Mac/Linux)
3. Install dependencies:
   \`pip install -r requirements.txt\`
4. Run the development server:
   \`uvicorn app.main:app --reload --port 8000\`

### 2. Frontend Setup

1. Navigate to the frontend directory:
   \`cd frontend\`
2. Install dependencies:
   \`npm install\`
3. Create a \`.env\` file in the \`frontend\` directory to point to your backend:
   \`VITE_API_URL=http://localhost:8000\`
4. Run the development server:
   \`npm run dev -- --port 5173\`

## Database Setup

By default, the backend uses SQLite to ensure the application works out of the box without complex SQL installation.
To use **MySQL** as requested for production:

1. Create a MySQL database (e.g., via Railway or PlanetScale or locally).
2. Install the MySQL driver in the backend: \`pip install pymysql\`
3. Create a \`.env\` file in the \`backend\` directory and set:
   \`DATABASE_URL=mysql+pymysql://user:password@host:port/dbname\`
4. Restart the FastAPI server. SQLAlchemy will automatically create tables on startup.

## API Endpoints Documentation

### Employees

- \`POST /employees/\`: Create a new employee
- \`GET /employees/\`: List all employees
- \`DELETE /employees/{employee_id}\`: Delete an employee

### Attendance

- \`POST /attendance/\`: Mark attendance for an employee
- \`GET /attendance/{employee_id}\`: Get attendance records for a specific employee
- \`GET /attendance/\`: List attendance for all, optionally filtered by \`?date=YYYY-MM-DD\`

## Deployment Details

### Backend (Render/Railway)

1. Commit the code to GitHub.
2. Link your GitHub repo to Render or Railway.
3. Set the start command to: \`uvicorn app.main:app --host 0.0.0.0 --port $PORT\`
4. Add the \`DATABASE_URL\` environment variable for your MySQL instance.

### Frontend (Vercel/Netlify)

1. Link the \`frontend\` directory of your GitHub repo to Vercel or Netlify.
2. Override the build command to: \`npm run build\` and Output Directory to \`dist\`.
3. Add the \`VITE_API_URL\` environment variable pointing to your deployed Backend API URL.

## Assumptions & Limitations

- Authentication is strictly omitted as per requirements.
- Uses SQLite by default for immediate developer experience, designed to drop in MySQL smoothly via \`DATABASE_URL\` env var.
- Assumes the backend and frontend are hosted separately.
