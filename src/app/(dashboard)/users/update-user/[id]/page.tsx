import { getEmployeeList } from '@/services/employee'
import AddUser from '@/views/user/AddUser'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  try {
    const { id } = params

    // Validate token
    const token = cookies().get('accessToken')?.value
    if (!token) redirect('/login')

    // Fetch employee list
    const res = await getEmployeeList()

    // Validate API structure
    if (!res || res.status !== 200 || !Array.isArray(res.data)) {
      redirect('/error?msg=Invalid employee API response')
    }

    const users = res.data

    // Validate ID
    const numericId = Number(id)
    if (isNaN(numericId)) redirect('/employees')

    // Find user
    const selectedUser = users.find(u => u.id === numericId)

    if (!selectedUser) {
      redirect('/employees') // or /404
    }

    return <AddUser token={token} userData={selectedUser} />
  } catch (error: any) {
    console.error('Page Error:', error)
    redirect('/error?msg=' + encodeURIComponent(error?.message ?? 'Something went wrong'))
  }
}
