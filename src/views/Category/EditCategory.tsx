'use client'

import { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { TextField, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useSearchParams()
  const categoryId = params.get('id')

  const [product, setProduct] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [sizes, setSizes] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const STATIC_CATEGORY = {
    1: {
      product: 'Tyres',
      categoryName: 'PCR (Passenger Car Radial)',
      subCategory: 'TL (Tubeless)',
      sizes: '155/70 R13'
    },
    2: {
      product: 'Tyres',
      categoryName: 'SUV',
      subCategory: 'TL',
      sizes: '255/60 R18'
    }
  }

  useEffect(() => {
    if (!categoryId) return

    // @ts-ignore
    const selected: any = STATIC_CATEGORY[categoryId] || {
      product: '',
      categoryName: '',
      subCategory: '',
      sizes: ''
    }

    setProduct(selected.product)
    setCategoryName(selected.categoryName)
    setSubCategory(selected.subCategory)
    setSizes(selected.sizes)
  }, [STATIC_CATEGORY, categoryId])

  const handleSave = () => {
    console.log('Updated Category:', {
      id: categoryId,
      product,
      categoryName,
      subCategory,
      sizes
    })

    router.push('/listcategory')
  }

  return (
    <div className='bg-white shadow rounded-xl p-6 w-full'>
      <div className='flex items-center gap-3 mb-5'>
        <button onClick={() => router.back()} className='p-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-[#1e2a55]'
          >
            <path d='M5 12h14' />
            <path d='M5 12l6 6' />
            <path d='M5 12l6 -6' />
          </svg>
        </button>
        <h2 className='text-xl font-semibold text-[#1e2a55]'>Edit Category</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormControl fullWidth>
          <InputLabel>Product</InputLabel>
          <Select label='Product' value={product} onChange={e => setProduct(e.target.value)}>
            <MenuItem value='Tyres'>Tyres</MenuItem>
            <MenuItem value='Tubes'>Tubes</MenuItem>
            <MenuItem value='Flaps'>Flaps</MenuItem>
          </Select>
        </FormControl>
        <TextField label='Category' fullWidth value={categoryName} onChange={e => setCategoryName(e.target.value)} />
        <FormControl fullWidth>
          <InputLabel>Sub-category</InputLabel>
          <Select label='Sub-category' value={subCategory} onChange={e => setSubCategory(e.target.value)}>
            <MenuItem value='TL (Tubeless)'>TL (Tubeless)</MenuItem>
            <MenuItem value='TT (Tube Type)'>TT (Tube Type)</MenuItem>
            <MenuItem value='Radial'>Radial</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Sizes</InputLabel>
          <Select label='Sizes' value={sizes} onChange={e => setSizes(e.target.value)}>
            <MenuItem value='145/70 R12'>145/70 R12</MenuItem>
            <MenuItem value='155/70 R13'>155/70 R13</MenuItem>
            <MenuItem value='165/65 R14'>165/65 R14</MenuItem>
            <MenuItem value='255/60 R18'>255/60 R18</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='flex justify-end gap-3 mt-6'>
        <Button
          variant='outlined'
          sx={{
            color: '#63688B',
            borderColor: '#63688B',
            '&:hover': { borderColor: '#63688B', background: 'transparent' }
          }}
          onClick={() => router.push('/listcategory')}
        >
          Cancel
        </Button>
        <Button variant='contained' sx={{ backgroundColor: '#1171B2' }} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
