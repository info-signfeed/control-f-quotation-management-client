'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import { Button, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Table,
  CellContext,
  HeaderGroup,
  Row
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'
import type { TextFieldProps } from '@mui/material/TextField'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '../../components/TablePaginationComponent'

import styles from '@core/styles/table.module.css'
import { COLORS } from '@/utils/colors'

// ---------------- Types ----------------

export interface Brand {
  id: number
  brandName: string
  manufacturer: string
  origin: string
  focusCategory: string
  products: string
  headOffice: string
  segment: string
  isActive: boolean
}

interface ListBrandProps {
  token: string
}

const columnHelper = createColumnHelper<Brand>()

const fuzzyFilter: FilterFn<Brand> = (row, columnId, value) => {
  const search = String(value ?? '')
    .toLowerCase()
    .trim()
  const cellValue = String(row.getValue(columnId) ?? '').toLowerCase()
  return rankItem(cellValue, search).passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & TextFieldProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const ListBrand: React.FC<ListBrandProps> = ({ token }) => {
  const router = useRouter()

  const [data, setData] = useState<Brand[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowData, setMenuRowData] = useState<Brand | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brand/brand-list?status=active`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error('Failed to fetch brands')
        return
      }

      const res = await response.json()

      const mapped = res.data.map((item: any) => ({
        id: item.id,
        brandName: item.brandName,
        manufacturer: item.manufacturer,
        origin: item.origin,
        headOffice: item.headOffice,
        segment: item.segment,
        focusCategory: item.focusCategory?.map((fc: any) => fc.name).join(', ') || '',
        products: item.products?.map((p: any) => p.name).join(', ') || '',

        isHidden: false
      }))

      setData(mapped)
    } catch (e) {
      console.error('Brand fetch error:', e)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchData()
  }, [fetchData, token])

  const handleMenuOpen = (event: any, brand: Brand) => {
    setAnchorEl(event.currentTarget)
    setMenuRowData(brand)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRowData(null)
  }

  const handleEdit = (brand: Brand) => {
    router.push(`/brand/update-brand/${brand.id}`)
    handleMenuClose()
  }

  const handleRemove = async (brand: Brand) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brand/delete-brand?id=${brand.id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const res = await response.json()

      if (response.ok) {
        toast.success('Brand deleted successfully')
        fetchData()
      } else {
        toast.error(res?.message || 'Failed to delete brand')
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Delete Brand Error:', error)
    }

    handleMenuClose()
  }

  const columns = useMemo<ColumnDef<Brand, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
        enableSorting: false
      },

      columnHelper.accessor('brandName', {
        header: 'Brand Name',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('manufacturer', {
        header: 'Manufacturer',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('origin', {
        header: 'Origin',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('focusCategory', {
        header: 'Focus Category',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('products', {
        header: 'Products',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('headOffice', {
        header: 'Head Office',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('segment', {
        header: 'Segment',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('id', {
        header: 'Action',
        cell: ({ row }) => (
          <IconButton onClick={e => handleMenuOpen(e, row.original)}>
            <i className='tabler-dots-vertical' />
          </IconButton>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const selectedRows = table.getSelectedRowModel().rows.map(r => r.original)

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Card variant='outlined' sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5' mb={2}>
                Brand Master ({data.length})
              </Typography>
            </Grid>

            <Grid item xs={12} container alignItems='center' justifyContent='space-between'>
              <Grid item xs={12} sm={6}>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search Brands...'
                  className='w-full'
                />
              </Grid>

              <Grid item xs={12} sm={6} display='flex' justifyContent='flex-end' gap={2}>
                <Button
                  variant='outlined'
                  startIcon={<i className='tabler-download' style={{ transform: 'rotate(180deg)' }} />}
                  // onClick={() => handleExportBrands(selectedRows.length ? selectedRows : data)}
                >
                  Export
                </Button>

                <Button variant='outlined' startIcon={<i className='tabler-upload' />}>
                  Import
                </Button>

                <Button
                  onClick={() => router.push('/brand/add-brand')}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  sx={{
                    backgroundColor: COLORS.black,
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#000',
                      opacity: 0.9
                    }
                  }}
                >
                  Add Brand
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* TABLE */}
        <Card variant='outlined'>
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(header => (
                      <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            page={table.getState().pagination.pageIndex}
            rowsPerPage={table.getState().pagination.pageSize}
            onPageChange={(_, page) => table.setPageIndex(page)}
          />
        </Card>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuRowData && handleEdit(menuRowData)}>
          <ListItemIcon>
            <i className='tabler-edit' />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem onClick={() => menuRowData && handleRemove(menuRowData)}>
          <ListItemIcon>
            <i className='tabler-trash' />
          </ListItemIcon>
          Remove
        </MenuItem>
        {/* <MenuItem onClick={() => menuRowData && handleToggleHide(menuRowData)}>
          <ListItemIcon>
            <i className='tabler-eye-off' />
          </ListItemIcon>
          {menuRowData?.isActive ? 'Unhide' : 'Hide'}
        </MenuItem> */}
      </Menu>
    </>
  )
}

export default ListBrand
