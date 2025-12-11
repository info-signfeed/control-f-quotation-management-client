'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Grid
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { IconX } from '@tabler/icons-react'
import { toast } from 'react-toastify'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

interface AddCategoryProps {
  open: boolean
  onClose: () => void
  token: string
  onSuccess: () => void
}

export default function AddCategory({ open, onClose, token, onSuccess }: AddCategoryProps) {
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      product: '',
      category: '',
      subCategory: '',
      sizes: ''
    }
  })

  const submitHandler = async (data: any) => {
    if (!data.product || !data.category || !data.subCategory || !data.sizes) {
      toast.error('All fields are required')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/add-category`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        toast.success('Category Created Successfully')
        reset()
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Failed to create category')
      }
    } catch (error) {
      console.error(error)
      toast.error('API Error')
    }
  }

  const handleCancel = () => {
    reset()          // Clear form
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0 } }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', pr: 5 }}>
        Category details
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <IconX size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 4 }}>
        <Box
          sx={{
            border: '1px solid #E4E7EC',
            borderRadius: '10px',
            p: 3,
            mb: 4
          }}
        >
          <Grid container spacing={3}>
            {/* PRODUCT (Dropdown) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="product"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['Electronics', 'Food', 'Auto', 'Textile']} // replace
                    fullWidth
                    value={value || ''}
                    onChange={(e, val) => onChange(val)}
                    renderInput={(params: any) => (
                      <CustomTextField {...params} label="Product*" placeholder="Select product" />
                    )}
                  />
                )}
              />
            </Grid>

            {/* CATEGORY (Text field) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label="Category*" placeholder="Category name" />
                )}
              />
            </Grid>

            {/* SUB CATEGORY (Dropdown) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="subCategory"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['Sub1', 'Sub2', 'Sub3']} // replace
                    fullWidth
                    value={value || ''}
                    onChange={(e, val) => onChange(val)}
                    renderInput={(params: any) => (
                      <CustomTextField {...params} label="Sub-category*" placeholder="Select sub-category" />
                    )}
                  />
                )}
              />
            </Grid>

            {/* SIZES (Dropdown) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="sizes"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['S', 'M', 'L', 'XL']} // replace
                    fullWidth
                    value={value || ''}
                    onChange={(e, val) => onChange(val)}
                    renderInput={(params: any) => (
                      <CustomTextField {...params} label="Sizes*" placeholder="Select sizes" />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {/* BUTTONS */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit(submitHandler)}
          >
            Create category
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
