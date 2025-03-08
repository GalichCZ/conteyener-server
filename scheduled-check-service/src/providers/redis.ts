import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

export default client; 