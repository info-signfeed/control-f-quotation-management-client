import { Grid } from '@mui/material'
import ListProduct from '@/views/product/ListProduct'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProductList } from '@/services/product'

const ListProductPage = async () => {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/login')
  }

  const res = await getProductList()
  if (res.status !== 200) {
    redirect('/error?msg=Failed to fetch category list')
  }

  const data = res.data || []

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListProduct data={data} />
      </Grid>
    </Grid>
  )
}

export default ListProductPage
