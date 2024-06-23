'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUpCredentials } from '@/http/requests/auth/sign-up'

const schema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Full name is required',
    }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export async function signUpWithCredentialsAction(data: FormData) {
  const { name, email, password, confirmPassword } = Object.fromEntries(data)

  const parsed = schema.safeParse({ name, email, password, confirmPassword })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    await signUpCredentials({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
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
