import { Grid } from '@mui/material'
import ListProduct from '@/views/product/ListProduct'

const ListProductPage = () => {
  // const token = cookies().get('accessToken')?.value
  // if (!token) {
  //   redirect('/login')
  // }

  return (
    <Grid container>
      <Grid item xs={12}>
        <ListProduct data={[]} />
      </Grid>
    </Grid>
  )
}

export default ListProductPage
