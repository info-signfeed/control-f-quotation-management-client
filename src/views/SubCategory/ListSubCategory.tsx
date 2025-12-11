'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { FiMoreVertical } from 'react-icons/fi'

import { IconButton, Menu, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

export default function SubCategoryTable() {
  const router = useRouter()

  const [data, setData] = useState([
    { id: 1, name: 'Noodles', hidden: false },
    { id: 2, name: 'Pizza', hidden: false },
    { id: 3, name: 'Burgers', hidden: false },
    { id: 4, name: 'Naan', hidden: false },
    { id: 5, name: 'Fried Rice', hidden: false },
    { id: 6, name: 'Laddoo', hidden: false }
  ])

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleHide = (id: number) => {
    setData(prev => prev.map(item => (item.id === id ? { ...item, hidden: !item.hidden } : item)))

    toast.success('Sub category updated!')
  }

  const handleDelete = () => {
    if (deleteId === null) return

    setData(prev => prev.filter(item => item.id !== deleteId))
    toast.error('Sub category removed!')
    setDeleteId(null)
  }

  return (
    <div className='w-full'>
      {/* Top Section */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-[#1E2A55]'>Sub Category</h2>

        <div className='flex gap-3'>
          <button className='flex gap-2 px-4 py-2 border rounded-lg font-medium'>
            <svg width='13' height='12' viewBox='0 0 15 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M7.26938 5.40412L6.61091 4.74565L7.26938 4.08718L7.92785 4.74565L7.26938 5.40412ZM1.9541 9.40246L6.61091 4.74565L7.92785 6.0626L3.27105 10.7194L1.9541 9.40246ZM7.92785 4.74565L12.5847 9.40246L11.2677 10.7194L6.61091 6.0626L7.92785 4.74565ZM8.20074 5.40412V13.7864H6.33802V5.40412H8.20074Z'
                fill='#010A1D'
              />
              <path
                d='M0.75 3.54419V2.61283C0.75 2.1188 0.946251 1.64501 1.29558 1.29568C1.64491 0.946356 2.1187 0.750105 2.61272 0.750105H11.9263C12.4204 0.750105 12.8942 0.946356 13.2435 1.29568C13.5928 1.64501 13.7891 2.1188 13.7891 2.61283V3.54419'
                stroke='#010A1D'
                stroke-width='1.5'
              />
            </svg>
            Export Report
          </button>

          <button
            onClick={() => router.push('/create-sub-category')}
            className='px-4 py-2 rounded-lg bg-[#010A1D] text-white text-sm font-medium'
          >
            + Create Sub Category
          </button>
        </div>
      </div>

      {/* Table */}
      <table className='w-full border rounded-xl overflow-hidden'>
        <thead className='px-5'>
          <tr className='bg-white text-[#464A5F] border-b font-semibold text-base'>
            <th className='py-2 px-4 text-left'>Subcategory</th>
            <th className='py-2 px-4 text-right'>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map(row => (
            <SubRow key={row.id} row={row} router={router} onHide={handleHide} onDelete={setDeleteId} />
          ))}
        </tbody>
      </table>
      {deleteId !== null && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-80 text-center'>
            <h3 className='text-2xl font-bold text-red-600'>Delete</h3>
            <p className='mt-2 text-sm font-medium text-gray-700'>Are you sure you want to delete the Sub Category?</p>
            <div className='flex justify-center gap-3 mt-6'>
              <button className='bg-white px-5 py-2 rounded-full border' onClick={() => setDeleteId(null)}>
                Cancel
              </button>

              <button className='bg-red-600 text-white px-8 py-2 rounded-full' onClick={handleDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------- ROW COMPONENT -------------------------- */

function SubRow({ row, router, onHide, onDelete }: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <tr className={`border-b ${row.hidden ? 'bg-gray-200 opacity-60' : 'bg-white'}`}>
      <td className='py-2 px-4 font-medium text-base text-[#464A5F]'>{row.name}</td>

      <td className='py-2 px-4 text-right'>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <FiMoreVertical />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {/* Edit */}
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                toast.info('Redirecting to Edit...')
                router.push(`/edit-sub-category/${row.id}`)
                setAnchorEl(null)
              }}
            >
              <svg width='14' height='14' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z'
                  fill='#232F6F'
                />
              </svg>
              <p className='ml-2'>Edit sub-category</p>
            </MenuItem>
          </div>

          {/* Hide */}
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                onHide(row.id)
                setAnchorEl(null)
              }}
            >
              <svg width='16' height='16' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              <p className='ml-2'> {row.hidden ? 'Unhide' : 'Hide'} sub-category </p>
            </MenuItem>
          </div>

          {/* Remove */}
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              sx={{ color: 'red' }}
              onClick={() => {
                onDelete(row.id)
                setAnchorEl(null)
              }}
            >
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M7.9352 5.40932V4.03278H12.0648V5.40932H7.9352ZM6.55866 5.40932V3.57394C6.55866 3.33055 6.65535 3.09714 6.82745 2.92504C6.99955 2.75293 7.23297 2.65625 7.47635 2.65625H12.5236C12.767 2.65625 13.0005 2.75293 13.1726 2.92504C13.3447 3.09714 13.4413 3.33055 13.4413 3.57394V5.40932H15.7356C15.9181 5.40932 16.0932 5.48183 16.2222 5.61091C16.3513 5.73998 16.4238 5.91505 16.4238 6.09759C16.4238 6.28013 16.3513 6.45519 16.2222 6.58426C16.0932 6.71334 15.9181 6.78585 15.7356 6.78585H15.4006L14.7188 15.6443C14.6834 16.1054 14.4753 16.5361 14.136 16.8504C13.7967 17.1647 13.3513 17.3393 12.8889 17.3393H7.11111C6.64867 17.3393 6.20328 17.1647 5.86401 16.8504C5.52475 16.5361 5.31662 16.1054 5.28124 15.6443L4.5994 6.78585H4.26444C4.0819 6.78585 3.90684 6.71334 3.77776 6.58426C3.64869 6.45519 3.57617 6.28013 3.57617 6.09759C3.57617 5.91505 3.64869 5.73998 3.77776 5.61091C3.90684 5.48183 4.0819 5.40932 4.26444 5.40932H6.55866ZM5.98052 6.78585H14.0195L13.3459 15.5388C13.3371 15.654 13.2852 15.7617 13.2004 15.8403C13.1157 15.9189 13.0045 15.9626 12.8889 15.9628H7.11111C6.99554 15.9626 6.88428 15.9189 6.79956 15.8403C6.71483 15.7617 6.66289 15.654 6.6541 15.5388L5.98052 6.78585Z'
                  fill='#232F6F'
                />
              </svg>
              <p className='ml-2'> Remove sub-category</p>
            </MenuItem>
          </div>
        </Menu>
      </td>
    </tr>
  )
}
