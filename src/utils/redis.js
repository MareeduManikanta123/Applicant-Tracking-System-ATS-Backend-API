import { Redis } from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // 🔥 REQUIRED for BullMQ
});

export default redis;
