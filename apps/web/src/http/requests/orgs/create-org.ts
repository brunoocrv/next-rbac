import { apiClient } from '@/http/api'

interface CreateOrganizationsRequest {
  domain: string | null
  name: string
  shouldAttachusersByDomain: boolean
}

export async function createOrg({
  domain,
  name,
  shouldAttachusersByDomain,
}: CreateOrganizationsRequest): Promise<void> {
  await apiClient
    .post('organizations', {
      json: {
        domain,
        name,
        shouldAttachusersByDomain,
      },
    })
    .json<void>()
}
