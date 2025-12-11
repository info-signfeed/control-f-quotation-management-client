import AddUser from '@/views/user/AddUser'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { api } from '@/services/api'

interface Props {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const { id } = params

  const token = cookies().get('accessToken')?.value
  if (!token) redirect('/login')

  // Fetch users list
  const allUsersRes = await api.user.getAllUsers()

  const users = !('error' in allUsersRes) ? allUsersRes.case ?? [] : []

  const selectedUser = users.find((u: any) => Number(u.id) === Number(id)) || null

  // Fetch district list
   const cookieStore = cookies()
    const cookieHeader = cookieStore.toString()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/districts`,
    {
      headers: { Cookie: cookieHeader },
      cache: 'no-store'
    }
  )

  const districtList = await res.json()

  return (
    <AddUser
      token={token}
      userData={selectedUser}
      districtList={districtList}
    />
  )
}
