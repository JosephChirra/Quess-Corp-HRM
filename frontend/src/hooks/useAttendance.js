import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendanceRecords, getAllAttendance, markAttendance } from '../services/api';

export function useEmployeeAttendanceHistory(employeeId) {
  return useQuery({
    queryKey: ['attendance', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      const { data } = await getAttendanceRecords(employeeId);
      return data;
    },
    enabled: !!employeeId,
  });
}

export function useAllAttendance(date) {
  return useQuery({
    queryKey: ['attendance', 'all', date],
    queryFn: async () => {
      const { data } = await getAllAttendance(date);
      return data;
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attendanceData) => {
      const { data } = await markAttendance(attendanceData);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate both personal history and the global daily list
      queryClient.invalidateQueries({ queryKey: ['attendance', data.employee_id] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'all'] });
    },
  });
}
