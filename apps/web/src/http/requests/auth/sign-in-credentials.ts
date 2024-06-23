import { apiClient } from '@/http/api'

interface SignInWithCredentialsRequest {
  email: string
  password: string
}

interface SignInWithCredentialsResponse {
  token: string
}

export async function signInWithCredentials({
  email,
  password,
}: SignInWithCredentialsRequest) {
  const result = await apiClient
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithCredentialsResponse>()

  return result
}
