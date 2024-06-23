import { compare, hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { env } from '../../../../../../packages/env'
import { prisma } from '../../../lib/prisma'
import { authMiddleware } from '../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request'
import { UnauthorizedError } from '../_errors/unauthorized'

export async function authRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('User with this email already exists')
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const hashedPassword = await hash(password, 6)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                  role: 'MEMBER',
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    },
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'create a new session',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        throw new BadRequestError()
      }

      if (userFromEmail.passwordHash === null) {
        throw new UnauthorizedError(
          'User has no password, use a different login method',
        )
      }

      const passwordMatch = await compare(password, userFromEmail.passwordHash)

      if (!passwordMatch) {
        throw new UnauthorizedError('Invalid password')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )

  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/profile',
      {
        schema: {
          tags: ['auth'],
          summary: 'get a user profile',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          where: { id: userId },
        })

        if (!user) {
          return reply.status(404).send({
            message: 'User not found',
          })
        }

        return reply.status(200).send({ user })
      },
    )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'recover a user password',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new BadRequestError('User not found')
      }

      await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: user.id,
        },
      })

      return reply.status(201).send()
    },
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'reset a user password',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      const token = await prisma.token.findUnique({
        where: { id: code },
      })

      if (!token) {
        throw new UnauthorizedError('Invalid token')
      }

      const passwordHash = await hash(password, 6)

      await prisma.$transaction([
        prisma.user.update({
          where: { id: token.userId },
          data: {
            passwordHash,
          },
        }),
        prisma.token.delete({
          where: {
            id: code,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'create a new session with github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token',
      )

      githubOAuthURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
      githubOAuthURL.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
      githubOAuthURL.searchParams.set('redirect_uri', env.GITHUB_REDIRECT_URI)
      githubOAuthURL.searchParams.set('code', code)

      const githubTokenesponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubTokenesponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          name: z.string().nullable(),
          email: z.string().nullable(),
          avatar_url: z.string().url(),
          id: z.number().int().transform(String),
        })
        .parse(githubUserData)

      if (!email) {
        throw new BadRequestError('Email is required')
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: githubId,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
