'use client'

import React, { useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Grid, Card, CardContent, Button } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'

export default function EditSubCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const subCategoryId = params?.id

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subCategoryTitle: ''
    }
  })

  // PREFILL DATA (Replace with API call)
  useEffect(() => {
    // TODO: API call -> fetch subcategory by ID
    // const response = await axios.get(`/admin/get-subcategory/${subCategoryId}`)

    // TEMP DATA - replace with actual API data
    const existingData = {
      subCategoryTitle: 'Pizza' // Example
    }

    setValue('subCategoryTitle', existingData.subCategoryTitle)
  }, [setValue, subCategoryId])

  const onSubmit = async (data: any) => {
    try {
      console.log('Updated Sub Category:', data)

      // TODO: Call update API here
      // await axios.put(`/admin/update-subcategory/${subCategoryId}`, data);

      router.push('/list-sub-category')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
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

        <p className='font-medium text-lg'>Edit Sub Category</p>
      </div>

      {/* Card */}
      <Card variant='outlined'>
        <h3 className='text-lg font-semibold mt-3 ml-4'>Sub Category details</h3>
        <div className='border border-[#F1F1F7] mt-2'></div>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Controller
                name='subCategoryTitle'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={
                      <>
                        Sub category title
                        <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                    placeholder='Sub category name'
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <div className='flex justify-end gap-3 mt-6'>
            <Button variant='outlined' color='inherit' onClick={() => router.back()} sx={{ width: 100 }}>
              Cancel
            </Button>

            <Button type='submit' variant='contained' sx={{ width: 100, color: '#fff', bgcolor: '#1171B2' }}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
