import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from '../../../../packages/env'
import { errorHandler } from './error-handler'
import { authRoutes } from './routes/auth'
import { billingRoutes } from './routes/billing'
import { inviteRoutes } from './routes/invites'
import { memberRoutes } from './routes/members'
import { orgRoutes } from './routes/orgs'
import { projectRoutes } from './routes/projects'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'next-rbac',
      description: 'multi-tenant & RABC',
      version: '0.1.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(authRoutes)
app.register(orgRoutes)
app.register(projectRoutes)
app.register(memberRoutes)
app.register(inviteRoutes)
app.register(billingRoutes)

app
  .listen({ port: 3333 })
  .then(() => console.log('Server is running on port 3333'))
