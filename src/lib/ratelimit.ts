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
  // Cast the real Ratelimit to the minimal shape for consumers in this
  // repo. This avoids exporting inside a conditional block which
  // TypeScript disallows.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "60 s"),
  }) as unknown as MinimalRatelimit;
}

export default ratelimit;
