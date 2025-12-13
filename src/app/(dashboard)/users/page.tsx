import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import { getEmployeesServer } from '@/services/employee'
import ListUser from '@/views/user/ListUser'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  const result = await getEmployeesServer()

  if (!result.success) {
    if (result.error.status === 401) redirect('/login')

    return <ErrorState title='Unable to fetch employees' message={result.error.message} />
  }

  // if (result.data.length === 0) {
  //   return <EmptyState title='No employees found' />
  // }

  return <ListUser token={token} data={result.data} />
}
