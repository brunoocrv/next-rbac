import { Role } from '@next-rbac/auth'

import { apiClient } from '@/http/api'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembershipInfo(slug: string) {
  const result = await apiClient
    .get(`organizations/${slug}/membership`)
    .json<GetMembershipResponse>()

  return result
}
