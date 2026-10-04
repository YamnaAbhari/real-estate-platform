import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },
    lastMessageAt: {
      type: Date,
    },
    deletedByBuyer: {
      type: Boolean,
      default: false,
    },

    deletedBySeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

chatSchema.index({ buyerId: 1, sellerId: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
