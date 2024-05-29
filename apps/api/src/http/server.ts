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

import { errorHandler } from './error-handler'
import { authRoutes } from './routes/auth'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors)
app.register(fastifyJwt, {
  secret: 'secret',
})
app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'next-rbac',
      description: 'multi-tenant & RABC',
      version: '0.1.0',
    },
    servers: [],
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

app
  .listen({ port: 3333 })
  .then(() => console.log('Server is running on port 3333'))
