import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import client from "../configs/redisClient";
import { socketMiddleware } from "../middlewares/SocketIO";
import Users from "./lib/Users";
import Conversations from "../models/Conversations";
import Messages from "../models/Messages";
import mongoose from "mongoose";

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

    socket.on("sendMessage", async ({ toUserId, message }) => {
        const isOnline = io.sockets.adapter.rooms.get(toUserId);
        const participants = [
            new mongoose.Types.ObjectId(toUserId),
            new mongoose.Types.ObjectId(socket.data.user._id),
        ].sort();

        const conversation = await Conversations.findOneAndUpdate(
            {
                participants: participants,
            },
            { $setOnInsert: { participants: participants } },
            { upsert: true, new: true }
        );

        if (conversation) {
            const messageData = {
                conversationId: conversation._id,
                senderId: socket.data.user._id,
                status: isOnline ? 1 : 0,
                content: message,
            };

            const savedMessage = await Messages.create(messageData);

            io.to(toUserId).emit("receiveMessage", {
                fromUser: socket.data.user,
                message: savedMessage.toObject(),
            });
        }
    });

    socket.on("disconnect", () => {
        Users.remove(socket.data.user._id);

        Users.list((users: any) => {
            io.emit("onlineList", users);
        });
    });
});

export default io;
