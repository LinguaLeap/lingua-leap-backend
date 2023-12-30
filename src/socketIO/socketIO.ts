import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import client from "../configs/redisClient";
import { socketMiddleware } from "../middlewares/SocketIO";
import Users from "./lib/Users";

const io = new Server({
    cors: {
        origin: "*",
    },
});

const subClient = client.duplicate();

io.adapter(createAdapter(client, subClient));

io.use(socketMiddleware);

io.on("connection", (socket) => {
    Users.upsert(socket.id, socket.data.user);

    Users.list((users: any) => {
        io.emit("onlineList", users);
    });

    socket.join(socket.data.user._id);

    socket.on("sendMessage", ({ toUserId, message }) => {
        // @ts-ignore
        const room = io.sockets.adapter.rooms.get(toUserId);
        console.log(socket.data.user._id)
        io.to(toUserId).emit("receiveMessage", {
            fromUser: socket.data.user,
            message,
        });
    });

    socket.on("disconnect", () => {
        Users.remove(socket.data.user._id);

        Users.list((users: any) => {
            io.emit("onlineList", users);
        });
    });
});

export default io;
