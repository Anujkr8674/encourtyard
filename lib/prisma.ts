import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if valid PostgreSQL URL is configured
const isLiveDbConfigured = Boolean(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('your_supabase_db_password') &&
  !process.env.DATABASE_URL.includes('your_supabase_project_ref')
);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { isLiveDbConfigured };
