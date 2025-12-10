import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Grid } from '@mui/material'
import CreateSupplier from '@/views/supplier/AddSupplier'

// import CreateCases from '@/views/cases/CreateCase'

const AddSupplierPage = async () => {
//   const token = cookies().get('accessToken')?.value

//   if (!token) {
//     redirect('/login')
//   }

  return (
    <Grid container>
      <Grid item xs={12}>
      <CreateSupplier token={''}/>
      </Grid>
    </Grid>
  )
}

export default AddSupplierPage
