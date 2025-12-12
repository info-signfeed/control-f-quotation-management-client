'use client'

import React, { useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Grid, Card, CardContent, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

import 'react-toastify/dist/ReactToastify.css'

interface EditSubCategoryProps {
  ansh: string
}

const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function EditSubCategoryPage({ ansh }: EditSubCategoryProps) {
  const router = useRouter()
  const params = useParams()
  const subCategoryId = params?.id

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subCategoryTitle: ''
    }
  })

  useEffect(() => {
    const fetchSubCategory = async () => {
      if (!subCategoryId) return

      try {
        const res = await fetch(`${API_URL}/sub-category/sub-category-list?status=active`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${ansh}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await res.json()

        if (result.status === 200 && result.data) {
          const subCat = result.data.find((item: any) => item.id === Number(subCategoryId))

          if (subCat) {
            setValue('subCategoryTitle', subCat.subCategory)
          }
        } else {
          toast.error('Failed to fetch sub category data')
        }
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong')
      }
    }

    fetchSubCategory()
  }, [subCategoryId, setValue, ansh])

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        id: Number(subCategoryId),
        subCategory: data.subCategoryTitle,
        isActive: true
      }

      const res = await fetch(`${API_URL}/sub-category/update-sub-category`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ansh}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success('Sub category updated successfully!')
        setTimeout(() => router.push('/list-sub-category'), 1000)
      } else {
        toast.error(result.message || 'Failed to update sub category')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className='items-center gap-2 mb-4 flex'>
          <button className='hover:cursor-pointer' onClick={() => router.back()}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.97149 18.1108C10.0939 18.2317 10.1921 18.3776 10.2602 18.5396C10.3284 18.7017 10.365 18.8766 10.3679 19.054C10.3709 19.2314 10.3401 19.4076 10.2774 19.5721C10.2148 19.7366 10.1215 19.886 10.0031 20.0115C9.88479 20.1369 9.74383 20.2358 9.58865 20.3023C9.43347 20.3687 9.26726 20.4014 9.09993 20.3982C8.9326 20.3951 8.76758 20.3563 8.61471 20.2841C8.46184 20.2119 8.32426 20.1078 8.21017 19.978L1.56368 12.932C1.3303 12.6843 1.19922 12.3485 1.19922 11.9984C1.19922 11.6483 1.3303 11.3126 1.56368 11.0649L8.21017 4.01892C8.32426 3.88912 8.46184 3.78501 8.61471 3.71281C8.76758 3.6406 8.9326 3.60177 9.09993 3.59864C9.26726 3.59551 9.43347 3.62814 9.58865 3.69459C9.74382 3.76103 9.88479 3.85993 10.0031 3.98538C10.1215 4.11083 10.2148 4.26027 10.2774 4.42477C10.3401 4.58927 10.3709 4.76547 10.3679 4.94285C10.365 5.12024 10.3284 5.29518 10.2602 5.45724C10.1921 5.61929 10.0939 5.76514 9.97149 5.88609L5.45188 10.6773L21.553 10.6773C21.8835 10.6773 22.2005 10.8165 22.4342 11.0643C22.6679 11.312 22.7992 11.6481 22.7992 11.9984C22.7992 12.3488 22.6679 12.6848 22.4342 12.9326C22.2005 13.1804 21.8835 13.3195 21.553 13.3195L5.45188 13.3196L9.97149 18.1108Z'
                fill='#232F6F'
              />
            </svg>
          </button>
          <p className='font-medium text-lg'>Edit Sub Category</p>
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
                          Sub category title <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      placeholder='Sub category name'
                    />
                  )}
                />
              </Grid>
            </Grid>

            <div className='flex justify-end gap-3 mt-6'>
              <Button variant='outlined' onClick={() => router.back()} sx={{ width: 100 }}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' sx={{ width: 100, bgcolor: '#1171B2', color: '#fff' }}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
}
