'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import { IconPlus } from '@tabler/icons-react'

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Card, CardContent, Grid, Button, IconButton } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import AppReactDatepicker from '@/libs/AppReactDatepicker'
import AddCategory from '@/components/model/AddCategory'
import { useCountries } from '@/types/useCountries'

interface SupplierFormValues {
  supplierName: string
  supplierCode: string
  email: string
  phone: string
  country: string
  whatsapp: string
  wechat: string
  brandSupplies: number[]
  address: string

  owner: string
  salesManager: string
  inception: Date | null
  employeePax: string
  domesticOffices: string
  internationalOffices: string
  turnover: string
  exportPercent: string

  paymentTerms: string
  bankName: string
  accountNo: string
  ifsc: string
  focusCategory: number[]

  production: {
    category: number | ''
    capacity: string
  }[]
}

const UpdateSupplier = ({ token }: { token: string }) => {
  const router = useRouter()
  const params = useParams()
  const supplierId = params.id

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL
  const [focusCategories, setFocusCategories] = useState<any[]>([])
  const [paymentTerms, setPaymentTerms] = useState<any[]>([])
  const [brandList, setBrandList] = useState<any[]>([])

  const countries = useCountries()

  useEffect(() => {
    setPaymentTerms([
      { id: 1, name: '30/70' },
      { id: 2, name: 'LC' },
      { id: 3, name: 'TT' }
    ])

    fetchCategories()
    fetchBrand()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (supplierId && focusCategories.length >= 0 && brandList.length >= 0) {
      fetchSupplierDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId, focusCategories, brandList])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/category/category-list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      const formatted = (result.data || []).map((c: any) => ({
        id: c.id,
        name: c.categoryName
      }))
      setFocusCategories(formatted)
    } catch (err) {
      console.error('Error fetching categories', err)
    }
  }

  const fetchBrand = async () => {
    try {
      const res = await fetch(`${API_URL}/brand/brand-list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      const formatted = (result.data || []).map((p: any) => ({
        id: p.id,
        name: p.brandName.trim()
      }))
      setBrandList(formatted)
    } catch (err) {
      console.error('Error fetching brands', err)
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SupplierFormValues>({
    defaultValues: {
      supplierName: '',
      supplierCode: '',
      email: '',
      phone: '',
      country: '',
      whatsapp: '',
      wechat: '',
      brandSupplies: [],
      address: '',
      owner: '',
      salesManager: '',
      inception: null,
      employeePax: '',
      domesticOffices: '',
      internationalOffices: '',
      turnover: '',
      exportPercent: '',
      paymentTerms: '',
      bankName: '',
      accountNo: '',
      ifsc: '',
      focusCategory: [],
      production: [{ category: '', capacity: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'production',
    control
  })

  const fetchSupplierDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/supplier/supplier-detail-list?id=${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const s = (await res.json())?.data
      if (!s) return

      const productionMapped = (s.productionDetails || []).map((p: any) => ({
        category: p.categoryId ?? '',
        capacity: p.productionCapacity ?? ''
      }))

      reset({
        supplierName: s.supplierName || '',
        supplierCode: s.supplierCode || '',
        email: s.email || '',
        phone: s.phoneNo || '',
        country: s.country ?? '',
        whatsapp: s.whatsappNo || '',
        wechat: s.wechatId || '',
        brandSupplies: (s.brandSupplies || []).map((b: any) => b.id),
        address: s.address || '',
        owner: s.ownerName || '',
        salesManager: s.salesManagerName || '',
        inception: s.inceptionDate ? new Date(s.inceptionDate) : null,
        employeePax: String(s.employeePax ?? ''),
        domesticOffices: String(s.domesticOffices || ''),
        internationalOffices: String(s.internationalOffices || ''),
        turnover: String(s.turnoverPerMonth || ''),
        exportPercent: String(s.exportProduction || ''),
        paymentTerms: s.paymentTerms || '',
        bankName: s.bankName || '',
        accountNo: s.accountNo || '',
        ifsc: s.ifscCode || '',
        focusCategory: [],
        production: productionMapped.length ? productionMapped : [{ category: '', capacity: '' }]
      })
    } catch (error) {
      console.error('Error fetching supplier detail:', error)
    }
  }

  const onSubmit = async (data: SupplierFormValues) => {
    const payload = {
      id: Number(supplierId),
      supplierName: data.supplierName,
      supplierCode: data.supplierCode,
      email: data.email,
      phoneNo: data.phone,
      country: data.country,
      whatsappNo: data.whatsapp,
      wechatId: data.wechat,

      brandSupplies: data.brandSupplies.map(id => String(id)),

      address: data.address,

      ownerName: data.owner,
      salesManagerName: data.salesManager,

      inceptionDate: data.inception ? data.inception.toISOString().split('T')[0] : null,

      domesticOffices: Number(data.domesticOffices),
      internationalOffices: Number(data.internationalOffices),
      turnoverPerMonth: Number(data.turnover),
      exportProduction: Number(data.exportPercent),

      paymentTerms: data.paymentTerms,
      bankName: data.bankName,
      accountNo: data.accountNo,
      employeePax: data.employeePax,
      ifscCode: data.ifsc,

      productionDetails: data.production.map(p => ({
        category: p.category,
        productionCapacity: p.capacity
      })),

      isActive: true
    }

    try {
      const response = await fetch(`${API_URL}/supplier/update-supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Supplier updated successfully!')
        router.push('/supplier/list-supplier')
      } else {
        toast.error(result.message || 'Failed to update supplier')
      }
    } catch (e) {
      console.error('Update error', e)
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <div className='flex my-5'>
        <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span
            className='cursor-pointer flex items-center justify-center'
            onClick={() => router.push('/supplier/list-supplier')}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.97149 18.1108C10.0939 18.2317 10.1921 18.3776 10.2602 18.5396C10.3284 18.7017 10.365 18.8766 10.3679 19.054C10.3709 19.2314 10.3401 19.4076 10.2774 19.5721C10.2148 19.7366 10.1215 19.886 10.0031 20.0115C9.88479 20.1369 9.74383 20.2358 9.58865 20.3023C9.43347 20.3687 9.26726 20.4014 9.09993 20.3982C8.9326 20.3951 8.76758 20.3563 8.61471 20.2841C8.46184 20.2119 8.32426 20.1078 8.21017 19.978L1.56368 12.932C1.3303 12.6843 1.19922 12.3485 1.19922 11.9984C1.19922 11.6483 1.3303 11.3126 1.56368 11.0649L8.21017 4.01892C8.32426 3.88912 8.46184 3.78501 8.61471 3.71281C8.76758 3.6406 8.9326 3.60177 9.09993 3.59864C9.26726 3.59551 9.43347 3.62814 9.58865 3.69459C9.74382 3.76103 9.88479 3.85993 10.0031 3.98538C10.1215 4.11083 10.2148 4.26027 10.2774 4.42477C10.3401 4.58927 10.3709 4.76547 10.3679 4.94285C10.365 5.12024 10.3284 5.29518 10.2602 5.45724C10.1921 5.61929 10.0939 5.76514 9.97149 5.88609L5.45188 10.6773L21.553 10.6773C21.8835 10.6773 22.2005 10.8165 22.4342 11.0643C22.6679 11.312 22.7992 11.6481 22.7992 11.9984C22.7992 12.3488 22.6679 12.6848 22.4342 12.9326C22.2005 13.1804 21.8835 13.3195 21.553 13.3195L5.45188 13.3196L9.97149 18.1108Z'
                fill='#232F6F'
              />
            </svg>
          </span>
          Update Supplier
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card variant='outlined'>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='supplierName'
                  control={control}
                  rules={{ required: 'Supplier Name is required' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Supplier Name*'
                      placeholder='Enter supplier name'
                      error={!!errors.supplierName}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='supplierCode'
                  control={control}
                  rules={{ required: 'Supplier Code is required' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Supplier Code*'
                      placeholder='Enter supplier code'
                      error={!!errors.supplierCode}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Email*'
                      placeholder='Enter email'
                      error={!!errors.email}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: 'Phone number required' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Phone No*'
                      placeholder='Enter phone number'
                      error={!!errors.phone}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='country'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      fullWidth
                      options={countries}
                      value={countries.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name || '')}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Origin' placeholder='Select country' />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='whatsapp'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='WhatsApp' placeholder='Enter WhatsApp number' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='wechat'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='WeChat ID' placeholder='WeChat ID (if any)' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='brandSupplies'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      multiple
                      fullWidth
                      options={brandList}
                      value={brandList.filter(b => value?.includes(b.id))}
                      onChange={(e, val) => onChange(val.map((v: any) => v.id))}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Brand Supplies' placeholder='Select brands' />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      multiline
                      rows={2}
                      label='Address'
                      placeholder='Enter supplier address'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className='mt-10 mb-2 text-[#232F6F] font-semibold'>Business Details</div>

        <Card variant='outlined'>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='owner'
                  control={control}
                  rules={{ required: 'Owner name required' }}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Owner*' placeholder='Owner name' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='salesManager'
                  control={control}
                  rules={{ required: 'Sales Manager required' }}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Sales Manager*' placeholder='Sales manager name' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='inception'
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      selected={field.value}
                      onChange={field.onChange}
                      customInput={<CustomTextField label='Inception*' fullWidth />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='employeePax'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Employee Pax*' placeholder='e.g. 250' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='domesticOffices'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Domestic Offices'
                      placeholder='Enter number of domestic offices'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='internationalOffices'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='International Offices'
                      placeholder='Enter number of international offices'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='turnover'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Turnover / Month' placeholder='e.g. 50,00,000' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='exportPercent'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Export % of Production' placeholder='% e.g. 30' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='paymentTerms'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      options={paymentTerms}
                      fullWidth
                      value={paymentTerms.find(i => i.name === value) || null}
                      onChange={(e, val) => onChange(val?.name)}
                      getOptionLabel={o => o?.name || ''}
                      renderInput={params => (
                        <CustomTextField {...params} label='Payment Terms' placeholder='Select payment terms' />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='bankName'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Bank Detail' placeholder='Enter bank name' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='accountNo'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Account No.' placeholder='Enter account no.' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='ifsc'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='IFSC Code' placeholder='IFSC code' />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className='text-[#232F6F] font-semibold mt-5 mb-1 flex items-center gap-2'>Production capacity</div>

        <Card variant='outlined' className='p-4'>
          {fields.map((item, index) => (
            <div key={item.id} className='mb-4 last:mb-0'>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <Controller
                    name={`production.${index}.category`}
                    control={control}
                    render={({ field }) => (
                      <CustomAutocomplete
                        fullWidth
                        options={focusCategories}
                        value={focusCategories.find(i => i.id === field.value) || null}
                        onChange={(e, val) => field.onChange(val?.id)}
                        getOptionLabel={o => o?.name || ''}
                        renderInput={params => (
                          <CustomTextField {...params} label='Category' placeholder='Select category' />
                        )}
                      />
                    )}
                  />
                </div>

                <div className='flex-1'>
                  <Controller
                    name={`production.${index}.capacity`}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Production Capacity'
                        placeholder='Enter capacity units'
                      />
                    )}
                  />
                </div>

                <div className='flex items-center mt-4'>
                  {index === 0 ? (
                    <IconButton
                      onClick={() => append({ category: '', capacity: '' })}
                      sx={{ border: '1px solid #D0D5DD', background: '#EEF7FF', width: 32, height: 32 }}
                    >
                      <IconPlus size={16} color='#1171B2' />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => remove(index)}
                      sx={{ border: '1px solid #D0D5DD', background: '#FEECEC', width: 32, height: 32 }}
                    >
                      <span style={{ fontSize: 22, color: '#D92D20' }}>−</span>
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>

        <div className='flex justify-end gap-4 mt-6'>
          <Button variant='outlined' onClick={() => reset()}>
            Cancel
          </Button>
          <Button variant='contained' type='submit'>
            Update Supplier
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UpdateSupplier
