import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError, object, string } from "zod"
import { findUserByCredentials } from "./services/user/user.service"

const signInSchema = object({
  username: string({ required_error: "Nome de usuário é obrigatório" })
    .min(1, "Nome de usuário é obrigatório"),
  password: string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(3, "Senha deve ter pelo menos 3 caracteres"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { username, password } = await signInSchema.parseAsync(credentials)

          const user = await findUserByCredentials(username, password)

          if (!user) {
            return null
          }

          return {
            id: user.id,
            name: `${user.nome} ${user.sobrenome}`,
            email: user.email,
            username: user.username,
            role: user.role,
            nome: user.nome,
            sobrenome: user.sobrenome,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user
        token.username = String(customUser.username || "")
        token.role = String(customUser.role || "")
        token.nome = String(customUser.nome || "")
        token.sobrenome = String(customUser.sobrenome || "")
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.username = String(token.username || "")
        session.user.role = String(token.role || "")
        session.user.nome = String(token.nome || "")
        session.user.sobrenome = String(token.sobrenome || "")
      }
      return session
    },
  },
})