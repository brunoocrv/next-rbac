import { z } from 'zod'

export const organizationSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  __typename: z.literal('Organization').default('Organization'),
})

export type Organization = z.infer<typeof organizationSchema>
