import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Employees API
export const getEmployees = () => api.get("/employees/");
export const createEmployee = (data) => api.post("/employees/", data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Attendance API
export const getAttendanceRecords = (employeeId) =>
  api.get(`/attendance/${employeeId}`);
export const getAllAttendance = (date) => {
  const params = date ? { date } : {};
  return api.get("/attendance/", { params });
};
export const markAttendance = (data) => api.post("/attendance/", data);

export default api;
