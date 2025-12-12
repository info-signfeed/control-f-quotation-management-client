'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import { Button, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'

import type {
  Cell,
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  HeaderGroup,
  Row,
  Table
} from '@tanstack/react-table'
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

import { rankItem } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '../../components/TablePaginationComponent'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'
import { COLORS } from '@/utils/colors'
import { CategoryItem, ProductData } from '@/services/product'

// ---------- Types ----------

interface ListProductProps {
  data: ProductData[]
}

// ---------- Helpers ----------

const columnHelper = createColumnHelper<ProductData>()

const fuzzyFilter: FilterFn<ProductData> = (row, columnId, value) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const Filter = ({ column, table }: { column: Column<any, unknown>; table: Table<any> }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)
  const columnFilterValue = column.getFilterValue()

  if (column.id === 'id') return null

  return typeof firstValue === 'number' ? (
    <div className='flex gap-x-2'>
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
      />
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
      />
    </div>
  ) : (
    <CustomTextField
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder='Search...'
    />
  )
}

const ListProduct: React.FC<ListProductProps> = ({ data }) => {
  console.log('data: ', data)
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRowData, setMenuRowData] = useState<ProductData | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: ProductData) => {
    setAnchorEl(event.currentTarget)
    setMenuRowData(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRowData(null)
  }

  const handleEdit = (product: ProductData) => {
    router.push(`/brands/update-brand/${product.id}`)
    handleMenuClose()
  }

  const handleRemove = (product: ProductData) => {
    console.log('Remove product', product.id)
    toast.info(`Remove ProductData: ${product.productType}`)
    handleMenuClose()
  }

  const handleToggleHide = (product: ProductData) => {
    console.log('Toggle hide product', product.id)
    toast.info(`${product.isActive ? 'Unhide' : 'Hide'} ProductData: ${product.productType}`)
    handleMenuClose()
  }

  const columns = useMemo<ColumnDef<ProductData, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: Table<ProductData> }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: Row<ProductData> }) => (
          <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
        ),
        enableSorting: false,
        enableColumnFilter: false
      },

      columnHelper.accessor('productType', {
        header: 'Model',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('categories', {
        header: 'Category',
        cell: (info: CellContext<ProductData, CategoryItem[]>) => {
          const categories = info.getValue()
          const names = categories.map(cat => cat.name).join(', ')

          return <span className='font-medium'>{names}</span>
        },
        enableColumnFilter: false
      }),

      columnHelper.accessor('position', {
        header: 'Position',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('pattern', {
        header: 'Pattern',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('typeSpecs', {
        header: 'Type',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('loadIndex', {
        header: 'Load Index',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('brand', {
        header: 'Brand',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),
      columnHelper.accessor('size', {
        header: 'Size',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),
      columnHelper.accessor('unitsPerCarton', {
        header: 'Units/Carton',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),
      columnHelper.accessor('weight', {
        header: 'Weight (kg)',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),
      columnHelper.accessor('countryOrigin', {
        header: 'Country Origin',
        cell: (info: CellContext<ProductData, string>) => <span className='font-medium'>{info.getValue()}</span>,
        enableColumnFilter: false
      }),

      columnHelper.accessor('id', {
        header: 'Action',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }: { row: Row<ProductData> }) => (
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
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
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

  const handleExportBrands = (brands: ProductData[]) => {
    try {
      if (!brands || brands.length === 0) {
        toast.error('No data available for export')

        return
      }

      console.log('Export brands', brands)
      toast.success('ProductData report exported')
    } catch (error) {
      console.error('Error exporting brands:', error)
      toast.error('Failed to export report')
    }
  }

  const handleImportBrands = () => {
    toast.info('Import ProductData clicked')
  }

  // @ts-ignore
  return (
    <>
      <div className='flex flex-col gap-4'>
        <Card variant='outlined' sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5' mb={2}>
                Product Master ({data.length})
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
                  onClick={() => handleExportBrands(selectedRows.length ? selectedRows : data)}
                >
                  Export Items
                </Button>

                <Button variant='outlined' startIcon={<i className='tabler-upload' />} onClick={handleImportBrands}>
                  Import Items
                </Button>

                <Button
                  onClick={() => router.push('/product/add-product')}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  sx={{
                    backgroundColor: COLORS.black,
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#000', // keep black on hover
                      opacity: 0.9
                    }
                  }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* Table Card */}
        <Card variant='outlined'>
          <div className='overflow-x-auto'>
            <table className={styles.table}>
              <thead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<ProductData>) => (
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
                            {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
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
                  {table.getRowModel().rows.map((row: Row<ProductData>) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell: Cell<ProductData, unknown>) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        </Card>
      </div>

      {/* Row Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
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
          {menuRowData?.isActive ? 'Unhide' : 'Hide'}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ListProduct
