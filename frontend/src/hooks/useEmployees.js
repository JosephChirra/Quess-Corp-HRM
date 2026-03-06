import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await getEmployees();
      return data;
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newEmployee) => {
      const { data } = await createEmployee(newEmployee);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeId) => {
      await deleteEmployee(employeeId);
      return employeeId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['employees'], (old) => old?.filter(e => e.employee_id !== deletedId));
    },
  });
}
