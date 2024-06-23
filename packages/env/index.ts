import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
    JWT_SECRET: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_HOST: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  emptyStringAsUndefined: true,
})
