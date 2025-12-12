import CreateSubCategoryPage from '@/views/SubCategory/CreateSubCategoryPage'
import Grid from '@mui/material/Grid'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Createsubcategory = () => {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateSubCategoryPage token={token} />
      </Grid>
    </Grid>
  )
}

export default Createsubcategory
