import { Redis } from "ioredis";

const client = new Redis(
    Number(process.env.REDIS_PORT),
    process.env.REDIS_HOST || "",
    {
        password: process.env.REDIS_PASSWORD || "",
    }
);

export default client;
