import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/users'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organizations'
import { projectSubject } from './subjects/project'
import { userSubject } from './subjects/user'

const appAbilitySchema = z.union([
  userSubject,
  projectSubject,
  inviteSubject,
  organizationSubject,
  billingSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

export type AppAbility = MongoAbility<z.infer<typeof appAbilitySchema>>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Unknown role: ${user.role}`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType: (subject) => {
      return subject.__typename
    },
  })

  return ability
}

export * from './models/users'
export * from './models/organizations'
export * from './models/projects'
