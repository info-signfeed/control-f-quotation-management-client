'use client'

import { useState } from 'react'

import { FormControl, Select, MenuItem, TextField, InputLabel, IconButton, Menu, Button } from '@mui/material'

import { FiMoreVertical } from 'react-icons/fi'

export default function ApprovalMatrixPage() {
  const [department, setDepartment] = useState('')
  const [approver, setApprover] = useState('')
  const [tat, setTat] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [matrix, setMatrix] = useState<any[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [actionIndex, setActionIndex] = useState<number | null>(null)
  const approverList = ['Aman', 'Sneha', 'John', 'Riya']
  const tatOptions = ['5', '10', '15', '20', '25', '30']
  const isAddMoreEnabled = department && approver && tat

  const handleAddOrUpdate = () => {
    if (!isAddMoreEnabled) return

    const newEntry = {
      department,
      approver,
      tat,
      level: `Level ${matrix.length + 1}`
    }

    if (editingIndex !== null) {
      const updated = [...matrix]

      updated[editingIndex] = newEntry
      setMatrix(updated)
      setEditingIndex(null)
    } else {
      setMatrix([...matrix, newEntry])
    }

    setDepartment('')
    setApprover('')
    setTat('')
  }

  const openMenu = (event: any, index: number) => {
    setAnchorEl(event.currentTarget)
    setActionIndex(index)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setActionIndex(null)
  }

  const handleRemove = () => {
    if (actionIndex !== null) {
      setMatrix(matrix.filter((_, i) => i !== actionIndex))
    }

    closeMenu()
  }

  const handleEdit = () => {
    if (actionIndex !== null) {
      const item = matrix[actionIndex]

      setDepartment(item.department)
      setApprover(item.approver)
      setTat(item.tat)
      setEditingIndex(actionIndex)
    }

    closeMenu()
  }

  return (
    <div className='w-full'>
      <h2 className='text-2xl font-medium  text-[#232F6F] mb-4'>Approval Matrix</h2>
      <div className='bg-white rounded-lg border p-5 w-full'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <TextField
            label='Department'
            placeholder='Eg: China PI Approver'
            fullWidth
            value={department}
            onChange={e => setDepartment(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Approver</InputLabel>
            <Select
              label='Approver'
              value={approver}
              onChange={e => setApprover(e.target.value)}

              // IconComponent={KeyboardArrowDownIcon}
            >
              {approverList.map((a, i) => (
                <MenuItem key={i} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>TaT in Days</InputLabel>
            <Select
              label='TaT in Days'
              value={tat}
              onChange={e => setTat(e.target.value)}

              // IconComponent={KeyboardArrowDownIcon}
            >
              {tatOptions.map((t, i) => (
                <MenuItem key={i} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={handleAddOrUpdate}
            disabled={!isAddMoreEnabled}
            className={`mt-3 text-sm px-4 py-2 rounded-lg bg-none ${
              isAddMoreEnabled ? 'text-[#1171B2] cursor-pointer' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            + {editingIndex !== null ? 'Update' : 'Add More'}
          </button>
        </div>
      </div>
      {matrix.length > 0 && (
        <div className='mt-6'>
          <table className='w-full border-collapse text-sm items-start text-center'>
            <thead>
              <tr className='bg-[#1e1e1e] text-white border rounded-lg border-dashed border-white'>
                <th className='p-2 border-r border-[#F1F3FB]'>No.</th>
                <th className='p-2 border-r border-[#F1F3FB]'>Node</th>
                <th className='p-2 border-r border-[#F1F3FB]'>Approver</th>
                <th className='p-2 border-r border-[#F1F3FB]'>Level</th>
                <th className='p-2 border-r border-[#F1F3FB]'>TaT Days</th>
                <th className='p-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, index) => (
                <tr key={index} className='border'>
                  <td className='p-2 border-r border-[#E1E3FA]'>{String(index + 1).padStart(2, '0')}</td>
                  <td className='p-2 border-r border-[#E1E3FA]'>{row.department}</td>
                  <td className='p-2 border-r border-[#E1E3FA]'>
                    <span className='px-2 py-1  bg-white border border-[#212121] rounded-sm text-[#212121]'>
                      {row.approver}
                    </span>
                  </td>
                  <td className='p-2 border-r border-[#E1E3FA]'>{row.level}</td>
                  <td className='p-2 border-r border-[#E1E3FA]'>{row.tat}</td>
                  <td className='p-2'>
                    <IconButton onClick={e => openMenu(e, index)}>
                      <FiMoreVertical />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            <MenuItem onClick={handleEdit}>Update</MenuItem>
            <MenuItem onClick={handleRemove} sx={{ color: 'red' }}>
              Remove
            </MenuItem>
          </Menu>
        </div>
      )}
      <div className='flex justify-end gap-3 mt-6'>
        <Button
          variant='outlined'
          sx={{
            color: '#63688B',
            borderColor: '#63688B',
            '&:hover': {
              color: '#63688B',
              borderColor: '#63688B',
              backgroundColor: 'transparent'
            }
          }}
        >
          Cancel
        </Button>

        <Button variant='contained' sx={{ bgcolor: '#1171B2' }}>
          Save
        </Button>
      </div>
    </div>
  )
}
