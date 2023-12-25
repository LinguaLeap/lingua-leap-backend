
import { Redis } from "ioredis";

const client = new Redis(
    Number(process.env.REDIS_PORT),
    process.env.REDIS_HOST || "",
    {
        password: process.env.REDIS_PASSWORD || "",
    }
);

/*  import { RedisClientType, createClient } from "redis";

    const client = createClient({
    password: process.env.REDIS_PASSWORD || "",
    socket: {
        host: process.env.REDIS_HOST || "",
        port: Number(process.env.REDIS_PORT),
    },
}); */

export default client;