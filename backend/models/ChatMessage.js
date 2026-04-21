const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: String, enum: ["user", "admin"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
