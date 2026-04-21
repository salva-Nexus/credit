const router = require("express").Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const admin = require("../middleware/admin");
const { sendEmail, transactionTemplate } = require("../utils/emailTemplates");

// ── GET ALL USERS ─────────────────────────────────────────────────────────────
router.get("/users", admin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ msg: "Failed to fetch users." });
  }
});

// ── GET SINGLE USER ───────────────────────────────────────────────────────────
router.get("/user/:id", admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({ path: "transactions", options: { sort: { date: -1 } } });
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Failed to fetch user." });
  }
});

// ── UPDATE USER BALANCE ───────────────────────────────────────────────────────
router.put("/user/:id/balance", admin, async (req, res) => {
  try {
    const { balance, savingsBalance } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (balance !== undefined) user.balance = parseFloat(balance);
    if (savingsBalance !== undefined)
      user.savingsBalance = parseFloat(savingsBalance);
    await user.save();
    res.json({ msg: "Balance updated.", balance: user.balance });
  } catch {
    res.status(500).json({ msg: "Update failed." });
  }
});

// ── UPDATE USER PROFILE ───────────────────────────────────────────────────────
router.put("/user/:id/profile", admin, async (req, res) => {
  try {
    const fields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "accountType",
      "accountNumber",
      "routingNumber",
      "isVerified",
      "totalDeposited",
      "totalWithdrawn",
    ];
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    await user.save();
    res.json({ msg: "Profile updated.", user });
  } catch {
    res.status(500).json({ msg: "Update failed." });
  }
});

// ── EDIT TRANSACTION DATE ─────────────────────────────────────────────────────
router.put("/transaction/:txId/edit", admin, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ msg: "Date is required." });

    const newDate = new Date(date);
    if (isNaN(newDate.getTime()))
      return res.status(400).json({ msg: "Invalid date." });

    const tx = await Transaction.findByIdAndUpdate(
      req.params.txId,
      { date: newDate },
      { new: true },
    );
    if (!tx) return res.status(404).json({ msg: "Transaction not found." });

    res.json(tx);
  } catch (err) {
    console.error("Edit transaction error:", err.message);
    res.status(500).json({ msg: "Failed to update transaction." });
  }
});

// ── APPROVE / REJECT TRANSACTION ──────────────────────────────────────────────
router.put("/transaction/:id/:action", admin, async (req, res) => {
  try {
    const { id, action } = req.params;
    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ msg: "Invalid action." });

    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ msg: "Transaction not found." });
    if (tx.status !== "pending")
      return res.status(400).json({ msg: "Transaction already processed." });

    const user = await User.findById(tx.user);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (action === "approve") {
      tx.status = "completed";
      tx.processedAt = new Date();
      if (tx.type === "deposit") {
        user.balance += tx.amount;
        user.totalDeposited += tx.amount;
        tx.balanceAfter = user.balance;
      } else if (tx.type === "withdrawal") {
        if (user.balance < tx.amount)
          return res.status(400).json({ msg: "Insufficient funds." });
        user.balance -= tx.amount;
        user.totalWithdrawn += tx.amount;
        tx.balanceAfter = user.balance;
      } else if (tx.type === "transfer_out") {
        if (user.balance < tx.amount)
          return res.status(400).json({ msg: "Insufficient funds." });
        user.balance -= tx.amount;
        user.totalTransferred += tx.amount;
        tx.balanceAfter = user.balance;
      }
      const typeLabel =
        tx.type === "deposit"
          ? "Credit — Deposit"
          : tx.type === "withdrawal"
            ? "Debit — Withdrawal"
            : "Debit — Transfer";
      const details = {
        "Transaction ID": tx._id.toString().slice(-10).toUpperCase(),
        Amount: `$${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        Status: "Approved & Completed",
        "New Balance": `$${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      };
      if (tx.recipientName) details["Recipient"] = tx.recipientName;
      await sendEmail(
        user.email,
        `Transaction Approved — Credit Vault`,
        transactionTemplate(user.fullName, typeLabel, tx.amount, details),
      );
    } else {
      tx.status = "failed";
      tx.processedAt = new Date();
      if (req.body.note) tx.adminNote = req.body.note;
      await sendEmail(
        user.email,
        `Transaction Update — Credit Vault`,
        transactionTemplate(user.fullName, "Transaction Declined", tx.amount, {
          "Transaction ID": tx._id.toString().slice(-10).toUpperCase(),
          Amount: `$${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          Status: "Declined",
          Reason: req.body.note || "Under review — please contact support",
        }),
      );
    }

    await tx.save();
    await user.save();
    res.json({
      msg: `Transaction ${action === "approve" ? "approved" : "rejected"}.`,
      tx,
    });
  } catch (err) {
    console.error("Transaction action error:", err.message);
    res.status(500).json({ msg: "Action failed." });
  }
});

// ── GET ALL TRANSACTIONS ──────────────────────────────────────────────────────
router.get("/transactions", admin, async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const txs = await Transaction.find(filter)
      .populate("user", "fullName email")
      .sort({ date: -1 })
      .limit(200);
    res.json(txs);
  } catch {
    res.status(500).json({ msg: "Failed." });
  }
});

// ── DELETE USER ───────────────────────────────────────────────────────────────
router.delete("/user/:id", admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Transaction.deleteMany({ user: req.params.id });
    res.json({ msg: "User removed." });
  } catch {
    res.status(500).json({ msg: "Failed to remove user." });
  }
});

// ── ADMIN ADDS TRANSACTION MANUALLY ──────────────────────────────────────────
router.post("/transaction/manual", admin, async (req, res) => {
  try {
    const {
      userId,
      type,
      amount,
      status = "completed",
      memo = "",
      recipientName = "",
    } = req.body;
    const num = parseFloat(amount);
    if (!num || num <= 0)
      return res.status(400).json({ msg: "Invalid amount." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (status === "completed") {
      if (type === "deposit") {
        user.balance += num;
        user.totalDeposited += num;
      } else if (["withdrawal", "transfer_out"].includes(type)) {
        if (user.balance < num)
          return res.status(400).json({ msg: "Insufficient user balance." });
        user.balance -= num;
        if (type === "withdrawal") user.totalWithdrawn += num;
        else user.totalTransferred += num;
      }
    }

    const tx = new Transaction({
      user: user._id,
      type,
      amount: num,
      memo,
      recipientName,
      status,
      balanceAfter: user.balance,
      processedAt: status === "completed" ? new Date() : undefined,
    });
    await tx.save();
    user.transactions.push(tx._id);
    await user.save();
    res.json({ msg: "Manual transaction added.", tx });
  } catch (err) {
    res.status(500).json({ msg: "Failed." });
  }
});

// ── DELETE TRANSACTION ────────────────────────────────────────────────────────
router.delete("/transaction/:txId", admin, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.txId);
    if (!tx) return res.status(404).json({ msg: "Transaction not found." });

    const user = await User.findById(tx.user);
    // Only deduct from balance if it was a completed deposit
    if (user && tx.status === "completed" && tx.type === "deposit") {
      user.balance = Math.max(0, user.balance - tx.amount);
      await user.save();
    }

    await Transaction.findByIdAndDelete(tx._id);
    await User.updateOne({ _id: tx.user }, { $pull: { transactions: tx._id } });

    res.json({ msg: "Transaction deleted." });
  } catch (err) {
    console.error("Delete transaction error:", err.message);
    res.status(500).json({ msg: "Failed to delete transaction." });
  }
});

module.exports = router;
