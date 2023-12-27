import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    content: { type: String, maxLength: 6000 },
    status: {
        type: Number,
        default: 0, // 0: not transmitted, 1: transmitted, 2: seen
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

messagesSchema.index({ conversationId: 1, timestamp: 1 });

const Messages = mongoose.model("Message", messagesSchema);

export default Messages;
