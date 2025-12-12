import AddUser from '@/views/user/AddUser'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }
  const cookieStore = cookies()
  const cookieHeader = cookieStore.toString()

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_FRONTEND_URL ? process.env.NEXT_PUBLIC_FRONTEND_URL + '/api/districts' : '/api/districts'}`,
  //   {
  //     headers: {
  //       Cookie: cookieHeader
  //     },
  //     cache: 'no-store'
  //   }
  // )

  // if (!res.ok) {
  //   throw new Error('Failed to fetch districts')
  // }

  // const districts = await res.json()
  return <AddUser token={token} />
}

export default Page
