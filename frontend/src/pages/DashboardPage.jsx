import React, { useMemo } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAllAttendance } from '../hooks/useAttendance';
import { format } from 'date-fns';
import EmployeesPage from './EmployeesPage';

export default function DashboardPage() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { data: attendance, isLoading: attendanceLoading } = useAllAttendance(todayStr);

  const stats = useMemo(() => {
    if (!employees || !attendance) return null;
    
    const totalEmployees = employees.length;
    let presentCount = 0;
    let absentCount = 0;

    attendance.forEach(record => {
      if (record.status === 'Present') presentCount++;
      if (record.status === 'Absent') absentCount++;
    });

    return [
      { id: 1, name: 'Total Employees', stat: totalEmployees, icon: Users, color: 'text-primary-600', bgColor: 'bg-primary-50' },
      { id: 2, name: 'Present Today', stat: presentCount, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
      { id: 3, name: 'Absent Today', stat: absentCount, icon: UserX, color: 'text-red-600', bgColor: 'bg-red-50' },
    ];
  }, [employees, attendance]);

  return (
    <div>
      <div className="mb-8">
        <p className="mt-1 text-sm text-gray-500">
          Overview of your company's human resources and attendance for today, {format(new Date(), 'MMMM d, yyyy')}.
        </p>
      </div>

      {(employeesLoading || attendanceLoading) ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
             <div key={i} className="animate-pulse bg-white overflow-hidden rounded-xl shadow-card p-5 h-24 border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats?.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl bg-white px-4 pb-12 pt-5 shadow-card border border-gray-100 sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-3xl font-semibold text-gray-900">{item.stat}</p>
              </dd>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
      <EmployeesPage/>
      </div>
    </div>
  );
}
