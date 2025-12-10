'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import { Button, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import {
  Cell,
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  HeaderGroup,
  Row,
  Table,
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
import { rankItem } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '../../components/TablePaginationComponent'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

// Utils
import Image from 'next/image'
import { toast } from 'react-toastify'

// ---------- Types ----------

export interface Supplier {
  id: string | number
  supplierName: string
  email: string
  phone: string
  address: string
  supplierCode: string
  brands: string
  country: string
  bankDetails: string
  paymentTerms: string
  isHidden?: boolean
}

interface ListSupplierProps {
  data: Supplier[]
}

// ---------- Helpers ----------

const columnHelper = createColumnHelper<Supplier>()

const fuzzyFilter: FilterFn<Supplier> = (row, columnId, value) => {
  const search = String(value ?? '')
    .toLowerCase()
    .trim()
  const cellValue = String(row.getValue(columnId) ?? '').toLowerCase()

  const itemRank = rankItem(cellValue, search)
  return itemRank.passed
}

// Debounced input for global search
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
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const MaxLengthCell = ({ value, maxLength }: { value: string; maxLength: number }) => {
  if (!value) return <span>-</span>
  return <span title={value}>{value.length > maxLength ? `${value.substring(0, maxLength)}...` : value}</span>
}

const ListSupplier: React.FC<ListSupplierProps> = ({ data }) => {
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowData, setMenuRowData] = useState<Supplier | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, supplier: Supplier) => {
    setAnchorEl(event.currentTarget)
    setMenuRowData(supplier)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRowData(null)
  }

  const handleEdit = (supplier: Supplier) => {
    router.push(`/suppliers/update-supplier/${supplier.id}`)
    handleMenuClose()
  }

  const handleRemove = (supplier: Supplier) => {
    console.log('Remove supplier', supplier.id)
    toast.info(`Remove Supplier: ${supplier.supplierName}`)
    handleMenuClose()
  }

  const handleToggleHide = (supplier: Supplier) => {
    console.log('Toggle hide supplier', supplier.id)
    toast.info(`${supplier.isHidden ? 'Unhide' : 'Hide'} Supplier: ${supplier.supplierName}`)
    handleMenuClose()
  }

  const columns = useMemo<ColumnDef<Supplier, any>[]>(
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
        enableSorting: false,
        enableColumnFilter: false
      },

      columnHelper.accessor('supplierName', {
        header: 'Supplier Name',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('supplierCode', {
        header: 'Supplier Code',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('brands', {
        header: 'Brands',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('paymentTerms', {
        header: 'Payment Terms',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('bankDetails', {
        header: 'Bank Details',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('country', {
        header: 'Country',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('address', {
        header: 'Address',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('id', {
        header: 'Action',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <IconButton
            size='small'
            onClick={e => handleMenuOpen(e, row.original)}
            aria-label='Actions'
            sx={{ color: '#232F6F' }}
          >
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
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const selectedRows = table.getSelectedRowModel().rows.map(r => r.original)

  const handleAddSupplier = () => {
    router.push('/suppliers/add-supplier')
  }

  const handleExportSuppliers = (suppliers: Supplier[]) => {
    try {
      if (!suppliers.length) return toast.error('No supplier data available for export')
      console.log('Export suppliers', suppliers)
      toast.success('Supplier report exported')
    } catch (error) {
      toast.error('Failed to export suppliers')
    }
  }

  const handleImportSuppliers = () => {
    toast.info('Import Supplier clicked')
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Card variant='outlined' sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5' mb={2}>
                Supplier Master ({data.length})
              </Typography>
            </Grid>

            <Grid item xs={12} container alignItems='center' justifyContent='space-between'>
              <Grid item xs={12} sm={6}>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search Suppliers...'
                  className='w-full'
                />
              </Grid>

              <Grid item xs={12} sm={6} display='flex' justifyContent='flex-end' gap={2}>
                <Button
                  variant='outlined'
                  startIcon={<i className='tabler-download' style={{ transform: 'rotate(180deg)' }} />}
                  onClick={() => handleExportSuppliers(selectedRows.length ? selectedRows : data)}
                >
                  Export
                </Button>

                <Button variant='outlined' startIcon={<i className='tabler-upload' />} onClick={handleImportSuppliers}>
                  Import
                </Button>

                <Button
                  onClick={handleAddSupplier}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  color='primary'
                >
                  Add Supplier
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Card variant='outlined'>
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={classnames({
                                'flex items-center': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                              }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                            </div>
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
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

        <MenuItem onClick={() => menuRowData && handleToggleHide(menuRowData)}>
          <ListItemIcon>
            <i className='tabler-eye-off' />
          </ListItemIcon>
          {menuRowData?.isHidden ? 'Unhide' : 'Hide'}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ListSupplier
