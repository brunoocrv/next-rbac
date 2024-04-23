import { defineAbilityFor } from '@next-rbac/auth'

const ability = defineAbilityFor({ role: 'member', id: 'user-id' })

console.log(ability.can('get', 'User'))
console.log(ability.can('create', 'Invite'))
