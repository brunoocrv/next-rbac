import { HTTPError } from 'ky'
import { z } from 'zod'

import { createOrg } from '@/http/requests/orgs/create-org'

const schema = z
  .object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const regex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

            return regex.test(value)
          }
          return true
        },
        { message: 'Invalid domain' },
      ),
    shouldAttachusersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachusersByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Domain is required when auto-join is enabled',
      path: ['domain'],
    },
  )

export async function createOrgAction(data: FormData) {
  const result = schema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  try {
    await createOrg(result.data)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: {},
      }
    }
    return {
      success: false,
      message: 'Unexpected error occurred. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Organization created successfully',
    errors: null,
  }
}
