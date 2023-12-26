import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    content: { type: String, maxLength: 2000 },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

messagesSchema.index({ conversationId: 1, timestamp: 1 });

const Messages = mongoose.model("Messages", messagesSchema);

export default Messages;
