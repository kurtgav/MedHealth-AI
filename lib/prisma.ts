import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test database connection on startup
if (process.env.DATABASE_URL) {
  prisma.$connect().catch((error) => {
    console.error('Failed to connect to database:', error);
    console.warn('Please set DATABASE_URL in your .env.local file');
  });
}

