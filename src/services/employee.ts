// services/employee.ts
import { apiGet, apiPost } from '@/libs/api'
import { serverFetch } from '@/libs/fetch/server-fetch'
import { ApiResult } from '@/libs/types/api'
import { Employee } from '@/types/employee'

// API Response interface

type EmployeeApiResponse = {
  status: number
  message: string
  data: Employee[]
}

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

export interface EmployeeDeleteResponse {
  message: string
  status: number
}

// GET employee list
// export function getEmployeeList() {
//   return apiGet<EmployeeListResponse>('/employee/employee-list')
// }

export async function getEmployeesServer(): Promise<ApiResult<Employee[]>> {
  const result = await serverFetch<EmployeeApiResponse>('/employee/employee-list')

  if (!result.success) return result

  return {
    success: true,
    data: result.data.data // normalize 🔥
  }
}

export function getEmployeeList() {
  return serverFetch<EmployeeListResponse>('/employee/employee-list')
}

export function getEmployee(id: number) {
  return apiGet<EmployeeResponse>(`/employee/employee-detail-list?id=${id}`)
}

export function deleteEmployee(id: number) {
  return apiGet<EmployeeDeleteResponse>(`/employee/delete-employee'?id=${id}`)
}
