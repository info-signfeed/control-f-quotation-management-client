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
import { toast } from 'react-toastify'

// ---------- Types ----------

export interface Customer {
  id: string | number
  customerName: string
  customerCode: string
  country: string
  city: string
  Address: string
  email: string
  phone: string
  isHidden?: boolean
}

interface ListCustomerProps {
  data: Customer[]
}

// ---------- Helpers ----------

const columnHelper = createColumnHelper<Customer>()

const fuzzyFilter: FilterFn<Customer> = (row, columnId, value) => {
  const search = String(value ?? '')
    .toLowerCase()
    .trim()
  const cellValue = String(row.getValue(columnId) ?? '').toLowerCase()
  const itemRank = rankItem(cellValue, search)
  return itemRank.passed
}

// Debounced input
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

  useEffect(() => setValue(initialValue), [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const MaxLengthCell = ({ value, maxLength }: { value: string; maxLength: number }) => {
  if (!value) return <span>-</span>
  return <span title={value}>{value.length > maxLength ? `${value.substring(0, maxLength)}...` : value}</span>
}

const ListCustomer: React.FC<ListCustomerProps> = ({ data }) => {
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowData, setMenuRowData] = useState<Customer | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget)
    setMenuRowData(customer)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRowData(null)
  }

  const handleEdit = (customer: Customer) => {
    router.push(`/customers/update-customer/${customer.id}`)
    handleMenuClose()
  }

  const handleRemove = (customer: Customer) => {
    console.log('Remove Customer', customer.id)
    toast.info(`Remove Customer: ${customer.customerName}`)
    handleMenuClose()
  }

  const handleToggleHide = (customer: Customer) => {
    console.log('Toggle hide customer', customer.id)
    toast.info(`${customer.isHidden ? 'Unhide' : 'Hide'} Customer: ${customer.customerName}`)
    handleMenuClose()
  }

  const columns = useMemo<ColumnDef<Customer, any>[]>(
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

      columnHelper.accessor('customerName', {
        header: 'Customer Name',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('customerCode', {
        header: 'Customer Code',
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

      columnHelper.accessor('city', {
        header: 'City',
        cell: info => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('Address', {
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

  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)

  const handleAddCustomer = () => {
    router.push('/customers/add-customer')
  }

  const handleExportCustomers = (customers: Customer[]) => {
    if (!customers.length) return toast.error('No customer data available')
    console.log('Export customers', customers)
    toast.success('Customer report exported')
  }

  const handleImportCustomers = () => {
    toast.info('Import Customer clicked')
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Card variant='outlined' sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5' mb={2}>
                Customer Master ({data.length})
              </Typography>
            </Grid>

            <Grid item xs={12} container alignItems='center' justifyContent='space-between'>
              <Grid item xs={12} sm={6}>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  placeholder='Search Customers...'
                  className='w-full'
                />
              </Grid>

              <Grid item xs={12} sm={6} display='flex' justifyContent='flex-end' gap={2}>
                <Button
                  variant='outlined'
                  startIcon={<i className='tabler-download' style={{ transform: 'rotate(180deg)' }} />}
                  onClick={() => handleExportCustomers(selectedRows.length ? selectedRows : data)}
                >
                  Export
                </Button>

                <Button variant='outlined' startIcon={<i className='tabler-upload' />} onClick={handleImportCustomers}>
                  Import
                </Button>

                <Button
                  onClick={handleAddCustomer}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  color='primary'
                >
                  Add Customer
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
                        {!header.isPlaceholder && (
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

              <tbody>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No data available
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
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

export default ListCustomer
