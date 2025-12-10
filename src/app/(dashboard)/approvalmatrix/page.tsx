import Grid from '@mui/material/Grid'

import ApprovalMatrixPage from '@views/ApprovalMatrix/AddApprovalMatrix'

const approvalmatrix = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ApprovalMatrixPage />
      </Grid>
    </Grid>
  )
}

export default approvalmatrix
