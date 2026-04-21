const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    plainPassword: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Account info
    accountNumber: { type: String, unique: true },
    routingNumber: { type: String, default: "021000021" }, // Chase default
    accountType: {
      type: String,
      enum: ["checking", "savings"],
      default: "checking",
    },

    // Balances
    balance: { type: Number, default: 0 },
    savingsBalance: { type: Number, default: 0 },

    // Profile
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "US" },
    profilePhoto: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    ssn: { type: String, default: "" }, // last 4 digits only

    // Stats
    totalDeposited: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    totalTransferred: { type: Number, default: 0 },

    // OTP / auth
    otp: { type: String },
    otpExpire: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetExpire: { type: Date },

    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],

    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Generate account number before save
userSchema.pre("save", function (next) {
  if (!this.accountNumber) {
    // 10-digit account number
    this.accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000,
    ).toString();
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
