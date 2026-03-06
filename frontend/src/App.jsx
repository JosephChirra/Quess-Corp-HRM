import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
// EmployeesPage and AttendancePage will be updated shortly
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected layout routes (mocked protected) */}
        <Route path="/" element={<AppLayout><Navigate to="/dashboard" replace /></AppLayout>} />
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/employees" element={<AppLayout><EmployeesPage /></AppLayout>} />
        <Route path="/attendance" element={<AppLayout><AttendancePage /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
