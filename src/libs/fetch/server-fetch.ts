// lib/fetch/server-fetch.ts
import 'server-only'
import { cookies } from 'next/headers'
import type { ApiResult } from '@/libs/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

if (!BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables')
}

export async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const token = cookies().get('accessToken')?.value

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers
      },
      cache: 'no-store'
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      return {
        success: false,
        error: {
          message: json?.message || 'Server request failed',
          status: res.status
        }
      }
    }

    return { success: true, data: json }
  } catch (error: any) {
    return {
      success: false,
      error: { message: error?.message || 'Network error' }
    }
  }
}
