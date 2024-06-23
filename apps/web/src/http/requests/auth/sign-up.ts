import { apiClient } from '@/http/api'

interface SignUpCredentialsRequest {
  name: string
  email: string
  password: string
}

export async function signUpCredentials({
  name,
  email,
  password,
}: SignUpCredentialsRequest): Promise<void> {
  const result = await apiClient
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<void>()

  return result
}
