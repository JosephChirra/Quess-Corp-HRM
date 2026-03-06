import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, Shield } from 'lucide-react';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon size={18} />
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <Shield size={28} />
          HRMS Lite
        </Link>
        <div className="nav-links">
          <NavLink to="/employees" icon={Users}>Employees</NavLink>
          <NavLink to="/attendance" icon={CalendarCheck}>Attendance</NavLink>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </main>
      
      <footer style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} HRMS Lite. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;
