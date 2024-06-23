import { apiClient } from '@/http/api'

interface ProfileResponse {
  user: {
    id: number
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getProfile() {
  const result = await apiClient.get('profile').json<ProfileResponse>()

  return result.user
}
