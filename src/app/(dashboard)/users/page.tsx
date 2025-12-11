// import { api } from '@/services/api'
import ListUser from '@/views/user/ListUser'

export default async function Page() {
  // const response = await api.user.getAllUsers()
  // const data = !('error' in response) ? response.case : []

  return <ListUser data={[]} />
}
