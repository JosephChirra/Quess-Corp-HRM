import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateEmployee } from '../../hooks/useEmployees';

export default function AddEmployeeModal({ isOpen, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createMutation = useCreateEmployee();

  useEffect(() => {
    if (!isOpen) {
      reset();
      createMutation.reset();
    }
  }, [isOpen, reset, createMutation]);

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        // Option to add toast success here
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        
        {createMutation.isError && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {createMutation.error?.response?.data?.detail || "An error occurred while creating the employee."}
          </div>
        )}

        <Input 
          label="Employee ID" 
          placeholder="e.g. EMP-001"
          {...register('employee_id', { required: 'Employee ID is required' })}
          error={errors.employee_id?.message}
        />

        <Input 
          label="Full Name" 
          placeholder="Jane Doe"
          {...register('full_name', { required: 'Full Name is required' })}
          error={errors.full_name?.message}
        />

        <Input 
          label="Email Address" 
          type="email"
          placeholder="jane@example.com"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          error={errors.email?.message}
        />

        <Input 
          label="Department" 
          placeholder="Engineering"
          {...register('department', { required: 'Department is required' })}
          error={errors.department?.message}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Save Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}
