import { defineAbilityFor } from '@next-rbac/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/requests/auth/get-profile'
import { getMembershipInfo } from '@/http/requests/orgs/get-membership'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}

export function getCurrentOrg() {
  return cookies().get('orgSlug')?.value ?? null
}

export async function getCurrentMembership() {
  const org = getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembershipInfo(org)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  console.log(membership)

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const token = cookies().get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const user = await getProfile()

    return user
  } catch {}

  redirect('/api/auth/sign-out')
}
