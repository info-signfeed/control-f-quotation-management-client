'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box
} from '@mui/material'
import { toast } from 'react-toastify'

interface AddCaseTypeProps {
  open: boolean
  onClose: () => void
  token: string
  onSuccess: () => void
}

const AddCaseType: React.FC<AddCaseTypeProps> = ({ open, onClose, token, onSuccess }) => {
  const [caseName, setCaseName] = useState('')

  const handleCreate = async () => {
    if (!caseName.trim()) {
      toast.error('Case Name is required')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/add-case-type`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseName,
          status: 'Active'
        })
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        toast.success('Case Type Created Successfully')
        setCaseName('')
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Failed to create case type')
      }
    } catch (error) {
      console.error('Create Type Error:', error)
      toast.error('API Error')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '18px' }}>
        Create Case Type
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          size="small"
          label="Type Name"
          value={caseName}
          onChange={(e) => setCaseName(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Box display="flex" flexDirection="row" gap={2} mt={4}>
          <Button variant="contained" fullWidth onClick={handleCreate}>
            Save
          </Button>

          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddCaseType
