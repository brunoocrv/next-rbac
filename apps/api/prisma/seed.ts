import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const first = await prisma.user.create({
    data: {
      email: 'bruno@email',
      name: 'Bruno Seed',
      avatarUrl: 'https://github.com/brunoocrv.png',
      passwordHash: await hash('123456', 1),
    },
  })

  const second = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash: await hash('123456', 1),
    },
  })

  const third = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash: await hash('123456', 1),
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: first.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
          ],
        },
      },
      member: {
        createMany: {
          data: [
            {
              userId: first.id,
              role: 'ADMIN',
            },
            {
              userId: second.id,
              role: 'MEMBER',
            },
            {
              userId: third.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: first.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
          ],
        },
      },
      member: {
        createMany: {
          data: [
            {
              userId: first.id,
              role: 'MEMBER',
            },
            {
              userId: second.id,
              role: 'ADMIN',
            },
            {
              userId: third.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: first.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                first.id,
                second.id,
                third.id,
              ]),
            },
          ],
        },
      },
      member: {
        createMany: {
          data: [
            {
              userId: first.id,
              role: 'BILLING',
            },
            {
              userId: second.id,
              role: 'ADMIN',
            },
            {
              userId: third.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('database seeded')
})
