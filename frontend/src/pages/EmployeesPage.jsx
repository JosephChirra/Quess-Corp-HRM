import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Search } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees/');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/employees/', formData);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      fetchEmployees();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add employee.';
      setFormError(typeof errorMsg === 'string' ? errorMsg : 'Validation error check your input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
      </div>

      <ErrorMessage message={error} />

      <div className="grid grid-cols-2">
        {/* Left Col: Add Employee Form */}
        <div>
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} className="text-accent" />
              Add New Employee
            </h2>
            
            <ErrorMessage message={formError} />
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label text-secondary">Employee ID</label>
                <input 
                  type="text" 
                  name="employee_id" 
                  className="form-input" 
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  required 
                  placeholder="e.g., EMP-001"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-secondary">Full Name</label>
                <input 
                  type="text" 
                  name="full_name" 
                  className="form-input" 
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required 
                  placeholder="Jane Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-secondary">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-input" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder="jane@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-secondary">Department</label>
                <input 
                  type="text" 
                  name="department" 
                  className="form-input" 
                  value={formData.department}
                  onChange={handleInputChange}
                  required 
                  placeholder="Engineering"
                />
              </div>
              <button type="submit" className="btn w-full" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? <Loader /> : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Employee List */}
        <div>
          {loading ? (
            <div className="glass-panel"><Loader fullPage /></div>
          ) : employees.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No employees found"
              description="Start by adding a new employee using the form."
            />
          ) : (
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="table-container" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.employee_id}>
                        <td>
                          <div style={{ fontWeight: '500', color: 'white' }}>{emp.full_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {emp.employee_id} • {emp.email}
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)' }}>
                            {emp.department}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn btn-danger"
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            onClick={() => handleDelete(emp.employee_id)}
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
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

export default EmployeesPage;
