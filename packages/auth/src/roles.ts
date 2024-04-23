import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('admin'),
  z.literal('member'),
  z.literal('billing'),
])

export type Role = z.infer<typeof roleSchema>
