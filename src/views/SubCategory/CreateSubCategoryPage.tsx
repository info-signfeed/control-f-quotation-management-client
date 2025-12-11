'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { Grid, Card, CardContent, Button } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'

export default function CreateSubCategoryPage() {
  const router = useRouter()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      subCategoryTitle: ''
    }
  })

  const onSubmit = async (data: any) => {
    try {
      console.log('Create Sub Category Data:', data)

      // TODO: Call your API here
      // await axios.post("/admin/create-subcategory", data);

      router.push('/list-sub-category')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <p className='font-medium text-lg'>Sub Category</p>
      </div>
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
                        Sub category title<span style={{ color: 'red' }}>*</span>
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
