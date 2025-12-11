'use client'

import { useState } from 'react'
import { Grid, IconButton, Menu, MenuItem, Button } from '@mui/material'
import { Controller } from 'react-hook-form'

import CustomTextField from "@core/components/mui/TextField";
import CustomAutocomplete from "@core/components/mui/Autocomplete";

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
    if (actionIndex !== null) setMatrix(matrix.filter((_, i) => i !== actionIndex))
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
      <h2 className='text-2xl font-medium text-[#232F6F] mb-4'>Approval Matrix</h2>

      {/* --- FORM AREA --- */}
      <div className='bg-white rounded-lg border p-5'>
        <Grid container spacing={3}>

          {/* Department - TEXT Field using CustomTextField */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              label='Department'
              placeholder='Eg: China PI Approver'
              value={department}
              onChange={e => setDepartment(e.target.value)}
            />
          </Grid>

          {/* Approver - Autocomplete Dropdown */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              options={approverList}
              fullWidth
              value={approverList.find(i => i === approver) || null}
              onChange={(e, val) => setApprover(val || '')}
              renderInput={(params) => (
                <CustomTextField {...params} label='Approver' placeholder='Select approver' />
              )}
            />
          </Grid>

          {/* TAT in Days - Autocomplete Dropdown */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              options={tatOptions}
              fullWidth
              value={tatOptions.find(i => i === tat) || null}
              onChange={(e, val) => setTat(val || '')}
              renderInput={(params) => (
                <CustomTextField {...params} label='TaT in Days' placeholder='Select TaT' />
              )}
            />
          </Grid>

        </Grid>

        {/* Add More / Update button */}
        <div className='flex justify-end'>
          <button
            onClick={handleAddOrUpdate}
            disabled={!isAddMoreEnabled}
            className={`mt-3 text-sm px-4 py-2 rounded-lg ${
              isAddMoreEnabled ? 'text-[#1171B2]' : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            + {editingIndex !== null ? 'Update' : 'Add More'}
          </button>
        </div>
      </div>

      {/* --- TABLE LIST --- */}
      {matrix.length > 0 && (
        <div className='mt-6'>
          <table className='w-full border-collapse text-sm text-center'>
            <thead>
              <tr className='bg-[#1e1e1e] text-white'>
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
                  <td className='p-2 border-r'>{String(index + 1).padStart(2, '0')}</td>
                  <td className='p-2 border-r'>{row.department}</td>
                  <td className='p-2 border-r'>
                    <span className='px-2 py-1 border rounded-sm'>{row.approver}</span>
                  </td>
                  <td className='p-2 border-r'>{row.level}</td>
                  <td className='p-2 border-r'>{row.tat}</td>
                  <td className='p-2'>
                    <IconButton onClick={(e) => openMenu(e, index)}>
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

      {/* Bottom Buttons */}
      <div className='flex justify-end gap-3 mt-6'>
        <Button variant='outlined'>
          Cancel
        </Button>

        <Button variant='contained'>
          Save
        </Button>
      </div>
    </div>
  )
}
