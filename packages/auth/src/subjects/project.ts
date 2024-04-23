import { z } from 'zod'

import { projectSchema } from '../models/projects'

export const projectSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('get'),
  ]),
  z.union([z.literal('Project'), projectSchema]),
])

export type ProjectSubject = z.infer<typeof projectSubject>
