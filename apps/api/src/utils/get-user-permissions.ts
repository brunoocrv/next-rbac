import { Role } from '@prisma/client'

import { defineAbilityFor, userSchema } from '../../../../packages/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
