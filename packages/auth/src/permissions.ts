import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/users'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  admin: (user, { can, cannot }) => {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  member: (user, { can }) => {
    can('get', 'User')

    // Project
    can(['create', 'get'], 'Project')
    can(['delete', 'update'], 'Project', { ownerId: { $eq: user.id } })
  },
  billing: (_, { can }) => {
    can('manage', 'Billing')
  },
}
