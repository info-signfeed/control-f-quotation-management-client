'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { FiMoreVertical } from 'react-icons/fi'

import { IconButton, Menu, MenuItem } from '@mui/material'

import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

interface ListSubCategoryProps {
  ansh: string
}

const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export function SubCategoryTable({ ansh }: ListSubCategoryProps) {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchSubCategories()
  }, [ansh, API_URL])

  const fetchSubCategories = async () => {
    try {
      const token = ansh

      if (!token) {
        toast.error('Unauthorized: No token found')
        setLoading(false)

        return
      }

      const res = await fetch(`${API_URL}/sub-category/sub-category-list?status=all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 401) {
        toast.error('Unauthorized! Please login again.')
        setLoading(false)

        return
      }

      const result = await res.json()

      if (result.status === 200) {
        setData(
          result.data.map((item: any) => ({
            id: item.id,
            name: item.subCategory,
            hidden: !item.isActive
          }))
        )
      } else {
        toast.error('Failed to fetch sub-categories')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleHide = async (id: number, currentHidden: boolean, name: string) => {
    setData(prev => prev.map(item => (item.id === id ? { ...item, hidden: !currentHidden } : item)))

    try {
      const payload = {
        id: id,
        subCategory: name,
        isActive: currentHidden
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
        toast.success(currentHidden ? 'Sub category unhidden!' : 'Sub category hidden!')
      } else {
        toast.error(result.message || 'Failed to update')
        await fetchSubCategories()
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong!')
      await fetchSubCategories()
    }
  }

  const deleteSubCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/sub-category/delete-sub-category?id=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ansh}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await res.json()

      if (result.status === 200) {
        toast.success('Sub category deleted successfully!')
        await fetchSubCategories()
      } else {
        toast.error(result.message || 'Failed to delete sub category')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='w-full p-4'>
      <ToastContainer />
      {/* Top Section */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-[#1E2A55]'>Sub Category</h2>
        <div className='flex gap-3'>
          <button className='flex gap-2 px-4 py-2 border rounded-lg font-medium'>Export Report</button>
          <button
            onClick={() => router.push('/create-sub-category')}
            className='px-4 py-2 rounded-lg bg-[#010A1D] text-white text-sm font-medium'
          >
            + Create Sub Category
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className='flex justify-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-600'></div>
        </div>
      ) : (
        <table className='w-full border rounded-xl overflow-hidden'>
          <thead className='bg-white text-[#464A5F] border-b font-semibold text-base'>
            <tr>
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-80 text-center'>
            <h3 className='text-2xl font-bold text-red-600'>Delete</h3>
            <p className='mt-2 text-base font-medium text-[#2F2F2F]'>
              Are you sure you want to delete the Sub Category?
            </p>

            <div className='flex justify-center gap-3 mt-6'>
              <button
                className='bg-white hover:cursor-pointer px-5 py-2 rounded-full border border-[#2F2F2F]'
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteSubCategory(deleteId)
                  setDeleteId(null)
                }}
                className='bg-red-600 text-white hover:cursor-pointer px-5 py-2 rounded-full'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                toast.info('Redirecting to Edit...')
                router.push(`/edit-sub-category/${row.id}`)
                setAnchorEl(null)
              }}
            >
              <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.21667 5L10 5.78333L2.43333 13.3333H1.66667V12.5667L9.21667 5ZM12.2167 0C12.0083 0 11.7917 0.0833333 11.6333 0.241667L10.1083 1.76667L13.2333 4.89167L14.7583 3.36667C15.0833 3.04167 15.0833 2.5 14.7583 2.19167L12.8083 0.241667C12.6417 0.075 12.4333 0 12.2167 0ZM9.21667 2.65833L0 11.875V15H3.125L12.3417 5.78333L9.21667 2.65833Z'
                  fill='#232F6F'
                />
              </svg>
              <p className='ml-2'> Edit sub-category </p>
            </MenuItem>
          </div>
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                onHide(row.id, row.hidden, row.name)
                setAnchorEl(null)
              }}
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M3.19435 1.59379C3.73377 1.05436 4.00349 0.783713 4.34693 0.641857C4.69037 0.5 5.07115 0.5 5.83456 0.5H10.1369C10.9078 0.5 11.2932 0.5 11.6395 0.644657C11.9848 0.789313 12.2554 1.06463 12.7958 1.61246L14.3581 3.19808C14.8882 3.73564 15.1532 4.00536 15.2932 4.346C15.4323 4.68571 15.4323 5.06275 15.4323 5.8187V10.1528C15.4323 10.9162 15.4323 11.297 15.2904 11.6404C15.1486 11.9839 14.8789 12.2526 14.3385 12.793L12.793 14.3385C12.2526 14.8789 11.9839 15.1476 11.6404 15.2904C11.297 15.4323 10.9162 15.4323 10.1528 15.4323H5.81963C5.06368 15.4323 4.68664 15.4323 4.346 15.2923C4.00629 15.1532 3.73657 14.8882 3.19901 14.3581L1.61339 12.7958C1.06463 12.2545 0.790247 11.9839 0.64559 11.6386C0.500933 11.2932 0.5 10.9078 0.5 10.1369V5.83456C0.5 5.07115 0.5 4.69037 0.641857 4.34693C0.783713 4.00349 1.05436 3.73377 1.59379 3.19435L3.19435 1.59379Z'
                  stroke='#232F6F'
                />
                <path
                  d='M4.2334 7.03125L4.62724 7.22817C5.66402 7.74662 6.80729 8.01653 7.96647 8.01653C9.12566 8.01653 10.2689 7.74662 11.3057 7.22817L11.6995 7.03125M7.96647 8.43115V9.83105M5.16667 7.96452L4.70003 8.89779M10.7663 7.96452L11.2329 8.89779'
                  stroke='#232F6F'
                  strokeLinecap='round'
                />
              </svg>
              <p className='ml-2'> {row.hidden ? 'Unhide' : 'Hide'} sub-category </p>
            </MenuItem>
          </div>
          <div>
            <MenuItem
              className='text-[#232F6F] font-medium text-sm'
              onClick={() => {
                onDelete(row.id)
                setAnchorEl(null)
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
              <p className='ml-2'> Remove sub-category </p>
            </MenuItem>
          </div>
        </Menu>
      </td>
    </tr>
  )
}
