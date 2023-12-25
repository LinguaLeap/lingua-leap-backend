import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import client from "../configs/redisClient";

const io = new Server({
    cors: {
        origin: "*",
    },
});

const subClient = client.duplicate();

io.adapter(createAdapter(client, subClient));

export default io;
