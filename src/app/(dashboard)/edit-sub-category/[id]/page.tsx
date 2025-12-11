import Grid from '@mui/material/Grid'

import EditSubCategoryPage from '@/views/SubCategory/EditSubCategory'

const Editsubcategory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <EditSubCategoryPage />
      </Grid>
    </Grid>
  )
}

export default Editsubcategory
