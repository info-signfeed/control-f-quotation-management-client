// services/employee.ts
import { apiGet, apiPost } from '@/libs/api'

// Employee interface
export interface Employee {
  id: number
  firstName: string
  lastName: string
  username: string
  password: string
  email: string
  mobile: string
  department: string
  userRole: number
  employeeId: string
  gender: string
  profilePic: string
  companyId: number
  isActive: boolean
  createdOn: string
  createdBy: string
  updatedOn: string | null
  updatedBy: string | null
}

// API Response interface
export interface EmployeeListResponse {
  message: string
  status: number
  data: Employee[]
}
// API Response interface
export interface EmployeeResponse {
  message: string
  status: number
  data: Employee
}

// GET employee list
export function getEmployeeList() {
  return apiGet<EmployeeListResponse>('/employee/employee-list')
}

export function getEmployee(id: number) {
  return apiGet<EmployeeResponse>(`/employee/employee-detail-list?id=${id}`)
}
