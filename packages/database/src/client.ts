import { PrismaClient } from '../generated/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

class ExtendedPrismaClient extends PrismaClient {
  async $connect() {
    return super.$connect();
  }

  async $disconnect() {
    return super.$disconnect();
  }
}

export const prisma = global.prisma || new ExtendedPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Re-export the PrismaClient type and instance
export { ExtendedPrismaClient as PrismaClient };
export type { Prisma } from '../generated/client';
