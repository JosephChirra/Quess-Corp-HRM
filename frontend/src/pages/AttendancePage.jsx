import React, { useState, useEffect } from 'react';
import { CalendarCheck, Search } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Selected state
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // Form state
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    status: 'Present'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendanceRecords(selectedEmployee);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedEmployee]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const empRes = await api.get('/employees/');
      setEmployees(empRes.data);
      if (empRes.data.length > 0) {
        setSelectedEmployee(empRes.data[0].employee_id);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load initial data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async (empId) => {
    try {
      setRecordsLoading(true);
      const res = await api.get(`/attendance/${empId}`);
      setAttendanceRecords(res.data);
    } catch (err) {
      setError('Failed to load attendance records.');
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setFormError("Please select an employee first");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/attendance/', {
        employee_id: selectedEmployee,
        ...formData
      });
      fetchAttendanceRecords(selectedEmployee);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to mark attendance.';
      setFormError(typeof errorMsg === 'string' ? errorMsg : 'Validation error check your input');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
      </div>

      <ErrorMessage message={error} />

      <div className="grid grid-cols-2">
        {/* Left Col: Mark Attendance Form */}
        <div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={20} className="text-accent" />
              Mark Attendance
            </h2>
            
            <ErrorMessage message={formError} />
            
            {employees.length === 0 ? (
              <EmptyState 
                title="No employees found"
                description="Please add employees first before marking attendance."
              />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label text-secondary">Select Employee</label>
                  <select 
                    className="form-select"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    {employees.map(emp => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.full_name} ({emp.employee_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label text-secondary">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    className="form-input" 
                    value={formData.date}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-secondary">Status</label>
                  <select 
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <button type="submit" className="btn w-full" disabled={isSubmitting} style={{ width: '100%' }}>
                  {isSubmitting ? <Loader /> : 'Mark Attendance'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Attendance List */}
        <div>
          {recordsLoading ? (
            <div className="glass-panel"><Loader fullPage /></div>
          ) : !selectedEmployee ? (
             <EmptyState 
              icon={Search}
              title="Select an employee"
              description="Choose an employee to view their attendance history."
            />
          ) : attendanceRecords.length === 0 ? (
            <EmptyState 
              icon={CalendarCheck}
              title="No attendance records"
              description="This employee has no attendance history."
            />
          ) : (
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>History for {employees.find(e => e.employee_id === selectedEmployee)?.full_name}</h3>
              </div>
              <div className="table-container" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record.id}>
                        <td style={{ fontWeight: '500' }}>
                          {formatDate(record.date)}
                        </td>
                        <td>
                          <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
