import { NextFunction, Request, Response } from "express";
import Conversations from "../models/Conversations";
import Messages from "../models/Messages";
import mongoose from "mongoose";
import { UserType } from "../types/UserType";
import boom from "@hapi/boom";

const limit = 30;

export const GetMessagesFromConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const conversationId = new mongoose.Types.ObjectId(req.body.conversationId);
    const userId = new mongoose.Types.ObjectId((req.user as UserType)._id);
    const page = parseInt(req.body.page as string) || 1;

    const startIndex = (page - 1) * limit;

    try {
        const conversation = await Conversations.find({
            _id: conversationId,
            participants: userId,
        });

        if (conversation.length === 0) {
            return next(boom.notFound("Conversation is not found"));
        }

        const messages = await Messages.find({ conversationId })
            .sort({ timestamp: -1 })
            .skip(startIndex)
            .limit(limit);

        await Messages.updateMany(
            {
                conversationId: conversationId,
                senderId: { $ne: userId },
                status: { $lt: 2 },
            },
            { $set: { status: 2 } }
        );

        const totalMessages = await Messages.countDocuments({ conversationId });
        const totalPages = Math.ceil(totalMessages / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        const result = {
            messages,
            pageInfo: {
                page,
                totalPages,
                totalMessages,
                limit,
                nextPage,
                prevPage,
            },
        };

        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const GetConversationsList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = new mongoose.Types.ObjectId((req.user as UserType)._id);

        const userConversations = await Conversations.find({
            participants: userId,
        })
            .populate({
                path: "participants",
                model: "User",
                select: "_id displayName familyName givenName",
            })
            .sort({ createdAt: -1 });

        const conversationsWithLastMessage = await Promise.all(
            userConversations.map(async (conversation) => {
                const lastMessage = await Messages.findOne({
                    conversationId: conversation._id,
                })
                    .sort({ timestamp: -1 })
                    .populate({
                        path: "senderId",
                        model: "User",
                        select: "_id displayName familyName givenName",
                    });

                const unseenMessageCount = await Messages.countDocuments({
                    conversationId: conversation._id,
                    senderId: { $ne: userId },
                    status: { $lt: 2 },
                });

                await Messages.updateMany(
                    {
                        conversationId: conversation._id,
                        senderId: { $ne: userId },
                        status: 0,
                    },
                    { $set: { status: 1 } }
                );

                return {
                    conversation: {
                        ...conversation.toObject(),
                    },
                    lastMessage: {
                        ...lastMessage?.toObject(),
                    },
                    unseenMessageCount,
                };
            })
        );

        conversationsWithLastMessage.sort((a, b) => {
            const aTimestamp = Number(a.lastMessage?.timestamp) || 0;
            const bTimestamp = Number(b.lastMessage?.timestamp) || 0;
            return bTimestamp - aTimestamp;
        });

        conversationsWithLastMessage.sort((a, b) => {
            const aUnseenCount = a.unseenMessageCount;
            const bUnseenCount = b.unseenMessageCount;
            return bUnseenCount - aUnseenCount;
        });

        res.json(conversationsWithLastMessage);
    } catch (error) {
        console.error("Error fetching conversations:", error);
    }
};
