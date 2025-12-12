// 'use client'

// import { useState, useEffect } from 'react'

// import { useRouter, useSearchParams } from 'next/navigation'

// import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Grid } from '@mui/material'
// import { CategoryData } from '@/services/category'
// import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
// import { Controller } from 'react-hook-form'

// interface EditCategoryPageProps {
//   token: string
//   categoryData: CategoryData
// }

// const EditCategoryPage: React.FC<EditCategoryPageProps> = ({ token, categoryData }) => {
//   console.log('categoryData: ', categoryData)
//   const router = useRouter()
//   const params = useSearchParams()
//   const categoryId = params.get('id')

//   const [product, setProduct] = useState('')
//   const [categoryName, setCategoryName] = useState('')
//   const [subCategory, setSubCategory] = useState('')
//   const [sizes, setSizes] = useState('')

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const STATIC_CATEGORY = {
//     1: {
//       product: 'Tyres',
//       categoryName: 'PCR (Passenger Car Radial)',
//       subCategory: 'TL (Tubeless)',
//       sizes: '155/70 R13'
//     },
//     2: {
//       product: 'Tyres',
//       categoryName: 'SUV',
//       subCategory: 'TL',
//       sizes: '255/60 R18'
//     }
//   }

//   useEffect(() => {
//     if (!categoryData) return
//     setProduct(categoryData.productTypeName)
//     setCategoryName(categoryData.categoryName)
//     setSubCategory(categoryData.subCategoryName)
//     setSizes(categoryData.sizes)
//   }, [categoryData])
//   const handleSave = () => {
//     console.log('Updated Category:', {
//       id: categoryId,
//       product,
//       categoryName,
//       subCategory,
//       sizes
//     })

//     router.push('/listcategory')
//   }

//   return (
//     <div className='bg-white shadow rounded-xl p-6 w-full'>
//       <div className='flex items-center gap-3 mb-5'>
//         <button onClick={() => router.back()} className='p-1'>
//           <svg
//             xmlns='http://www.w3.org/2000/svg'
//             width='22'
//             height='22'
//             viewBox='0 0 24 24'
//             fill='none'
//             stroke='currentColor'
//             strokeWidth='2'
//             strokeLinecap='round'
//             strokeLinejoin='round'
//             className='text-[#1e2a55]'
//           >
//             <path d='M5 12h14' />
//             <path d='M5 12l6 6' />
//             <path d='M5 12l6 -6' />
//           </svg>
//         </button>
//         <h2 className='text-xl font-semibold text-[#1e2a55]'>Edit Category</h2>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid item xs={12} sm={6}>
//           <Controller
//             name='userRole'
//             control={control}
//             rules={{ required: 'This field is required.' }}
//             render={({ field: { value, onChange } }) => {
//               // Find the selected object by ID for Autocomplete display
//               const selectedRole = rolelist?.find(role => role?.id === value) || null

//               return (
//                 <CustomAutocomplete
//                   fullWidth
//                   options={rolelist}
//                   id='autocomplete-controlled'
//                   value={selectedRole}
//                   onChange={(e: any, newValue: any) => {
//                     onChange(newValue ? newValue.id : null)
//                   }}
//                   isOptionEqualToValue={(option, val) => option.id === val.id}
//                   getOptionLabel={(option: any) =>
//                     option.roleName
//                       ? option.roleName.charAt(0).toUpperCase() + option.roleName.slice(1).toLowerCase()
//                       : ''
//                   }
//                   renderTags={tagValue => <span>{tagValue.length} selected</span>}
//                   renderInput={params => (
//                     <CustomTextField
//                       {...params}
//                       placeholder='Select Role'
//                       label='Role*'
//                       error={!!errors.userRole}
//                       helperText={errors.userRole ? errors.userRole.message : ''}
//                     />
//                   )}
//                 />
//               )
//             }}
//           />
//         </Grid>
//         <TextField label='Category' fullWidth value={categoryName} onChange={e => setCategoryName(e.target.value)} />
//         <FormControl fullWidth>
//           <InputLabel>Sub-category</InputLabel>
//           <Select label='Sub-category' value={subCategory} onChange={e => setSubCategory(e.target.value)}>
//             <MenuItem value='TL (Tubeless)'>TL (Tubeless)</MenuItem>
//             <MenuItem value='TT (Tube Type)'>TT (Tube Type)</MenuItem>
//             <MenuItem value='Radial'>Radial</MenuItem>
//           </Select>
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Sizes</InputLabel>
//           <Select label='Sizes' value={sizes} onChange={e => setSizes(e.target.value)}>
//             <MenuItem value='145/70 R12'>145/70 R12</MenuItem>
//             <MenuItem value='155/70 R13'>155/70 R13</MenuItem>
//             <MenuItem value='165/65 R14'>165/65 R14</MenuItem>
//             <MenuItem value='255/60 R18'>255/60 R18</MenuItem>
//           </Select>
//         </FormControl>
//       </form>
//       <div className='flex justify-end gap-3 mt-6'>
//         <Button
//           variant='outlined'
//           sx={{
//             color: '#63688B',
//             borderColor: '#63688B',
//             '&:hover': { borderColor: '#63688B', background: 'transparent' }
//           }}
//           onClick={() => router.push('/listcategory')}
//         >
//           Cancel
//         </Button>
//         <Button variant='contained' sx={{ backgroundColor: '#1171B2' }} onClick={handleSave}>
//           Save
//         </Button>
//       </div>
//     </div>
//   )
// }
// export default EditCategoryPage

'use client'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { CategoryData } from '@/services/category'
import { ProductData } from '@/services/product'
import { SubCategoryData } from '@/services/sub-category'
// import BackArrowIcon from '@/icons/BackArrowIcon'
// import type { StationType } from '@/types/StationType'
import { User } from '@/types/userType'
import { Box, Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

export type FormValues = {
  productType: number
  categoryName: string
  subCategory: number
  sizes: string[]
}

interface EditCategoryPageProps {
  token: string
  categoryData?: CategoryData
}

const EditCategoryPage: React.FC<EditCategoryPageProps> = ({ token, categoryData }) => {
  console.log('categoryData: ', categoryData)
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const [productList, setProductList] = useState<ProductData[]>([])
  console.log('productList: ', productList)
  const [subCategoryList, setSubCategoryList] = useState<SubCategoryData[]>([])
  const [sizeList, setSizeList] = useState<{ id: number; size: string }[]>([
    {
      id: 1,
      size: '145/70 R12'
    },
    {
      id: 2,
      size: '155/70 R13'
    },
    {
      id: 3,
      size: '165/65 R14'
    }
  ])
  // const [stations, setStations] = useState<StationType[]>([])

  const {
    control,
    reset,
    setValue,
    handleSubmit,

    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      productType: categoryData?.productType,
      categoryName: categoryData?.categoryName,
      subCategory: categoryData?.subCategory,
      sizes: categoryData?.sizes || []
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

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        id: Number(params.id),
        productType: Number(data.productType),
        categoryName: data.categoryName,
        subCategory: Number(data.subCategory),
        sizes: data.sizes
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/update-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const res = await response.json()

      if (!response.ok) {
        toast.error(res.message || 'Failed to update category')
        return
      }

      toast.success('Category updated successfully!')
      router.push('/listcategory')
      router.refresh()
    } catch (error) {
      console.error('Submit Error:', error)
      toast.error('Something went wrong!')
    }
  }
  return (
    <>
      <div className='flex mb-5'>
        {/* <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <IconButton className='cursor-pointer' onClick={() => router.back()}>
            <BackArrowIcon />
          </IconButton>
          {userData ? 'Update User' : ' Create User'}
        </h1> */}

        <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span className='cursor-pointer flex items-center justify-center' onClick={() => router.push('/users')}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.97149 18.1108C10.0939 18.2317 10.1921 18.3776 10.2602 18.5396C10.3284 18.7017 10.365 18.8766 10.3679 19.054C10.3709 19.2314 10.3401 19.4076 10.2774 19.5721C10.2148 19.7366 10.1215 19.886 10.0031 20.0115C9.88479 20.1369 9.74383 20.2358 9.58865 20.3023C9.43347 20.3687 9.26726 20.4014 9.09993 20.3982C8.9326 20.3951 8.76758 20.3563 8.61471 20.2841C8.46184 20.2119 8.32426 20.1078 8.21017 19.978L1.56368 12.932C1.3303 12.6843 1.19922 12.3485 1.19922 11.9984C1.19922 11.6483 1.3303 11.3126 1.56368 11.0649L8.21017 4.01892C8.32426 3.88912 8.46184 3.78501 8.61471 3.71281C8.76758 3.6406 8.9326 3.60177 9.09993 3.59864C9.26726 3.59551 9.43347 3.62814 9.58865 3.69459C9.74382 3.76103 9.88479 3.85993 10.0031 3.98538C10.1215 4.11083 10.2148 4.26027 10.2774 4.42477C10.3401 4.58927 10.3709 4.76547 10.3679 4.94285C10.365 5.12024 10.3284 5.29518 10.2602 5.45724C10.1921 5.61929 10.0939 5.76514 9.97149 5.88609L5.45188 10.6773L21.553 10.6773C21.8835 10.6773 22.2005 10.8165 22.4342 11.0643C22.6679 11.312 22.7992 11.6481 22.7992 11.9984C22.7992 12.3488 22.6679 12.6848 22.4342 12.9326C22.2005 13.1804 21.8835 13.3195 21.553 13.3195L5.45188 13.3196L9.97149 18.1108Z'
                fill='#232F6F'
              />
            </svg>
          </span>
          {categoryData ? ' Update Category' : ' Create Category'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className='border border-gray-300 rounded-md bg-white p-4'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='productType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        fullWidth
                        options={productList}
                        id='autocomplete-controlled'
                        value={productList.find(p => Number(p.id) === Number(value)) || null}
                        onChange={(e: any, newValue: any) => {
                          onChange(newValue ? newValue.id : '') // store productId
                        }}
                        isOptionEqualToValue={(option, val) => option.productType === val?.productType}
                        getOptionLabel={(option: any) => option.productType || ''}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            placeholder='Select Product Type'
                            label='Product Type*'
                            error={!!errors.productType}
                            helperText={errors.productType ? 'This field is required.' : ''}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='categoryName'
                    control={control}
                    rules={{
                      required: 'This field is required.'
                      // validate: value => value.trim() !== '' || 'This field is required.'
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Category Name*'
                        placeholder='Enter Category Name'
                        error={!!errors.categoryName}
                        helperText={errors.categoryName ? errors.categoryName.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='subCategory'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        fullWidth
                        options={subCategoryList}
                        id='autocomplete-controlled'
                        value={subCategoryList.find(p => Number(p.id) === Number(value)) || null}
                        onChange={(e: any, newValue: any) => {
                          onChange(newValue ? newValue.id : '') // store subCategoryId
                        }}
                        isOptionEqualToValue={(option, val) => option.subCategory === val?.subCategory}
                        getOptionLabel={o => o.subCategory}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            placeholder='Select Sub Category'
                            label='Sub Category*'
                            error={!!errors.subCategory}
                            helperText={errors.subCategory ? 'This field is required.' : ''}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='sizes'
                    control={control}
                    rules={{ required: 'Sizes are required.' }}
                    render={({ field: { value = [], onChange } }) => {
                      // Convert string[] → option objects for Autocomplete value
                      const selectedSizes = sizeList.filter(sizeObj => value.includes(sizeObj.size)) || []

                      return (
                        <CustomAutocomplete
                          fullWidth
                          multiple
                          options={sizeList}
                          id='sizes-multi-select'
                          value={selectedSizes}
                          onChange={(e, newValue) => {
                            // Store only the "size" string values
                            const selected = newValue.map(v => v.size)
                            onChange(selected)
                          }}
                          isOptionEqualToValue={(option, val) => option.id === val.id}
                          getOptionLabel={option => option.size}
                          renderTags={tagValue => <span>{tagValue.map(t => t.size).join(', ')}</span>}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              placeholder='Select Sizes'
                              label='Sizes*'
                              error={!!errors.sizes}
                              helperText={errors.sizes?.message}
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} className='flex justify-end gap-4  mt-6'>
            <Button variant='tonal' color='secondary' type='reset' onClick={() => reset()} sx={{ minWidth: 120 }}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ minWidth: 120 }}>
              {categoryData ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default EditCategoryPage
