// import { api } from '@/services/api'
import ListUser from '@/views/user/ListUser'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  return <ListUser token={token} />
}
