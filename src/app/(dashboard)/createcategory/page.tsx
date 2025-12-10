import Grid from '@mui/material/Grid'

import CreateCategoryPage from '@views/Category/CreateCategory'

const createcategory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateCategoryPage />
      </Grid>
    </Grid>
  )
}

export default createcategory
