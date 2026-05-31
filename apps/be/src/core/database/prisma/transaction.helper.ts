import type { Prisma, PrismaClient } from '@prisma/client'

export type TransactionClient = Prisma.TransactionClient
export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>

export async function withTransaction<T>(
  prisma: PrismaClient,
  callback: TransactionCallback<T>,
): Promise<T> {
  return prisma.$transaction(callback)
}
