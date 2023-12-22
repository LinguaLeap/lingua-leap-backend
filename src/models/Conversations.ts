import mongoose from "mongoose";

const conversationsSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      unique: true,
    },
  ],
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true,
      },
      content: { type: String, maxLength: 2000 },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createAt: { type: Date, default: Date.now },
});

const Conversations = mongoose.model("Conversations", conversationsSchema);

export default Conversations;
