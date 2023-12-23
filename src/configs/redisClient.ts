import Redis from "ioredis";

const client = new Redis(
    Number(process.env.REDIS_PORT),
    process.env.REDIS_HOST || "",
    {
        password: process.env.REDIS_PASSWORD || "",
    }
);

export const storeToken = (userId: string, token: string): void => {
    client.set(userId, token, "EX", 180 * 24 * 60 * 60);
};

export const getToken = (userId: string): Promise<string | null> => {
    return new Promise((resolve) => {
        (client as any).get(userId, (err: any, reply: any) => {
            if (err) {
                resolve(null);
            } else {
                resolve(reply);
            }
        });
    });
};
