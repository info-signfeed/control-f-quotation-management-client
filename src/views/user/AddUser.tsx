'use client'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
// import BackArrowIcon from '@/icons/BackArrowIcon'
// import type { StationType } from '@/types/StationType'
import { User } from '@/types/userType'
import { Box, Button, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

export type FormValues = {
  userName: string
  district: string
  userPassword: string
  fullName: string
  userEmail: string
  userMobile: string
  gender: string
  roleId: number | null
  permissionIds: number[]
  file: File | null
  stationIds: string[] | null
}

interface RoleType {
  id: number
  roleName: string
  isActive: boolean
}

const genderList = [
  {
    id: 1,
    name: 'male',
    isActive: true
  },
  {
    id: 2,
    name: 'female',
    isActive: true
  }
]

interface AddUserProps {
  token: string
  districtList: { label: string; value: string }[]
  userData?: User | null
}

const AddUser: React.FC<AddUserProps> = ({ token, userData, districtList }) => {
  const router = useRouter()
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [rolelist, setRoleList] = useState<RoleType[]>([])
  // const [stations, setStations] = useState<StationType[]>([])

  const {
    control,
    reset,
    setValue,
    handleSubmit,

    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      userName: '',
      userPassword: '',
      fullName: '',
      userEmail: '',
      userMobile: '',
      gender: '',
      roleId: null,
      district: '',
      permissionIds: [],
      file: null,
      stationIds: []
    }
  })

  useEffect(() => {
    if (userData) {
      reset({
        userName: userData.username,
        userPassword: '',
        fullName: userData.fullName,
        userEmail: userData.email,
        userMobile: userData.mobile,
        gender: userData.gender,
        roleId: userData.roleId,
        district: userData.district,
        permissionIds: [],
        file: null,
        stationIds: userData.stationData?.map(s => s?.stationId) || []
      })
    }
  }, [userData, reset])

  const fetchUserRole = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/list-user-role`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const res = await response.json()
        setRoleList(res?.userRoleList)
      } else {
        console.error('Failed to fetch roles:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }, [token])

  const district = useWatch({ control, name: 'district' })

  const fetchAllStation = useCallback(
    async (dist?: string) => {
      if (!dist) return // prevent call if no district selected

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stations-by-district?district=${encodeURIComponent(dist)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const result = await response.json()
        console.log('Stations:', result)

        if (response.ok && result.status === 200) {
          // setStations(result.data)
        }
      } catch (error) {
        console.error('Fetch Stations Error:', error)
      }
    },
    [token]
  )

  useEffect(() => {
    if (!token) return
    fetchUserRole()
  }, [token, fetchUserRole])

  // Watch for district changes to refetch stations
  useEffect(() => {
    if (district) {
      fetchAllStation(district)
    }
  }, [district, fetchAllStation])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()

    formData.append('userName', data.userName)
    formData.append('userPassword', data.userPassword)
    formData.append('fullName', data.fullName)
    formData.append('userEmail', data.userEmail)
    formData.append('userMobile', data.userMobile)
    formData.append('gender', data.gender)
    formData.append('district', data.district)

    // Role ID
    if (data.roleId != null) {
      formData.append('roleId', String(data.roleId))
    }

    // Station IDs array for backend
    if (Array.isArray(data.stationIds)) {
      data.stationIds.forEach(id => {
        formData.append('stationIds[]', String(id))
      })
    }

    // File
    if (data.file) {
      formData.append('file', data.file)
    }

    // Add userId when updating
    if (userData && userData.id) {
      formData.append('userId', String(userData.id))
    }

    const url = userData
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/update-register-user`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/admin/add-register-user`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const result = await response.json()

    if (result.status === 200) {
      toast.success(userData ? 'User updated successfully' : 'User created successfully')

      if (!userData) reset()

      router.push(`/users`)
      router.refresh()
    } else {
      toast.error(result?.message || `Failed to ${userData ? 'update' : 'create'} user`)
    }
  }

  return (
    <>
      <div className='flex mb-5'>
        {/* <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <IconButton className='cursor-pointer' onClick={() => router.back()}>
            <BackArrowIcon />
          </IconButton>
          {userData ? 'Update User' : ' Create User'}
        </h1> */}

          <h1 className='text-[#232F6F] text-xl font-semibold flex items-center gap-2'>
          <span
            className='cursor-pointer flex items-center justify-center'
            onClick={() => router.push('/users')}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M9.97149 18.1108C10.0939 18.2317 10.1921 18.3776 10.2602 18.5396C10.3284 18.7017 10.365 18.8766 10.3679 19.054C10.3709 19.2314 10.3401 19.4076 10.2774 19.5721C10.2148 19.7366 10.1215 19.886 10.0031 20.0115C9.88479 20.1369 9.74383 20.2358 9.58865 20.3023C9.43347 20.3687 9.26726 20.4014 9.09993 20.3982C8.9326 20.3951 8.76758 20.3563 8.61471 20.2841C8.46184 20.2119 8.32426 20.1078 8.21017 19.978L1.56368 12.932C1.3303 12.6843 1.19922 12.3485 1.19922 11.9984C1.19922 11.6483 1.3303 11.3126 1.56368 11.0649L8.21017 4.01892C8.32426 3.88912 8.46184 3.78501 8.61471 3.71281C8.76758 3.6406 8.9326 3.60177 9.09993 3.59864C9.26726 3.59551 9.43347 3.62814 9.58865 3.69459C9.74382 3.76103 9.88479 3.85993 10.0031 3.98538C10.1215 4.11083 10.2148 4.26027 10.2774 4.42477C10.3401 4.58927 10.3709 4.76547 10.3679 4.94285C10.365 5.12024 10.3284 5.29518 10.2602 5.45724C10.1921 5.61929 10.0939 5.76514 9.97149 5.88609L5.45188 10.6773L21.553 10.6773C21.8835 10.6773 22.2005 10.8165 22.4342 11.0643C22.6679 11.312 22.7992 11.6481 22.7992 11.9984C22.7992 12.3488 22.6679 12.6848 22.4342 12.9326C22.2005 13.1804 21.8835 13.3195 21.553 13.3195L5.45188 13.3196L9.97149 18.1108Z'
                fill='#232F6F'
              />
            </svg>
          </span>
          {userData ? 'Update User' : ' Create User'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className='border border-gray-300 rounded-md bg-white p-4'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userName'
                    control={control}
                    rules={{
                      required: 'This field is required.',
                      validate: value => value.trim() !== '' || 'This field is required.'
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='User Name*'
                        placeholder='Enter User Name'
                        autoComplete='false'
                        error={!!errors.userName}
                        helperText={errors.userName ? errors.userName.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userPassword'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Password*'
                        placeholder='············'
                        autoComplete='false'
                        id='form-validation-basic-password'
                        type={isPasswordShown ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={!!errors.userPassword}
                        helperText={errors.userPassword ? errors.userPassword.message : ''}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>

          {/* Personal Information ============================================================= */}
          <Grid item xs={12} className='mt-4'>
            <Typography variant='h5'>Personal Information</Typography>
          </Grid>
          <Grid item xs={12}>
            <div className='border border-gray-300 rounded-md bg-white p-4'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='fullName'
                    control={control}
                    rules={{
                      required: 'This field is required.',
                      validate: value => value.trim() !== '' || 'This field is required.'
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Full Name*'
                        placeholder='Enter Full Name'
                        error={!!errors.fullName}
                        helperText={errors.fullName ? errors.fullName.message : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userEmail'
                    control={control}
                    rules={{
                      required: 'This field is required.',
                      validate: value => value.trim() !== '' || 'This field is required.'
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='email'
                        label='Email*'
                        placeholder='Enter Email'
                        error={!!errors.userEmail}
                        helperText={errors.userEmail ? errors.userEmail.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userMobile'
                    control={control}
                    rules={{
                      required: 'This field is required.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Only numbers are allowed.'
                      },
                      maxLength: {
                        value: 10,
                        message: 'Mobile number cannot exceed 10 digits.'
                      }
                    }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <CustomTextField
                        {...rest}
                        value={value || ''}
                        fullWidth
                        label='Phone number*'
                        type='tel'
                        placeholder='Enter Mobile No'
                        error={!!errors.userMobile}
                        helperText={errors.userMobile?.message}
                        onChange={e => {
                          const numeric = e.target.value.replace(/\D/g, '')
                          onChange(numeric)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='userMobile'
                    control={control}
                    rules={{
                      required: 'This field is required.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Only numbers are allowed.'
                      },
                      maxLength: {
                        value: 10,
                        message: 'Mobile number cannot exceed 10 digits.'
                      }
                    }}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <CustomTextField
                        {...rest}
                        value={value || ''}
                        fullWidth
                        label='Employee ID*'
                        type='tel'
                        placeholder='Enter Employee ID'
                        error={!!errors.userMobile}
                        helperText={errors.userMobile?.message}
                        onChange={e => {
                          const numeric = e.target.value.replace(/\D/g, '')
                          onChange(numeric)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gender'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        fullWidth
                        options={genderList}
                        id='autocomplete-controlled'
                        value={genderList.find(g => g.name === value) || null}
                        onChange={(e: any, newValue: any) => {
                          onChange(newValue ? newValue.name : '') // store only name
                        }}
                        isOptionEqualToValue={(option, val) => option.name === val?.name}
                        getOptionLabel={(option: any) =>
                          option?.name ? option.name.charAt(0).toUpperCase() + option.name.slice(1).toLowerCase() : ''
                        }
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            placeholder='Select Gender'
                            label='Gender*'
                            error={!!errors.gender}
                            helperText={errors.gender ? 'This field is required.' : ''}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='file'
                    control={control}
                    //   rules={{
                    //     required: pageName !== 'update-employee' ? 'Profile picture is required.' : false
                    //   }}
                    render={({ field: { value, onChange } }) => {
                      // Detect if we have an existing image from backend
                      const existingImageUrl =
                        userData?.profileUrl && !value
                          ? `${process.env.NEXT_PUBLIC_BASE_URL}${userData?.profileUrl}`
                          : null
                      return (
                        <Box display='flex' flexDirection='column' gap={2}>
                          <CustomTextField
                            fullWidth
                            label='Profile Picture*'
                            placeholder='Upload your profile picture'
                            autoComplete='off'
                            error={!!errors.file}
                            helperText={errors.file ? errors.file.message : ''}
                            InputProps={{
                              readOnly: true,
                              value: value ? value.name : '',
                              endAdornment: (
                                <>
                                  {!value ? (
                                    <Button variant='contained' component='label' size='small'>
                                      Upload
                                      <input
                                        type='file'
                                        accept='image/*'
                                        hidden
                                        onChange={e => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            onChange(file)
                                          }
                                        }}
                                      />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant='outlined'
                                      size='small'
                                      color='error'
                                      onClick={() => onChange(null)} // remove file
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </>
                              )
                            }}
                          />
                          {/*  Show existing or newly selected image preview */}
                          {(existingImageUrl || value) && (
                            <Box mt={1}>
                              <Typography variant='body2' mb={1}>
                                Preview:
                              </Typography>
                              <Box
                                component='img'
                                src={value ? URL.createObjectURL(value) : existingImageUrl || undefined}
                                alt='Profile Preview'
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1px solid #ccc'
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>

          {/* Role management ============================================================= */}
          <Grid item xs={12} className='mt-4'>
            <Typography variant='h5'>Role Management</Typography>
          </Grid>
          <Grid item xs={12}>
            <div className='border border-gray-300 rounded-md bg-white p-4'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='roleId'
                    control={control}
                    rules={{ required: 'This field is required.' }}
                    render={({ field: { value, onChange } }) => {
                      // Find the selected object by ID for Autocomplete display
                      const selectedRole = rolelist?.find(role => role?.id === value) || null

                      return (
                        <CustomAutocomplete
                          fullWidth
                          options={rolelist}
                          id='autocomplete-controlled'
                          value={selectedRole}
                          onChange={(e: any, newValue: any) => {
                            onChange(newValue ? newValue.id : null)
                          }}
                          isOptionEqualToValue={(option, val) => option.id === val.id}
                          getOptionLabel={(option: any) =>
                            option.roleName
                              ? option.roleName.charAt(0).toUpperCase() + option.roleName.slice(1).toLowerCase()
                              : ''
                          }
                          renderTags={tagValue => <span>{tagValue.length} selected</span>}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              placeholder='Select Role'
                              label='Role*'
                              error={!!errors.roleId}
                              helperText={errors.roleId ? errors.roleId.message : ''}
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='permissionIds'
                    control={control}
                    rules={{ required: 'Permission is required.' }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        fullWidth
                        id='permission-select'
                        options={districtList}
                        // value={value ? districtList.find(opt => opt.value === value) : null}
                        // onChange={(e, newVal) => {
                        //   const selectedDistrict = newVal?.value || ''
                        //   onChange(selectedDistrict)

                        //   // Trigger your API fetch here
                        //   if (selectedDistrict) {
                        //     fetchAllStation(selectedDistrict)
                        //   }
                        // }}
                        onChange={(e, newVal) => {
                          const selectedDistrict = newVal?.value || ''
                          onChange(selectedDistrict)

                          if (selectedDistrict) {
                            fetchAllStation(selectedDistrict)
                          } else {
                            setValue('stationIds', [])
                            // setStations([])
                          }
                        }}
                        getOptionLabel={o => o?.label || ''}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            label='Permissions*'
                            placeholder='Select Permission'
                            error={!!errors.district}
                            helperText={errors.district?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <Controller
                    name='stationIds'
                    control={control}
                    rules={{ required: 'This field is required.' }}
                    render={({ field: { value = [], onChange } }) => {
                      const selectedStations = stations?.filter(st => value?.includes(st.stationId)) || []

                      return (
                        <CustomAutocomplete
                          fullWidth
                          multiple
                          options={stations}
                          id='autocomplete-controlled'
                          value={selectedStations}
                          onChange={(e, newValue) => {
                            const ids = newValue.map(v => v.stationId) // <-- correct
                            onChange(ids)
                          }}
                          isOptionEqualToValue={(option, val) => option.stationId === val.stationId}
                          getOptionLabel={option =>
                            option.stationName
                              ? option.stationName.charAt(0).toUpperCase() + option.stationName.slice(1).toLowerCase()
                              : ''
                          }
                          renderTags={tagValue => <span>{tagValue.map(t => t.stationName).join(', ')}</span>}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              placeholder='Select Station'
                              label='Assign Station*'
                              error={!!errors.stationIds}
                              helperText={errors.stationIds?.message}
                              disabled={!district}
                            />
                          )}
                        />
                      )
                    }}
                  />
                </Grid> */}
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} className='flex justify-end gap-4  mt-6'>
            <Button variant='tonal' color='secondary' type='reset' onClick={() => reset()} sx={{ minWidth: 120 }}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ minWidth: 120 }}>
              {userData ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default AddUser
