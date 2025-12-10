'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Chip,
  OutlinedInput,
  Button,
  Stack,
  Divider
} from '@mui/material'

// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useForm, Controller } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormValues = {
  product: string
  categoryName: string
  subCategory: string
  sizes: string[]
}

const PRODUCTS = [
  { id: 'p1', label: 'Type A' },
  { id: 'p2', label: 'Type B' },
  { id: 'p3', label: 'Type C' }
]

const SUBCATEGORIES = [
  { id: 'sc1', label: 'Sub category 1' },
  { id: 'sc2', label: 'Sub category 2' },
  { id: 'sc3', label: 'Sub category 3' }
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function CreateCategoryPage() {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      product: '',
      categoryName: '',
      subCategory: '',
      sizes: []
    }
  })

  async function onSubmit(data: FormValues) {
    try {
      // Replace URL and payload shape with your API
      // Example: POST to next API route (app/api/category/route.ts) or external API
      const payload = {
        productId: data.product,
        categoryName: data.categoryName,
        subCategoryId: data.subCategory,
        sizes: data.sizes
      }

      // Example fetch (adjust headers/auth as required)
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      // If you use a different API base, change the URL above
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create category')
      }

      toast.success('Category created successfully!')
      // small delay so user sees toast (adjust/remove as desired)
      setTimeout(() => {
        router.push('/categorylist') // change this route to your real category list route
      }, 900)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Something went wrong.')
    }
  }

  return (
    <Box>
      <ToastContainer position='top-right' />
      <div className='items-center gap-2 mb-4 flex'>
        <button className='hover:cursor-pointer' onClick={() => router.back()}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M5 12l14 0' />
            <path d='M5 12l4 4' />
            <path d='M5 12l4 -4' />
          </svg>
        </button>
        <p className='font-medium text-lg'> Category </p>
      </div>

      <Card variant='outlined' sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant='subtitle1' fontWeight={600} gutterBottom>
            Category details
          </Typography>

          <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              {/* Product */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.product}>
                  <InputLabel id='product-label'>
                    Product <span style={{ color: '#d32f2f' }}>*</span>
                  </InputLabel>
                  <Controller
                    name='product'
                    control={control}
                    rules={{ required: 'Product is required' }}
                    render={({ field }) => (
                      <Select labelId='product-label' label='Product *' {...field}>
                        <MenuItem value=''>
                          <em>Type</em>
                        </MenuItem>
                        {PRODUCTS.map(p => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.product ? errors.product.message : ''}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Category (text input) */}
              <Grid item xs={12} md={6}>
                <Controller
                  name='categoryName'
                  control={control}
                  rules={{ required: 'Category name is required' }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label={
                        <>
                          Category <span style={{ color: '#d32f2f' }}>*</span>
                        </>
                      }
                      {...field}
                      error={!!errors.categoryName}
                      helperText={errors.categoryName?.message}
                    />
                  )}
                />
              </Grid>

              {/* Sub-category */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.subCategory}>
                  <InputLabel id='subcat-label'>
                    Sub-category <span style={{ color: '#d32f2f' }}>*</span>
                  </InputLabel>
                  <Controller
                    name='subCategory'
                    control={control}
                    rules={{ required: 'Sub-category is required' }}
                    render={({ field }) => (
                      <Select labelId='subcat-label' label='Sub-category *' {...field}>
                        <MenuItem value=''>
                          <em>Sub category</em>
                        </MenuItem>
                        {SUBCATEGORIES.map(s => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.subCategory ? errors.subCategory.message : ''}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Sizes multi-select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.sizes}>
                  <InputLabel id='sizes-label'>
                    Sizes <span style={{ color: '#d32f2f' }}>*</span>
                  </InputLabel>
                  <Controller
                    name='sizes'
                    control={control}
                    rules={{ required: 'Please select at least one size' }}
                    render={({ field }) => (
                      <Select
                        labelId='sizes-label'
                        multiple
                        input={<OutlinedInput label='Sizes *' />}
                        renderValue={selected => (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {(selected as string[]).map(value => (
                              <Chip key={value} label={value} size='small' />
                            ))}
                          </Box>
                        )}
                        {...field}
                      >
                        {SIZES.map(s => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.sizes ? errors.sizes.message : ''}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Stack direction='row' justifyContent='flex-end' spacing={2}>
              <Button variant='outlined' onClick={() => router.back()} sx={{ textTransform: 'none', minWidth: 120 }}>
                Cancel
              </Button>

              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting}
                sx={{
                  textTransform: 'none',
                  minWidth: 140,
                  backgroundColor: '#0b69ff', // primary blue
                  boxShadow: '0 2px 6px rgba(11,105,255,0.25)'
                }}
              >
                Create category
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
