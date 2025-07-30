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
