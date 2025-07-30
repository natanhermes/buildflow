import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByCredentials } from './services/user/user.service'

declare module 'next-auth' {
    interface User {
        id: string
        email: string
        nome: string
        sobrenome: string
        createdAt: Date
        updatedAt: Date
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials) {
                const user = await findUserByCredentials(
                    credentials.username as string,
                    credentials.password as string,
                )

                if (!user) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
})
