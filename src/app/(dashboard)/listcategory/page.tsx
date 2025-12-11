import Grid from '@mui/material/Grid'

import CategoryTable from '@views/Category/ListCategory'

const dashboard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CategoryTable data={[]} />
      </Grid>
    </Grid>
  )
}

export default dashboard
