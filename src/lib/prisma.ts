import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 

// Add this function to get truly random records
export async function getRandomRecords<T>(
  model: any,
  take: number,
  where: any = {}
): Promise<T[]> {
  // First, count the total number of records that match the where clause
  const count = await model.count({ where });
  
  // Generate a random skip value
  const skip = Math.max(0, Math.floor(Math.random() * count) - take);
  
  // Fetch the records
  const records = await model.findMany({
    take,
    skip,
    where,
    orderBy: {
      id: 'asc',
    },
  });
  
  // Shuffle the results
  return records.sort(() => Math.random() - 0.5);
} 