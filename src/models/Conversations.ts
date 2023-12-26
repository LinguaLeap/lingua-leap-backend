import mongoose from "mongoose";

const conversationsSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            unique: true,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

conversationsSchema.index({ participants: 1 });

const Conversations = mongoose.model("Conversations", conversationsSchema);

export default Conversations;
