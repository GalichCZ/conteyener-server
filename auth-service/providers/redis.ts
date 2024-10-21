import {createClient, RedisClientType} from "redis";
import dotenv from "dotenv";

dotenv.config();

const client: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

export default client;
