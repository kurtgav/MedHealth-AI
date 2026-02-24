import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from './prisma';
import { UserRole } from '@/src/modules/auth/types';

export const authOptions: any = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user && user) {
        try {
          // Fetch user from database to get role
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });

          session.user.id = user.id;
          session.user.role = (dbUser?.role as UserRole) || UserRole.PATIENT;
        } catch (error) {
          console.error('Error fetching user role:', error);
          session.user.id = user.id;
          session.user.role = UserRole.PATIENT;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
  debug: process.env.NODE_ENV === 'development',
};

