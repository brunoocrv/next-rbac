import { z } from 'zod'

export const projectSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  __typename: z.literal('Project').default('Project'),
})

export type Project = z.infer<typeof projectSchema>
