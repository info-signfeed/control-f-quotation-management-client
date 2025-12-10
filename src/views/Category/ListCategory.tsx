'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { FiMoreVertical } from 'react-icons/fi'

import { IconButton, Menu, MenuItem } from '@mui/material'

export default function CategoryTable() {
  const router = useRouter()

  const [data, setData] = useState([
    {
      id: 1,
      product: 'Tyres',
      category: 'PCR (Passenger Car Radial)',
      sub: 'TL (Tubeless)',
      sizes: '145/70 R12, 155/70 R13, 165/65 R14...',
      hidden: false
    },
    {
      id: 2,
      product: 'Tyres',
      category: 'SUV',
      sub: 'TL',
      sizes: '215/65 R16, 255/60 R18...',
      hidden: false
    }
  ])

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleHide = (id: number) => {
    setData(prev => prev.map(row => (row.id === id ? { ...row, hidden: !row.hidden } : row)))
  }

  const handleDelete = () => {
    if (deleteId === null) return
    setData(prev => prev.filter(row => row.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold text-[#1e2a55]'>Category Master</h2>
        <div className='flex items-center gap-3'>
          <button className='flex gap-2 px-4 py-2 rounded-lg border border-[#010A1D] text-[#010A1D] text-sm font-medium bg-white'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
              className='icon icon-tabler icons-tabler-outline icon-tabler-upload'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2' />
              <path d='M7 9l5 -5l5 5' />
              <path d='M12 4l0 12' />
            </svg>
            <p>Export</p>
          </button>
          <button
            onClick={() => router.push('/createcategory')}
            className='px-4 py-2 rounded-lg bg-[#010A1D] text-white font-medium text-sm border border-[#010A1D]'
          >
            + Create Category
          </button>
        </div>
      </div>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-[#ffffff] text-[#232F6F] text-base border-b font-medium'>
            <th className='p-3 text-left'>Product</th>
            <th className='p-3 text-left'>Category</th>
            <th className='p-3 text-left'>Sub-category</th>
            <th className='p-3 text-left'>Sizes</th>
            <th className='p-3 text-left w-20'>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <TableRowItem key={row.id} row={row} router={router} onHide={handleHide} onDelete={setDeleteId} />
          ))}
        </tbody>
      </table>
      {deleteId !== null && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center shadow-sm z-50'>
          <div className='bg-white rounded-2xl p-6 w-80 text-center shadow-lg'>
            <h3 className='text-2xl font-bold text-[#ED3401]'>Delete</h3>
            <p className='mt-2 text-base font-medium leading-tight text-[#2F2F2F] px-2'>
              Are you sure you want to delete the Product?
            </p>
            <div className='flex justify-center gap-3 mt-6'>
              <button
                className='bg-white px-5 py-2 rounded-full border border-[#141414] hover:cursor-pointer'
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className='px-8 py-2 rounded-full border border-[#ED3401] bg-[#ED3401] text-white hover:cursor-pointer'
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// @ts-ignore
function TableRowItem({ row, router, onHide, onDelete }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <tr className={`border-b text-sm ${row.hidden ? 'bg-gray-200 opacity-60' : 'bg-white'}`}>
      <td className='p-3 text-[#1e2a55]'>{row.product}</td>
      <td className='p-3 text-[#1e2a55]'>{row.category}</td>
      <td className='p-3 text-[#1e2a55]'>{row.sub}</td>
      <td className='p-3 text-[#1e2a55]'>{row.sizes}</td>
      <td className='p-3'>
        <IconButton onClick={handleMenuClick}>
          <FiMoreVertical className='text-lg' />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                router.push(`editcategory/${row.id}`)
                handleClose()
              }}
            >
              <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z'
                  fill='#232F6F'
                />
              </svg>
              <p className='ml-2'>Edit Category</p>
            </MenuItem>
          </div>
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                onHide(row.id)
                handleClose()
              }}
            >
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M5.22853 3.62504C5.76795 3.08561 6.03767 2.81496 6.38111 2.67311C6.72455 2.53125 7.10533 2.53125 7.86874 2.53125H12.1711C12.942 2.53125 13.3274 2.53125 13.6737 2.67591C14.019 2.82056 14.2896 3.09588 14.83 3.64371L16.3923 5.22933C16.9224 5.76689 17.1874 6.03661 17.3274 6.37725C17.4665 6.71696 17.4665 7.094 17.4665 7.84995V12.184C17.4665 12.9475 17.4665 13.3282 17.3246 13.6717C17.1828 14.0151 16.913 14.2839 16.3727 14.8243L14.8272 16.3698C14.2868 16.9101 14.018 17.1789 13.6746 17.3217C13.3312 17.4635 12.9504 17.4635 12.187 17.4635H7.85381C7.09786 17.4635 6.72082 17.4635 6.38018 17.3236C6.04047 17.1845 5.77075 16.9194 5.23319 16.3894L3.64757 14.8271C3.09881 14.2858 2.82443 14.0151 2.67977 13.6698C2.53511 13.3245 2.53418 12.9391 2.53418 12.1682V7.86581C2.53418 7.1024 2.53418 6.72162 2.67604 6.37818C2.81789 6.03474 3.08854 5.76502 3.62797 5.2256L5.22853 3.62504Z'
                  stroke='#232F6F'
                />
                <path
                  d='M6.26758 9.0625L6.66142 9.25942C7.6982 9.77787 8.84147 10.0478 10.0007 10.0478C11.1598 10.0478 12.3031 9.77787 13.3399 9.25942L13.7337 9.0625M10.0007 10.4624V11.8623M7.20085 9.99577L6.73421 10.929M12.8005 9.99577L13.2671 10.929'
                  stroke='#232F6F'
                  stroke-linecap='round'
                />
              </svg>
              <p className='ml-2'>{row.hidden ? 'Unhide' : 'Hide'} Category</p>
            </MenuItem>
          </div>
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              sx={{ color: 'red' }}
              onClick={() => {
                onDelete(row.id)
                handleClose()
              }}
            >
              <svg width='13' height='15' viewBox='0 0 13 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M4.35903 2.75307V1.37653H8.48863V2.75307H4.35903ZM2.98249 2.75307V0.91769C2.98249 0.674303 3.07918 0.440885 3.25128 0.268785C3.42338 0.0966849 3.6568 0 3.90018 0L8.94748 0C9.19086 0 9.42428 0.0966849 9.59638 0.268785C9.76848 0.440885 9.86516 0.674303 9.86516 0.91769V2.75307H12.1594C12.3419 2.75307 12.517 2.82558 12.6461 2.95466C12.7751 3.08373 12.8477 3.2588 12.8477 3.44134C12.8477 3.62388 12.7751 3.79894 12.6461 3.92801C12.517 4.05709 12.3419 4.1296 12.1594 4.1296H11.8244L11.1426 12.9881C11.1072 13.4492 10.8991 13.8799 10.5598 14.1941C10.2206 14.5084 9.77516 14.683 9.31272 14.683H3.53494C3.0725 14.683 2.62711 14.5084 2.28784 14.1941C1.94858 13.8799 1.74044 13.4492 1.70507 12.9881L1.02322 4.1296H0.688267C0.505727 4.1296 0.330664 4.05709 0.201589 3.92801C0.0725137 3.79894 0 3.62388 0 3.44134C0 3.2588 0.0725137 3.08373 0.201589 2.95466C0.330664 2.82558 0.505727 2.75307 0.688267 2.75307H2.98249ZM2.40435 4.1296H10.4433L9.76972 12.8825C9.76094 12.9978 9.709 13.1054 9.62427 13.184C9.53955 13.2626 9.42828 13.3064 9.31272 13.3065H3.53494C3.41937 13.3064 3.30811 13.2626 3.22338 13.184C3.13866 13.1054 3.08671 12.9978 3.07793 12.8825L2.40435 4.1296Z'
                  fill='#232F6F'
                />
              </svg>
              <p className='ml-2'>Remove Category</p>
            </MenuItem>
          </div>
        </Menu>
      </td>
    </tr>
  )
}
