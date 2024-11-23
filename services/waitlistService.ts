import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WaitlistService {
  async addToWaitlist(email: string, source?: string) {
    return prisma.waitlistEntry.create({
      data: {
        email,
        source,
      },
    });
  }

  async getWaitlist(options: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [entries, total] = await Promise.all([
      prisma.waitlistEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.waitlistEntry.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: string) {
    return prisma.waitlistEntry.update({
      where: { id },
      data: { status },
    });
  }

  async deleteEntry(id: string) {
    return prisma.waitlistEntry.delete({
      where: { id },
    });
  }
} 