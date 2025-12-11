import Grid from '@mui/material/Grid'

import SubCategoryTable from '@/views/SubCategory/ListSubCategory'

const subcategory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SubCategoryTable />
      </Grid>
    </Grid>
  )
}

export default subcategory
