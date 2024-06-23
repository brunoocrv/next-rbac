'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInWithCredentials } from '@/http/requests/auth/sign-in-credentials'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export async function signInWithCredentialsAction(data: FormData) {
  const { email, password } = Object.fromEntries(data)

  const parsed = schema.safeParse({ email, password })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    const { token } = await signInWithCredentials({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
