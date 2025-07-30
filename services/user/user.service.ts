import db from '@/lib/db'
import { Prisma, Usuario } from '@prisma/client'
import { compareSync } from 'bcryptjs'


export type PublicUser = Omit<Usuario, 'password'>

export async function findUserByCredentials(
  username: string,
  password: string,
): Promise<Usuario | null> {
  const user = await db.usuario.findFirst({
    where: {
      username,
    },
  })

  if (!user) {
    return null
  }

  const passwordsMatch = compareSync(password, user.password)

  if (passwordsMatch) return user

  return null
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return null
  }

  return user
}

export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return null
  }

  return user
}

export async function createUser(user: Prisma.UserCreateInput): Promise<User> {
  const newUser = await db.user.create({
    data: user,
  })

  return newUser
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      company: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}
