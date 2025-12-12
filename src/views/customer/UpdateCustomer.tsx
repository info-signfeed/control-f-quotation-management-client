'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { Card, CardContent, Grid, Button } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import AppReactDatepicker from '@/libs/AppReactDatepicker'
import { useCountries } from '@/types/useCountries'

interface CustomerFormValues {
  customerName: string
  customerCode: string
  email: string
  phone: string
  country: string
  whatsapp: string
  address: string
  owner: string
  salesManager: string
  inception: Date | null
  domesticOffices: string
  internationalOffices: string
  turnover: string
  salesTeamPax: string
  employeePax: string
  importVolume: string
  importingSince: Date | null
}

const UpdateCustomer = ({ token }: { token: string }) => {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL
  const countries = useCountries()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CustomerFormValues>()

  // ---------------------- Fetch customer details ----------------------
  useEffect(() => {
    if (customerId) fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/customer/customer-detail-list?id=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await res.json()
      const c = result?.data

      if (c) {
        reset({
          customerName: c.customerName,
          customerCode: c.customerCode,
          email: c.email,
          phone: c.phoneNo,
          country: c.country,
          whatsapp: c.whatsappNo,
          address: c.address,

          owner: c.ownerName,
          salesManager: c.salesManagerName,

          inception: c.inceptionDate ? new Date(c.inceptionDate) : null,

          domesticOffices: String(c.domesticOffices || ''),
          internationalOffices: String(c.internationalOffices || ''),
          turnover: String(c.turnoverPerMonth || ''),
          salesTeamPax: String(c.salesTeamSize || ''),
          employeePax: String(c.employeeCount || ''),
          importVolume: String(c.importVolumePerMonth || ''),

          importingSince: c.importingSince ? new Date(c.importingSince) : null
        })
      }
    } catch (error) {
      console.log('Fetch error:', error)
    }
  }

  // ---------------------- Submit update API ----------------------
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const payload = {
        customerId: Number(customerId),

        customerName: data.customerName,
        customerCode: data.customerCode,
        email: data.email,
        phoneNo: data.phone,
        country: data.country,
        whatsappNo: data.whatsapp,
        address: data.address,

        ownerName: data.owner,
        salesManagerName: data.salesManager,

        inceptionDate: data.inception ? data.inception.toISOString().split('T')[0] : null,

        domesticOffices: Number(data.domesticOffices) || 0,
        internationalOffices: Number(data.internationalOffices) || 0,
        turnoverPerMonth: Number(data.turnover) || 0,
        salesTeamSize: Number(data.salesTeamPax) || 0,
        employeeCount: Number(data.employeePax) || 0,
        importVolumePerMonth: Number(data.importVolume) || 0,

        importingSince: data.importingSince ? data.importingSince.toISOString().split('T')[0] : null,

        isActive: true
      }

      const response = await fetch(`${API_URL}/customer/update-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.status === 200) {
        toast.success('Customer updated successfully!')
        router.push('/customer/list-customer')
      } else {
        toast.error(result.message || 'Update failed!')
      }
    } catch (e) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div>
      <div className='flex my-5'>
        {/* <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span className='cursor-pointer' onClick={() => router.push('/customer/list-customer')}>
            ⬅
          </span>
          Update Customer
        </h1> */}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card variant='outlined'>
          <CardContent>
            <Grid container spacing={4}>
              {/* Customer Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='customerName'
                  control={control}
                  rules={{ required: 'Customer Name is required' }}
                  render={({ field }) => (
                    <CustomTextField {...field} label='Customer Name*' fullWidth error={!!errors.customerName} />
                  )}
                />
              </Grid>

              {/* Customer Code */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='customerCode'
                  control={control}
                  rules={{ required: 'Customer Code is required' }}
                  render={({ field }) => (
                    <CustomTextField {...field} label='Customer Code*' fullWidth error={!!errors.customerCode} />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: 'Email is required' }}
                  render={({ field }) => (
                    <CustomTextField {...field} label='Email*' fullWidth error={!!errors.email} />
                  )}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} label='Phone No*' fullWidth error={!!errors.phone} />
                  )}
                />
              </Grid>

              {/* Country */}
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
                      renderInput={params => <CustomTextField {...params} label='Country' />}
                    />
                  )}
                />
              </Grid>

              {/* WhatsApp */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='whatsapp'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='WhatsApp No' fullWidth />}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} label='Address' rows={2} multiline fullWidth />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* BUSINESS DETAILS */}
        <h2 className='mt-10 text-[#232F6F] font-semibold'>Business Details</h2>

        <Card variant='outlined' className='mt-2'>
          <CardContent>
            <Grid container spacing={4}>
              {/* Owner */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='owner'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Owner' fullWidth />}
                />
              </Grid>

              {/* Sales Manager */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='salesManager'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Sales Manager' fullWidth />}
                />
              </Grid>

              {/* Inception Date */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='inception'
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      selected={field.value}
                      onChange={field.onChange}
                      customInput={<CustomTextField label='Inception Date' fullWidth />}
                    />
                  )}
                />
              </Grid>

              {/* Domestic */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='domesticOffices'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Domestic Offices' fullWidth />}
                />
              </Grid>

              {/* International */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='internationalOffices'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='International Offices' fullWidth />}
                />
              </Grid>

              {/* Turnover */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='turnover'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Turnover / Month' fullWidth />}
                />
              </Grid>

              {/* Sales Team */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='salesTeamPax'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Sales Team Pax' fullWidth />}
                />
              </Grid>

              {/* Employee Pax */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='employeePax'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Employee Pax' fullWidth />}
                />
              </Grid>

              {/* Import Volume */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='importVolume'
                  control={control}
                  render={({ field }) => <CustomTextField {...field} label='Import Volume / Month' fullWidth />}
                />
              </Grid>

              {/* Importing Since */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name='importingSince'
                  control={control}
                  render={({ field }) => (
                    <AppReactDatepicker
                      selected={field.value}
                      onChange={field.onChange}
                      customInput={<CustomTextField label='Importing Since' fullWidth />}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className='flex justify-end gap-4 mt-6'>
          <Button variant='outlined' onClick={() => router.push('/customer/list-customer')}>
            Cancel
          </Button>

          <Button variant='contained' type='submit'>
            Update
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UpdateCustomer
