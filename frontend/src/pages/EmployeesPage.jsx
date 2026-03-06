import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Trash2, CalendarDays } from 'lucide-react';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import { useAllAttendance, useMarkAttendance } from '../hooks/useAttendance';
import { format } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import AddEmployeeModal from '../features/employees/AddEmployeeModal';
import AttendanceModal from '../features/attendance/AttendanceModal';

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] = useState(null);

  const { data: employees = [], isLoading } = useEmployees();
  const deleteMutation = useDeleteEmployee();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { data: attendance = [] } = useAllAttendance(todayStr);
  const markAttendanceMutation = useMarkAttendance();

  // Deduplicate departments for the filter dropdown
  const departments = useMemo(() => {
    const deps = new Set(employees.map(e => e.department));
    return ['All', ...Array.from(deps)];
  }, [employees]);

  // Derived state: filter and sort
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(e => {
        const matchesSearch = e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              e.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'All' || e.department === departmentFilter;
        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        const fieldA = a[sortField].toLowerCase();
        const fieldB = b[sortField].toLowerCase();
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [employees, searchTerm, departmentFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getAttendanceStatusForToday = (employeeId) => {
    const record = attendance.find(a => a.employee_id === employeeId);
    return record?.status; // 'Present', 'Absent', or undefined
  };

  const toggleAttendance = (employeeId, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    markAttendanceMutation.mutate({
      employee_id: employeeId,
      date: todayStr,
      status: newStatus,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also remove their attendance history.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Employees
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team directory and instantly track today's attendance.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="bg-white px-4 py-5 shadow-card sm:rounded-xl border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
           <div className="h-12 bg-gray-200 rounded-md w-full"></div>
           <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        </div>
      ) : (
        <div className="bg-white shadow-card rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('full_name')}>
                    <div className="flex items-center gap-1">
                      Employee <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('department')}>
                    <div className="flex items-center gap-1">
                       Department <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Today's Attendance
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((person) => {
                  const currentStatus = getAttendanceStatusForToday(person.employee_id);
                  const isPresent = currentStatus === 'Present';
                  const isAbsent = currentStatus === 'Absent';

                  return (
                    <tr key={person.employee_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                              <span className="text-sm font-medium leading-none text-primary-700">
                                {person.full_name.split(' ').map(n => n[0]).join('').substring(0,2)}
                              </span>
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{person.full_name}</div>
                            <div className="text-sm text-gray-500">{person.employee_id} &bull; {person.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="primary">{person.department}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <button
                             onClick={() => toggleAttendance(person.employee_id, currentStatus)}
                             className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors ring-1 ring-inset ${
                               isPresent ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-white text-gray-600 hover:bg-gray-50 ring-gray-200'
                             }`}
                           >
                             Present
                           </button>
                           <button
                             onClick={() => toggleAttendance(person.employee_id, currentStatus)}
                             className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors ring-1 ring-inset ${
                               isAbsent ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-white text-gray-600 hover:bg-gray-50 ring-gray-200'
                             }`}
                           >
                             Absent
                           </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setSelectedEmployeeForAttendance(person)}
                            title="View full calendar"
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                          >
                            <CalendarDays className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(person.employee_id)}
                            title="Delete employee"
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-lg font-medium">No employees found</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddEmployeeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {selectedEmployeeForAttendance && (
        <AttendanceModal
          isOpen={true}
          onClose={() => setSelectedEmployeeForAttendance(null)}
          employee={selectedEmployeeForAttendance}
        />
      )}
    </div>
  );
}
