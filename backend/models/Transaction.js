const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer_out", "transfer_in", "fee"],
      required: true,
    },
    amount: { type: Number, required: true },

    // Transfer details
    recipientName: { type: String, default: "" },
    recipientAccount: { type: String, default: "" },
    recipientBank: { type: String, default: "" },
    recipientCountry: { type: String, default: "" },
    transferType: {
      type: String,
      enum: ["local", "international", ""],
      default: "",
    },
    memo: { type: String, default: "" },

    // Deposit / withdrawal details
    method: { type: String, default: "" }, // wire, ach, card, etc.
    reference: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },

    // Running balance after this transaction
    balanceAfter: { type: Number, default: 0 },

    date: { type: Date, default: Date.now },
    processedAt: { type: Date },

    // Admin note
    adminNote: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
