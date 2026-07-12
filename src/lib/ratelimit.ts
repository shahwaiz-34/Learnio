import { Ratelimit } from "@upstash/ratelimit";
import redis from "./radis";

type MinimalRatelimit = {
  limit: (key: string) => Promise<{ success: boolean }>;
};

let ratelimit: MinimalRatelimit;

if (!redis) {
  ratelimit = {
    limit: async (_key: string) => ({ success: true }),
  };
} else {
  try {
    const client = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
    }) as unknown as MinimalRatelimit;

    ratelimit = {
      limit: async (key: string) => {
        try {
          return await client.limit(key);
        } catch (error) {
          console.warn(
            "Upstash rate limiting failed, allowing request through:",
            error,
          );
          return { success: true };
        }
      },
    };
  } catch (error) {
    console.warn(
      "Failed to initialize Upstash rate limiting, falling back to no-op:",
      error,
    );
    ratelimit = {
      limit: async (_key: string) => ({ success: true }),
    };
  }
}

export default ratelimit;
