import Grid from '@mui/material/Grid'

import SubCategoryTable from '@/views/SubCategory/ListSubCategory'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSubCategoryList } from '@/services/sub-category'

const SubCategoryPage = async () => {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  const res = await getSubCategoryList()
  if (res.status !== 200) {
    redirect('/error?msg=Failed to fetch category list')
  }

  const data = res.data || []
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SubCategoryTable data={data} />
      </Grid>
    </Grid>
  )
}

export default SubCategoryPage
