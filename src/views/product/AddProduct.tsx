'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Card, CardContent, Grid, Button, Typography, Box } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import FileUploader from '@/components/FileUploader'
import RichTextEditor from '@/components/RichTextEditor'

// ------------ FORM TYPES ------------
type FormValues = {
  pattern: string
  manufacturer: string
  origin: string
  headOffice: string
  focusCategory: string
  products: string[]
  segment: string
}

interface AddProductProps {
  token: string
}

const AddProduct: React.FC<AddProductProps> = ({ token }) => {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL

  const [countryList, setCountryList] = useState<any[]>([])
  const [focusCategories, setFocusCategories] = useState<any[]>([])
  const [productList, setProductList] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])

  // ------------ Fetch Dropdown Data ------------
  const fetchDropdowns = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/brand-dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        setCountryList(result.data?.countries || [])
        setFocusCategories(result.data?.focusCategories || [])
        setProductList(result.data?.products || [])
        setSegments(result.data?.segments || [])
      } else {
        toast.error(result.message || 'Failed to fetch dropdowns.')
      }
    } catch (error) {
      console.error('Error fetching dropdowns:', error)
      toast.error('Something went wrong!')
    }
  }, [API_URL, token])

  useEffect(() => {
    fetchDropdowns()
  }, [fetchDropdowns])

  // ------------ Form Config ------------
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      pattern: '',
      manufacturer: '',
      origin: '',
      headOffice: '',
      focusCategory: '',
      products: [],
      segment: ''
    }
  })

  // ------------ Submit Handler ------------
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`${API_URL}/admin/add-brand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        toast.success('Brand added successfully!')
        reset()
        router.push('/brands')
      } else {
        toast.error(result.message || 'Failed to add brand.')
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <div className='flex my-2'>
        <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span
            className='cursor-pointer flex items-center justify-center'
            onClick={() => router.push('/product/list-product')}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.97149 18.1108C10.0939 18.2317 10.1921 18.3776 10.2602 18.5396C10.3284 18.7017 10.365 18.8766 10.3679 19.054C10.3709 19.2314 10.3401 19.4076 10.2774 19.5721C10.2148 19.7366 10.1215 19.886 10.0031 20.0115C9.88479 20.1369 9.74383 20.2358 9.58865 20.3023C9.43347 20.3687 9.26726 20.4014 9.09993 20.3982C8.9326 20.3951 8.76758 20.3563 8.61471 20.2841C8.46184 20.2119 8.32426 20.1078 8.21017 19.978L1.56368 12.932C1.3303 12.6843 1.19922 12.3485 1.19922 11.9984C1.19922 11.6483 1.3303 11.3126 1.56368 11.0649L8.21017 4.01892C8.32426 3.88912 8.46184 3.78501 8.61471 3.71281C8.76758 3.6406 8.9326 3.60177 9.09993 3.59864C9.26726 3.59551 9.43347 3.62814 9.58865 3.69459C9.74382 3.76103 9.88479 3.85993 10.0031 3.98538C10.1215 4.11083 10.2148 4.26027 10.2774 4.42477C10.3401 4.58927 10.3709 4.76547 10.3679 4.94285C10.365 5.12024 10.3284 5.29518 10.2602 5.45724C10.1921 5.61929 10.0939 5.76514 9.97149 5.88609L5.45188 10.6773L21.553 10.6773C21.8835 10.6773 22.2005 10.8165 22.4342 11.0643C22.6679 11.312 22.7992 11.6481 22.7992 11.9984C22.7992 12.3488 22.6679 12.6848 22.4342 12.9326C22.2005 13.1804 21.8835 13.3195 21.553 13.3195L5.45188 13.3196L9.97149 18.1108Z'
                fill='#232F6F'
              />
            </svg>
          </span>
          Create Product
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card variant='outlined' sx={{ mt: 4 }}>
          <Typography variant='h6' className='py-4 px-6 border-b'>
            Basic Details
          </Typography>

          <CardContent>
            <Grid container spacing={6}>
              {/* Pattern */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='productType'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={
                            <>
                              Product Type
                              {/* <span style={{ color: 'red' }}>*</span> */}
                            </>
                          }
                          placeholder='Product Type'
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* Size */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='size'
                  control={control}
                  rules={{ required: 'Size is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Size
                          {/* <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Size defines the dimensions of the product.'
                          /> */}
                        </span>
                      }
                      placeholder='Select Size'
                      error={!!errors.size}
                      helperText={errors.size?.message}
                    />
                  )}
                />
              </Grid>
              {/* Brand */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='tyreType'
                  control={control}
                  rules={{ required: 'Tyre Type is required.' }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={
                            <>
                              Tyre Type
                              {/* <span style={{ color: 'red' }}>*</span> */}
                            </>
                          }
                          placeholder='Select tyre specs'
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Origin Country */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='position'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Position' placeholder='Select position' />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* description */}
              <Grid item xs={12}>
                <Grid container spacing={6} alignItems='stretch'>
                  {/* Description */}
                  <Grid item xs={12} sm={6}>
                    <Box display='flex' flexDirection='column' height='100%'>
                      <Controller
                        name='description'
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field: { value, onChange } }) => (
                          <RichTextEditor
                            value={value}
                            onChange={onChange}
                            label='Description'
                            minHeight={240} // match uploader container height
                          />
                        )}
                      />
                      {errors.description && (
                        <Typography color='error' variant='caption'>
                          {errors.description.message}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Media */}
                  <Grid item xs={12} sm={6}>
                    <Box display='flex' flexDirection='column' height='100%'>
                      <Typography variant='subtitle2' sx={{ color: 'text.secondary' }} mb={1}>
                        Media
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        {' '}
                        {/* Ensures matching height */}
                        <Controller
                          name='files'
                          control={control}
                          rules={{ required: 'Please upload at least one file' }}
                          render={({ field: { value, onChange } }) => (
                            <FileUploader value={value} onChange={onChange} maxFiles={2} maxSizeMB={2} />
                          )}
                        />
                      </Box>
                      {errors.files && (
                        <Typography color='error' variant='caption'>
                          {errors.files.message}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Head Office */}
              {/* <Grid item xs={12} sm={6}>
                <Controller
                  name='headOffice'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Head Office' placeholder='Enter head office' />
                  )}
                />
              </Grid> */}

              {/* Focus Category */}
              {/* <Grid item xs={12} sm={6}>
                <Controller
                  name='focusCategory'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={focusCategories}
                      value={focusCategories.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Focus Category' placeholder='Select focus category' />
                      )}
                    />
                  )}
                />
              </Grid> */}

              {/* Products (MULTI SELECT) */}
              {/* <Grid item xs={12} sm={6}>
                <Controller
                  name='products'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      multiple
                      fullWidth
                      options={productList}
                      value={productList.filter(i => value.includes(i.name))}
                      onChange={(e, val) => onChange(val.map(i => i.name))}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Products' placeholder='Select products' />
                      )}
                    />
                  )}
                />
              </Grid> */}

              {/* Segment */}
              {/* <Grid item xs={12} sm={6}>
                <Controller
                  name='segment'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={segments}
                      value={segments.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Segment' placeholder='Select segment' />
                      )}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
        <Card variant='outlined' sx={{ mt: 4 }}>
          <Typography variant='h6' className='py-4 px-6 border-b'>
            Product Details
          </Typography>

          <CardContent>
            <Grid container spacing={6}>
              {/* Pattern */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='pattern'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={
                            <>
                              Pattern <span style={{ color: 'red' }}>*</span>
                            </>
                          }
                          placeholder='Select Pattern'
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {/* Load Index */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='loadIndex'
                  control={control}
                  rules={{ required: 'Load Index is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Load Index
                          <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Load index defines the maximum load a tire can carry.'
                          />
                        </span>
                      }
                      placeholder='e.g 95'
                      error={!!errors.loadIndex}
                      helperText={errors.loadIndex?.message}
                    />
                  )}
                />
              </Grid>
              {/* Brand */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='brand'
                  control={control}
                  rules={{ required: 'Brand is required.' }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={
                            <>
                              Brand <span style={{ color: 'red' }}>*</span>
                            </>
                          }
                          placeholder='Select Brand'
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Supplier */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='supplier'
                  control={control}
                  rules={{ required: 'Supplier is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Supplier
                          <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Select the supplier for this product.'
                          />
                        </span>
                      }
                      placeholder='Select Supplier'
                      error={!!errors.supplier}
                      helperText={errors.supplier?.message}
                    />
                  )}
                />
              </Grid>

              {/* Manufacturer */}
              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='weight'
                  control={control}
                  rules={{ required: 'Weight is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Weight
                          <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Enter the weight of the product in kilograms.'
                          />
                        </span>
                      }
                      placeholder='Enter weight'
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                      inputProps={{
                        min: 0 // optional: prevents negative values
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Origin Country */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='origin'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countryList}
                      value={countryList.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label={
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              Country Origin
                              <i
                                className='tabler-info-circle'
                                style={{
                                  fontSize: 14,
                                  cursor: 'pointer',
                                  color: '#666'
                                }}
                                title='Select the country of origin for this product.'
                              />
                            </span>
                          }
                          placeholder='Select country'
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant='outlined' sx={{ mt: 4 }}>
          <Typography variant='h6' className='py-4 px-6 border-b'>
            FCL Details
          </Typography>

          <CardContent>
            <Grid container spacing={6}>
              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='cbmPerCarton'
                  control={control}
                  rules={{ required: 'CBM per Carton is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label='CBM per Carton'
                      placeholder='Enter CBM '
                      error={!!errors.cbmPerCarton}
                      helperText={errors.cbmPerCarton?.message}
                      inputProps={{
                        min: 0 // optional: prevents negative values
                      }}
                    />
                  )}
                />
              </Grid>
              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='cartonsPerSKU'
                  control={control}
                  rules={{ required: 'Cartons per SKU is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Cartons per SKU
                          <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Enter the number of cartons per SKU.'
                          />
                        </span>
                      }
                      placeholder='Enter cartons per SKU'
                      error={!!errors.cartonsPerSKU}
                      helperText={errors.cartonsPerSKU?.message}
                      inputProps={{
                        min: 0 // optional: prevents negative values
                      }}
                    />
                  )}
                />
              </Grid>
              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='unitsPerCarton'
                  control={control}
                  rules={{ required: 'Units per Carton is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label='Units per Carton*'
                      placeholder='Enter units per carton'
                      error={!!errors.unitsPerCarton}
                      helperText={errors.unitsPerCarton?.message}
                      inputProps={{
                        min: 0 // optional: prevents negative values
                      }}
                    />
                  )}
                />
              </Grid>
              {/* Weight */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='totalWeight'
                  control={control}
                  rules={{ required: 'Total Weight per Carton is required.' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Total Weight per Carton
                          <i
                            className='tabler-info-circle'
                            style={{
                              fontSize: 14,
                              cursor: 'pointer',
                              color: '#666'
                            }}
                            title='Total weight per carton in kilograms.'
                          />
                        </span>
                      }
                      placeholder='Enter weight'
                      error={!!errors.totalWeight}
                      helperText={errors.totalWeight?.message}
                      inputProps={{
                        min: 0 // optional: prevents negative values
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <Grid item xs={12} className='flex justify-end gap-4 mt-6'>
          <Button variant='outlined' onClick={() => reset()}>
            Cancel
          </Button>

          <Button variant='contained' type='submit'>
            Save
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default AddProduct
