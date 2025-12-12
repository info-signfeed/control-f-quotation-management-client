export type StationData = {
  stationId: string
  stationName: string
} | null

export interface User {
  id: number
  firstName: string
  lastName: string | null
  username: string
  password: string
  userEmail: string
  userMobile: string
  department: string | null
  userRole: number
  employeeId: string
  gender: 'male' | 'female' | 'other' | string
  profilePic: string | null
  createdOn: string
  createdBy: string
  updatedOn: string | null
  updatedBy: string | null
  isActive: boolean
  companyId: number
}
