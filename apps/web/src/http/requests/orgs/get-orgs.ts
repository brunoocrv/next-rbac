import { apiClient } from '@/http/api'

interface GetOrganizationsResponse {
  organizations: {
    role: string
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrgs() {
  const result = await apiClient
    .get('organizations')
    .json<GetOrganizationsResponse>()

  return result
}
