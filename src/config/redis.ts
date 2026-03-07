import Redis from 'ioredis';
import { env } from './env';

let redis: any;

if (env.REDIS_URL) {
  redis = new Redis(env.REDIS_URL);

  redis.on('error', (err: any) => {
    console.warn('⚠️ Redis Error (Attempting Reconnect):', err.message);
  });

  redis.on('connect', () => {
    console.log('✅ Successfully connected to Redis');
  });
} else {
  // Graceful no-op fallback for environments without Redis (like some Render tiers)
  console.log('ℹ️ Redis URL not found. Running in no-cache mode.');
  redis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 0,
    on: () => {}, // mock event listener
  };
}

export default redis;
