'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextFieldProps,
  Typography
} from '@mui/material'

import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { ColumnDef, ColumnFiltersState, FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '../../components/TablePaginationComponent'
import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import { COLORS } from '@/utils/colors'

// ---------------- Types ----------------

export interface Customer {
  id: number
  customerName: string
  customerCode: string
  country: string
  city: string
  address: string
  email: string
  phone: string
  isHidden?: boolean
}

interface ListCustomerProps {
  token: string
}

// ---------------- Helpers ----------------

const columnHelper = createColumnHelper<Customer>()

const fuzzyFilter: FilterFn<Customer> = (row, columnId, value) => {
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

// ---------------- COMPONENT ----------------

const ListCustomer: React.FC<ListCustomerProps> = ({ token }) => {
  const router = useRouter()

  const [data, setData] = useState<Customer[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowData, setMenuRowData] = useState<Customer | null>(null)

  // ------------ Fetch Data ------------
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customer/customer-list`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) return console.error('Failed to fetch customer list')

      const json = await response.json()

      const mapped: Customer[] = json.data.map((item: any) => ({
        id: item.id,
        customerName: item.customerName,
        customerCode: item.customerCode,
        email: item.email,
        phone: item.phoneNo,
        country: item.country,

        // Extract city from address
        city: item.address?.split(',')?.slice(-2, -1)[0]?.trim() ?? '',

        address: item.address,
        isHidden: false
      }))

      setData(mapped)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchData()
  }, [fetchData])

  const handleMenuOpen = (event: any, row: Customer) => {
    setAnchorEl(event.currentTarget)
    setMenuRowData(row)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRowData(null)
  }

  const handleEdit = (customer: Customer) => {
    router.push(`/customer/update-customer/${customer.id}`)
    handleMenuClose()
  }


  const handleRemove = async (customer: Customer) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/customer/delete-customer?id=${customer.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const res = await response.json();

    if (response.ok) {
      toast.success("Customer deleted successfully");
      fetchData();
    } else {
      toast.error(res?.message || "Failed to delete customer");
    }
  } catch (error) {
    console.error("Delete Customer Error:", error);
    toast.error("Something went wrong");
  }

  handleMenuClose();
};
  const handleToggleHide = (customer: Customer) => {
    toast.info(`${customer.isHidden ? 'Unhide' : 'Hide'}: ${customer.customerName}`)
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
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      },

      columnHelper.accessor('customerName', {
        header: 'Customer Name',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('customerCode', {
        header: 'Customer Code',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('country', {
        header: 'Country',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('city', {
        header: 'City',
        cell: info => <span className='font-medium'>{info.getValue()}</span>
      }),

      columnHelper.accessor('address', {
        header: 'Address',
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
                Customer Master ({data.length})
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
                  onClick={() => router.push('/customer/add-customer')}
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
                  Add Customer
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* --- TABLE --- */}
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
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No Data Available
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

      {/* --- MENU --- */}
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
          {menuRowData?.isHidden ? 'Unhide' : 'Hide'}
        </MenuItem> */}
      </Menu>
    </>
  )
}

export default ListCustomer
