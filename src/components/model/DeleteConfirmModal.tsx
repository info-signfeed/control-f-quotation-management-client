'use client'

import React from 'react'

interface DeleteConfirmModalProps {
  open: boolean
  title?: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  title = 'Delete',
  message = 'Are you sure you want to delete this item?',
  onCancel,
  onConfirm
}) => {
  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-80 text-center'>
        <h3 className='text-2xl font-bold text-red-600'>{title}</h3>

        <p className='mt-2 text-base font-medium text-[#2F2F2F]'>{message}</p>

        <div className='flex justify-center gap-3 mt-6'>
          <button
            className='bg-white px-5 py-2 rounded-full border border-[#2F2F2F] hover:cursor-pointer'
            onClick={onCancel}
          >
            Cancel
          </button>

          <button className='bg-red-600 text-white px-5 py-2 rounded-full hover:cursor-pointer' onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
