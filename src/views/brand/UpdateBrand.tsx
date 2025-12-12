'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Card, CardContent, Grid, Button, Typography } from '@mui/material'
import { useCountries } from '../../types/useCountries'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'

type FormValues = {
  brandName: string
  manufacturer: string
  origin: string
  headOffice: string
  focusCategory: number[]
  products: number[]
  segment: number
}

interface UpdateBrandProps {
  token: string
}

const UpdateBrand: React.FC<UpdateBrandProps> = ({ token }) => {
  const router = useRouter()
  const params = useParams()
  const brandId = params.id

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL

  const [focusCategories, setFocusCategories] = useState<any[]>([])
  const [productList, setProductList] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])
  const countries = useCountries()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  // -------------------------- LOAD SEGMENTS FIRST --------------------------
  useEffect(() => {
    const seg = [
      { id: 1, name: 'Mid Segment' },
      { id: 2, name: 'Economy' },
      { id: 3, name: 'Cheaper Economy' },
      { id: 4, name: 'Super Premium' }
    ]
    setSegments(seg)

    fetchCategories()
    fetchProducts()
  }, [])

  // ----------------------- FETCH BRAND ONLY AFTER SEGMENTS LOADED -----------------------
  useEffect(() => {
    if (brandId && segments.length > 0) {
      fetchBrandDetails()
    }
  }, [brandId, segments])

  // -------------------------- FETCH BRAND DETAILS --------------------------
  const fetchBrandDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/brand/brand-detail-list?id=${brandId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await res.json()
      const brand = result?.data

      if (brand) {
        reset({
          brandName: brand.brandName || '',
          manufacturer: brand.manufacturer || '',
          origin: brand.origin || '',
          headOffice: brand.headOffice || '',

          focusCategory: brand.focusCategory?.map((c: any) => c.id) || [],
          products: brand.products?.map((p: any) => p.id) || [],

          // FIXED: Convert string → segment ID
          segment: segments.find(s => s.name === brand.segment)?.id || null
        })
      }
    } catch (error) {
      console.log('Error fetching brand detail:', error)
    }
  }

  // -------------------------- FETCH CATEGORY --------------------------
  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/category/category-list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const result = await res.json()

    setFocusCategories(
      (result.data || []).map((c: any) => ({
        id: c.id,
        name: c.categoryName
      }))
    )
  }

  // -------------------------- FETCH PRODUCTS --------------------------
  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/product/product-list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const result = await res.json()

    setProductList(
      (result.data || []).map((p: any) => ({
        id: p.id,
        name: p.productType.trim()
      }))
    )
  }

  // -------------------------- UPDATE API CALL --------------------------
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        brandId: Number(brandId),
        segment: segments.find(s => s.id === data.segment)?.name || ''
      }

      const response = await fetch(`${API_URL}/brand/update-brand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        toast.success('Brand updated successfully!')
        router.push('/brand/list-brand')
      } else {
        toast.error(result.message || 'Failed to update brand.')
      }
    } catch (error) {
      console.error('Error updating brand:', error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <div className='flex my-5'>
        <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span
            className='cursor-pointer flex items-center justify-center'
            onClick={() => router.push('/brand/list-brand')}
          >
            ⬅
          </span>
          Update Brand
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card variant='outlined'>
          <Typography variant='h6' className='py-4 px-6 border-b'>
            Brand Details
          </Typography>

          <CardContent>
            <Grid container spacing={6}>
              {/* Brand Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='brandName'
                  control={control}
                  rules={{ required: 'Brand Name is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Brand Name*'
                      placeholder='Enter brand name'
                      error={!!errors.brandName}
                      helperText={errors.brandName?.message}
                    />
                  )}
                />
              </Grid>

              {/* Manufacturer */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='manufacturer'
                  control={control}
                  rules={{ required: 'Manufacturer is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Manufacturer*'
                      placeholder='Enter manufacturer'
                      error={!!errors.manufacturer}
                      helperText={errors.manufacturer?.message}
                    />
                  )}
                />
              </Grid>

              {/* Origin */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='origin'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countries}
                      value={countries.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Origin' placeholder='Select country' />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Head Office */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='headOffice'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Head Office' placeholder='Enter head office' />
                  )}
                />
              </Grid>

              {/* Focus Category */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='focusCategory'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      multiple
                      fullWidth
                      options={focusCategories}
                      value={focusCategories.filter(i => value?.includes(i.id))}
                      onChange={(e, val) => onChange(val.map(i => i.id))}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Focus Category' placeholder='Select categories' />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Products */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='products'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      multiple
                      fullWidth
                      options={productList}
                      value={productList.filter(i => value?.includes(i.id))}
                      onChange={(e, val) => onChange(val.map(i => i.id))}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Products' placeholder='Select products' />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Segment */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='segment'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={segments}
                      value={segments.find(i => i.id === value) || null}
                      onChange={(e, val) => onChange(val?.id || null)}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Segment' placeholder='Select segment' />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid item xs={12} className='flex justify-end gap-4 mt-6'>
          <Button variant='outlined' onClick={() => router.push('/brand/list-brand')}>
            Cancel
          </Button>

          <Button variant='contained' type='submit'>
            Update
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default UpdateBrand
