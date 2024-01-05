import { NextFunction, Request, Response } from "express";
import Conversations from "../models/Conversations";
import Messages from "../models/Messages";
import User from "../models/User";

export const SampleData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await createUsers();
    await createRandomConversations();
    await createMessagesForConversations();
    res.json({ message: "ok" });
};

export const createUsers = async () => {
    try {
        const userData = [
            {
                familyName: "Dilaver",
                givenName: "Muhammed",
                emails: [{ value: "dilaver@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "TR",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
            {
                familyName: "Swift",
                givenName: "Taylor",
                emails: [{ value: "taylorswift@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "US",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
            {
                familyName: "Smith",
                givenName: "Cathy",
                emails: [{ value: "cathysmith@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "UK",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
            {
                familyName: "Green",
                givenName: "Mary",
                emails: [{ value: "marygreeen@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "FR",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
            {
                familyName: "Brown",
                givenName: "Jack",
                emails: [{ value: "jackbrown@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "IT",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
            {
                familyName: "Doe",
                givenName: "John",
                emails: [{ value: "johndoe@google.com" }],
                gender: 1,
                birthDate: "2023-12-26T03:57:58.026+00:00",
                country: "BR",
                password: "123456",
                mainLanguage: ["EN"],
                otherLanguages: [{ language: "IT", level: 2 }],
            },
        ];

        for (const userDataItem of userData) {
            const user = new User(userDataItem);
            const savedData = await user.save();
        }

        console.log("Users created successfully!");
    } catch (error) {
        console.error("Error creating users:", error);
    }
};

export const createRandomConversations = async () => {
    try {
        const users = await User.find();

        const createdConversations = new Set();

        const targetConversationCount = 15;
        while (createdConversations.size < targetConversationCount) {
            const [user1, user2] = sampleTwoDistinctUsers(users);

            const conversationParticipants = [user1._id, user2._id].sort();
            const conversationExists = Array.from(createdConversations).some(
                (existingParticipants) =>
                    arraysEqual(existingParticipants, conversationParticipants)
            );

            if (!conversationExists) {
                const conversation = await Conversations.create({
                    participants: conversationParticipants,
                });
                createdConversations.add(conversationParticipants);
            }
        }

        console.log("Random conversations created successfully!");
    } catch (error) {
        console.error("Error creating random conversations:", error);
    } finally {
    }
};

export const createMessagesForConversations = async () => {
    try {
        const conversations = await Conversations.find();

        for (const conversation of conversations) {
            const participants = conversation.participants;

            for (let i = 0; i < 500; i++) {
                const randomSenderIndex = Math.floor(
                    Math.random() * participants.length
                );
                const randomSenderId = participants[randomSenderIndex];

                const message = {
                    conversationId: conversation._id,
                    senderId: randomSenderId,
                    status: 2,
                    content: `Sample message ${
                        Math.floor(Math.random() * 999999) + 1
                    }`,
                };

                await Messages.create(message);
            }
        }

        console.log("Messages created successfully!");
    } catch (error) {
        console.error("Error creating messages:", error);
    }
};

const sampleTwoDistinctUsers = (users: any) => {
    const randomIndex1 = Math.floor(Math.random() * users.length);
    let randomIndex2 = Math.floor(Math.random() * users.length);

    while (randomIndex1 === randomIndex2) {
        randomIndex2 = Math.floor(Math.random() * users.length);
    }

    return [users[randomIndex1], users[randomIndex2]];
};

const arraysEqual = (arr1: any, arr2: any) =>
    arr1.every((val: any, index: any) => val === arr2[index]);
