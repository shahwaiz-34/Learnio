import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
if (url && token) {
  redis = new Redis({ url, token });
} else {
  // Environment variables not set — running without Upstash.
  // This is intentional for local development; callers should
  // handle a null redis and provide fallbacks where appropriate.
  // Avoid throwing here to keep local dev flows working.
  // eslint-disable-next-line no-console
  console.warn(
    "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — Upstash disabled.",
  );
}

export default redis;
