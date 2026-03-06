import React from 'react';
import Modal from '../../components/ui/Modal';
import { useEmployeeAttendanceHistory } from '../../hooks/useAttendance';
import { format, parseISO } from 'date-fns';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AttendanceModal({ isOpen, onClose, employee }) {
  const { data: records, isLoading, isError } = useEmployeeAttendanceHistory(employee?.employee_id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attendance History: ${employee?.full_name || ''}`} maxWidth="max-w-xl">
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Failed to load attendance history.
          </div>
        ) : !records || records.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">No recorded attendance history.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Visual Calendar Approximation (List sorted chronologically for now) */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Recent Records</h4>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {records.map((record) => (
                    <li key={record.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-900">
                        {format(parseISO(record.date.toString()), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div>
                        <Badge variant={record.status === 'Present' ? 'success' : 'danger'}>
                          {record.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                <p className="text-sm text-green-600 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-700">
                  {records.filter(r => r.status === 'Present').length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                <p className="text-sm text-red-600 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-700">
                  {records.filter(r => r.status === 'Absent').length}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </Modal>
  );
}
