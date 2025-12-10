import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Grid } from '@mui/material'
import AddCustomer from '@/views/customer/AddCustomer'

// import CreateCases from '@/views/cases/CreateCase'

const AddCustomerPage = async () => {
//   const token = cookies().get('accessToken')?.value

//   if (!token) {
//     redirect('/login')
//   }

  return (
    <Grid container>
      <Grid item xs={12}>
     <AddCustomer token={''}/>
      </Grid>
    </Grid>
  )
}

export default AddCustomerPage
