import { PrismaClient } from '../generated/client';
declare global {
    var prisma: PrismaClient | undefined;
}
declare class ExtendedPrismaClient extends PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}
export declare const prisma: PrismaClient<import("../generated/client").Prisma.PrismaClientOptions, never, import("../generated/client/runtime/library").DefaultArgs>;
export { ExtendedPrismaClient as PrismaClient };
export type { Prisma } from '../generated/client';
//# sourceMappingURL=client.d.ts.map