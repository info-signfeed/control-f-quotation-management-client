import { getEmployee } from '@/services/employee'
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
    const res = await getEmployee(Number(id))
    console.log('res: ', res)

    // Validate API structure
    if (!res || res.status !== 200 || !res.data) {
      redirect('/error?msg=Invalid employee API response')
    }

    const data = res.data
    console.log('data: ', data)

    // Validate ID
    const numericId = Number(id)
    if (isNaN(numericId)) redirect('/employees')

    return <AddUser token={token} userData={data} />
  } catch (error: any) {
    console.error('Page Error:', error)
    redirect('/error?msg=' + encodeURIComponent(error?.message ?? 'Something went wrong'))
  }
}
