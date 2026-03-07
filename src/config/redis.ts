import Redis from 'ioredis';
import { env } from './env';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

export default redis;
