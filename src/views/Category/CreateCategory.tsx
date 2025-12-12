'use client'

import React, { useCallback, useEffect } from 'react'

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
import { ProductData } from '@/services/product'
import { SubCategoryData } from '@/services/sub-category'

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

export default function CreateCategoryPage({ token }: { token: string }) {
  const router = useRouter()
  const [productList, setProductList] = React.useState<ProductData[]>([])
  const [subCategoryList, setSubCategoryList] = React.useState<SubCategoryData[]>([])

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

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product/product-list`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const res = await response.json()
        setProductList(res?.data)
      } else {
        console.error('Failed to fetch products:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [token])

  const fetchSubCategory = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sub-category/sub-category-list?status=active`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const res = await response.json()
        setSubCategoryList(res?.data)
      } else {
        console.error('Failed to fetch products:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [token])

  useEffect(() => {
    fetchProducts()
    fetchSubCategory()
  }, [token, fetchProducts, fetchSubCategory])

  async function onSubmit(data: FormValues) {
    console.log('data: ', data)
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
        router.push('/listcategory') // change this route to your real category list route
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
              {/* Product */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.product}>
                  <label className='text-sm text-[#1e2a55] mb-1 block'>
                    Product <span className='text-red-500'>*</span>
                  </label>

                  <Controller
                    name='product'
                    control={control}
                    rules={{ required: 'Product is required' }}
                    render={({ field }) => (
                      <Select
                        displayEmpty
                        {...field}
                        sx={{
                          height: '44px',
                          borderRadius: '8px',
                          '& .MuiSelect-select': {
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }
                        }}
                        renderValue={selected => {
                          if (!selected) {
                            return <span className='text-gray-400'>Type</span>
                          }

                          const item = productList.find(p => Number(p.id) === Number(selected))

                          return item?.productType || selected
                        }}
                      >
                        {productList.map(p => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.productType}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.product?.message}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Category Name */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoryName}>
                  <label className='text-sm text-[#1e2a55] mb-1 block'>
                    Category <span className='text-red-500'>*</span>
                  </label>

                  <Controller
                    name='categoryName'
                    control={control}
                    rules={{ required: 'Category name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder='Enter category'
                        error={!!errors.categoryName}
                        helperText={errors.categoryName?.message}
                        InputProps={{
                          sx: {
                            height: '44px',
                            borderRadius: '8px',
                            '& .MuiInputBase-input': {
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Sub-category */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.product}>
                  <label className='text-sm text-[#1e2a55] mb-1 block'>
                    Sub Category <span className='text-red-500'>*</span>
                  </label>

                  <Controller
                    name='subCategory'
                    control={control}
                    rules={{ required: 'Sub category is required' }}
                    render={({ field }) => (
                      <Select
                        displayEmpty
                        {...field}
                        sx={{
                          height: '44px',
                          borderRadius: '8px',
                          '& .MuiSelect-select': {
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }
                        }}
                        renderValue={selected => {
                          if (!selected) {
                            return <span className='text-gray-400'>sub category</span>
                          }

                          const item = subCategoryList.find(p => Number(p.id) === Number(selected))

                          return item?.subCategory || selected
                        }}
                      >
                        {subCategoryList.map(p => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.subCategory}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.product?.message}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Sizes (Multi-select) */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.sizes}>
                  <label className='text-sm text-[#1e2a55] mb-1 block'>
                    Sizes <span className='text-red-500'>*</span>
                  </label>

                  <Controller
                    name='sizes'
                    control={control}
                    rules={{ required: 'Please select at least one size' }}
                    render={({ field }) => (
                      <Select
                        multiple
                        {...field}
                        input={
                          <OutlinedInput
                            sx={{
                              height: '44px', // 👈 HEIGHT CONTROL HERE
                              borderRadius: '8px',
                              padding: '0 8px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          />
                        }
                        renderValue={selected => (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {selected.map(value => (
                              <Chip key={value} label={value} size='small' />
                            ))}
                          </Box>
                        )}
                        sx={{
                          height: '44px', // 👈 MATCH HEIGHT HERE
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px !important',
                            height: '44px !important' // 👈 FINAL FIX
                          }
                        }}
                      >
                        {SIZES.map(s => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  <FormHelperText>{errors.sizes?.message}</FormHelperText>
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
