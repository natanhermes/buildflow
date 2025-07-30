import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError, object, string } from "zod"
import { findUserByCredentials } from "./services/user/user.service"

const signInSchema = object({
  username: string({ required_error: "Username é obrigatório" })
    .min(1, "Username é obrigatório"),
  password: string({ required_error: "Password é obrigatório" })
    .min(1, "Password é obrigatório")
    .min(3, "Password deve ter pelo menos 3 caracteres"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          label: "Usuário",
          type: "text",
          placeholder: "Digite seu usuário",
        },
        password: {
          label: "Senha", 
          type: "password",
          placeholder: "Digite sua senha",
        },
      },
      async authorize(credentials) {
        try {
          const { username, password } = await signInSchema.parseAsync(credentials)

          const user = await findUserByCredentials(username, password)

          if (!user) {
            throw new Error("Credenciais inválidas.")
          }

          return {
            id: user.id,
            name: `${user.nome} ${user.sobrenome}`,
            email: user.email,
            username: user.username,
            role: user.role,
            status: user.status,
            nome: user.nome,
            sobrenome: user.sobrenome,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          throw new Error("Erro de autenticação.")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as any
        token.username = String(customUser.username || "")
        token.role = String(customUser.role || "")
        token.status = String(customUser.status || "")
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
        session.user.status = String(token.status || "")
        session.user.nome = String(token.nome || "")
        session.user.sobrenome = String(token.sobrenome || "")
      }
      return session
    },
  },
})