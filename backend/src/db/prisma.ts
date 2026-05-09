import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// In Prisma 7, the adapter factory handles the driver instantiation internally.
// We just need to pass the configuration object with the URL.
const adapter = new PrismaBetterSqlite3({ 
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db' 
});

export const prisma = new PrismaClient({ adapter });
