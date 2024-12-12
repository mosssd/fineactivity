import NextAuth ,{ AuthOptions, User }from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

const prisma = new PrismaClient()

declare module 'next-auth' {
  interface User {
    role: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (
          user &&
          (user.password && await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        } else {
          throw new Error('Invalid email or password')
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        console.log("xxx",profile)
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          // email: profile.email,
          image: profile.picture,
          role: 'member', // or any default role you want to assign
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('userrr', user)
      console.log('token', token)
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      console.log('sessionjaa', session)
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.image = token.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"// เพิ่มการรับรูปภาพเข้ามา
      }
      console.log('session222', session)
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profiletwo`
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// function GoogleProvider(arg0: { clientId: string | undefined; clientSecret: string | undefined }): import("next-auth/providers/index").Provider {
//   throw new Error('Function not implemented.')
// }
