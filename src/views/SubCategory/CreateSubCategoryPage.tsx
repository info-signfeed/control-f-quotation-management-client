'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { Grid, Card, CardContent, Button } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import CustomTextField from '@core/components/mui/TextField'

interface FormData {
  subCategoryTitle: string
}

interface SubCategoryProps {
  ansh: string
}

const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function CreateSubCategoryPage({ ansh }: SubCategoryProps) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      subCategoryTitle: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      const token = ansh

      if (!token) {
        toast.error('Unauthorized: No token found. Please login again.')

        return
      }

      const payload = {
        subCategory: data.subCategoryTitle,
        isActive: true
      }

      const res = await fetch(`${API_URL}/sub-category/create-sub-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || 'Failed to create sub category')

        return
      }

      toast.success(result.message || 'Sub category created successfully!')

      setTimeout(() => {
        router.push('/list-sub-category')
      }, 1000)
    } catch (error) {
      console.error('Error creating sub category:', error)
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={2000} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='items-center gap-2 mb-4 flex'>
          <button type='button' className='hover:cursor-pointer' onClick={() => router.back()}>
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
              <Grid item xs={12}>
                <Controller
                  name='subCategoryTitle'
                  control={control}
                  rules={{ required: 'Sub category name is required' }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
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
            <div className='flex justify-end gap-3 mt-6'>
              <Button
                variant='outlined'
                color='inherit'
                onClick={() => router.back()}
                sx={{ width: 100 }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting}
                sx={{ width: 100, color: '#fff', bgcolor: '#1171B2' }}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
}
