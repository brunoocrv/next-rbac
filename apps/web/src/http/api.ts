import { env } from '@next-rbac/env'
import { getCookie } from 'cookies-next'
import ky from 'ky'

export const apiClient = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_HOST,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')

          const token = getCookie('token', { cookies: serverCookies })

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        } else {
          const token = getCookie('token')

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        }
      },
    ],
  },
})
