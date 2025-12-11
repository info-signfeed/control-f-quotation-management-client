export type StationData = {
  stationId: string
  stationName: string
} | null

export type User = {
  id: number
  username: string
  employeeId: string
  password: string
  fullName: string
  email: string
  mobile: string
  gender: string
  profileUrl: string
  district: string
  roleId: number
  role: string
  companyId: number
  createdBy: string
  isActive: boolean
  createdOn: string
  updatedOn: string
  stationData: StationData[]
}
