import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface PermissionType {
  permissionId: number
  permissionName: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1️⃣ Authenticate user
    const authRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!authRes.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const authData = await authRes.json()

    // 2️⃣ Fetch user profile using accessToken
    const profileRes = await fetch(`${BASE_URL}/admin/user-profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.accessToken}`
      }
    })

    if (!profileRes.ok) {
      console.error('Failed to fetch user profile:', profileRes.statusText)
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
    }

    const profileData = await profileRes.json()
    const userProfile = profileData.userProfile

    // 3️⃣ Set secure token cookie
    cookies().set({
      name: 'accessToken',
      value: authData.accessToken,
      httpOnly: true,
      secure: false, // ❌ DO NOT set true on plain HTTP
      sameSite: 'lax', // 'lax' works safely for HTTP and same-origin requests
      path: '/',
      maxAge: 12 * 60 * 60
    })

    // 4️⃣ Set readable user info cookie for client
    cookies().set({
      name: 'userInfo',
      value: JSON.stringify({
        id: userProfile.id,
        name: `${userProfile.firstName?.trim() || ''} ${userProfile.lastName?.trim() || ''}`,
        email: userProfile.email?.trim(),
        mobile: userProfile.mobile,
        roleId: userProfile.userRole,
        department: userProfile.department,
        companyId: userProfile.company?.[0]?.companyId || authData.companyId,
        companyName: userProfile.company?.[0]?.companyName || '',
        permissions: userProfile.permission?.map((p: PermissionType) => p.permissionName) || [],
        profileUrl: userProfile.profileUrlString
      }),
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
      path: '/'
    })

    // 5️⃣ Return merged response
    return NextResponse.json({
      success: true,
      token: authData.accessToken,
      user: userProfile,
      expiresIn: Date.now() + 12 * 60 * 60 * 1000
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     // 🔒 Send credentials to third-party API securely on server
//     const res = await fetch(`${BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     })

//     if (!res.ok) {

//       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
//     }

//     const data = await res.json()

//     // ✅ Store JWT in secure HTTP-only cookie
//     cookies().set({
//       name: 'accessToken',
//       value: data.accessToken,
//       httpOnly: true, // not accessible from JS
//       secure: process.env.NODE_ENV === 'production', // use HTTPS in prod
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 12 * 60 * 60 // 12 hours
//     })

//     // Optionally store user info (non-sensitive)
//     cookies().set({
//       name: 'userInfo',
//       value: JSON.stringify({
//         userType: data.userType,
//         companyId: data.companyId,
//         userId: data.userId
//       }),
//       httpOnly: false, // can be accessed by JS
//       path: '/'
//     })

//     return NextResponse.json({ success: true, user: data })
//   } catch (error: any) {
//     console.error('Login error:', error)
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
//   }
// }
