import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AttendancePage() {
  // The Attendance Page is no longer needed in its standalone form because 
  // the UX overhaul combined the Attendance tracking directly into the Employees table.
  // We can either redirect to Employees, or show a basic placeholder. 
  // For an optimized workflow, we redirect to employees.
  return <Navigate to="/employees" replace />;
}
