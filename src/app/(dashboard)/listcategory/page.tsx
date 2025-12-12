import { getCategoryList } from '@/services/category'
import Grid from '@mui/material/Grid'

import CategoryTable from '@views/Category/ListCategory'
import { get } from 'http'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ListCategoryPage = async () => {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  const res = await getCategoryList()
  if (res.status !== 200) {
    redirect('/error?msg=Failed to fetch category list')
  }

  const data = res.data || []
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CategoryTable data={data} token={token} />
      </Grid>
    </Grid>
  )
}

export default ListCategoryPage
