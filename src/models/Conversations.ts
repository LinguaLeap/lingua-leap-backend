import mongoose from "mongoose";

const conversationsSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

conversationsSchema.index({ participants: 1 });

const Conversations = mongoose.model("Conversation", conversationsSchema);

export default Conversations;
