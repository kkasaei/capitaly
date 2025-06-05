import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createCaller } from "@/lib/trpc/root";
import { createTRPCContext } from "@/lib/trpc";

// Simple in-memory cache for the request context
let contextCache: ReturnType<typeof createTRPCContext> | null = null;
let apiCache: ReturnType<typeof createCaller> | null = null;

/**
 * Creates a tRPC context for use in React Server Components.
 * Uses simple caching to avoid recreating contexts unnecessarily.
 */
const createContext = async () => {
  if (contextCache) {
    return contextCache;
  }

  // Get auth session
  const session = await auth();

  // Create and cache the tRPC context
  contextCache = createTRPCContext({
    auth: session,
  });

  return contextCache;
};

/**
 * Pre-instantiated tRPC caller for use in React Server Components
 */
export const getApi = async () => {
  if (!apiCache) {
    apiCache = createCaller(await createContext());
  }
  return apiCache;
};

// Optional: Reset cache function for testing or specific use cases
export const resetApiCache = () => {
  contextCache = null;
  apiCache = null;
};