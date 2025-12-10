import Grid from '@mui/material/Grid'

import EditCategoryPage from '@views/Category/EditCategory'

const editcategory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <EditCategoryPage />
      </Grid>
    </Grid>
  )
}

export default editcategory
