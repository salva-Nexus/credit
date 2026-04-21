const router = require("express").Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");
const {
  sendEmail,
  notifyAdmin,
  transactionTemplate,
} = require("../utils/emailTemplates");

// ── DEPOSIT REQUEST ───────────────────────────────────────────────────────────
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount, method = "Wire Transfer", memo = "" } = req.body;
    const num = parseFloat(amount);
    if (!num || num <= 0)
      return res.status(400).json({ msg: "Invalid amount." });

    const user = await User.findById(req.user.id);
    const tx = new Transaction({
      user: user._id,
      type: "deposit",
      amount: num,
      method,
      memo,
      status: "pending",
      balanceAfter: user.balance,
    });
    await tx.save();
    user.transactions.push(tx._id);
    await user.save();

    notifyAdmin(
      `💰 Deposit Request — ${user.fullName}`,
      `<p style="font-family:sans-serif;"><strong>${user.fullName}</strong> (${user.email}) requested a deposit of <strong>$${num.toLocaleString()}</strong> via ${method}.</p>`,
    );

    res.json({
      msg: "Deposit request submitted. Your funds will be credited after review.",
      txId: tx._id,
    });
  } catch (err) {
    res.status(500).json({ msg: "Deposit request failed." });
  }
});

// ── WITHDRAWAL REQUEST ────────────────────────────────────────────────────────
router.post("/withdraw", auth, async (req, res) => {
  try {
    const {
      amount,
      method = "Wire Transfer",
      memo = "",
      bankName = "",
      accountNumber = "",
    } = req.body;
    const num = parseFloat(amount);
    if (!num || num <= 0)
      return res.status(400).json({ msg: "Invalid amount." });

    const user = await User.findById(req.user.id);
    if (user.balance < num)
      return res.status(400).json({ msg: "Insufficient funds." });

    const tx = new Transaction({
      user: user._id,
      type: "withdrawal",
      amount: num,
      method,
      memo,
      recipientBank: bankName,
      recipientAccount: accountNumber,
      status: "pending",
      balanceAfter: user.balance - num,
    });
    await tx.save();
    user.transactions.push(tx._id);
    await user.save();

    notifyAdmin(
      `📤 Withdrawal Request — ${user.fullName}`,
      `<p style="font-family:sans-serif;"><strong>${user.fullName}</strong> (${user.email}) requested withdrawal of <strong>$${num.toLocaleString()}</strong> via ${method}.</p>`,
    );

    res.json({
      msg: "Withdrawal request submitted. Processing within 1–3 business days.",
      txId: tx._id,
    });
  } catch {
    res.status(500).json({ msg: "Withdrawal request failed." });
  }
});

// ── TRANSFER ──────────────────────────────────────────────────────────────────
router.post("/transfer", auth, async (req, res) => {
  try {
    const {
      amount,
      transferType,
      recipientName,
      recipientCountry,
      memo = "",
      // Local fields
      routingNumber,
      bankName,
      bankAddress,
      recipientAddress,
      accountType,
      // International fields
      accountNumber,
      swiftCode,
      iban,
      bankCode,
      bsb,
      ifsc,
      sortCode,
      transitNumber,
    } = req.body;

    const num = parseFloat(amount);
    if (!num || num <= 0)
      return res.status(400).json({ msg: "Invalid amount." });
    if (!recipientName)
      return res.status(400).json({ msg: "Recipient name is required." });

    // International minimum: $50,000
    if (transferType === "international" && num < 50000) {
      return res
        .status(400)
        .json({ msg: "International transfers require a minimum of $50,000." });
    }

    const user = await User.findById(req.user.id);
    if (user.balance < num)
      return res.status(400).json({ msg: "Insufficient funds." });

    // Assemble recipient details for record
    const recipientAccount = accountNumber || routingNumber || iban || "";
    const recipientBankName = bankName || swiftCode || "";

    const tx = new Transaction({
      user: user._id,
      type: "transfer_out",
      amount: num,
      transferType,
      recipientName,
      recipientCountry: recipientCountry || "US",
      recipientAccount,
      recipientBank: recipientBankName,
      memo,
      status: "pending",
      balanceAfter: user.balance - num,
    });
    await tx.save();
    user.transactions.push(tx._id);
    await user.save();

    notifyAdmin(
      `🔀 Transfer Request — ${user.fullName}`,
      `<p style="font-family:sans-serif;">
        <strong>${user.fullName}</strong> (${user.email}) initiated a
        <strong>${transferType}</strong> transfer of <strong>$${num.toLocaleString()}</strong>
        to <strong>${recipientName}</strong> (${recipientCountry}).
      </p>`,
    );

    const detailMap = {
      Amount: `$${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      Type:
        transferType === "international"
          ? "International Wire"
          : "Domestic Transfer",
      Recipient: recipientName,
      Status: "Pending Review",
    };
    if (memo) detailMap["Memo"] = memo;

    await sendEmail(
      user.email,
      "Transfer Initiated",
      transactionTemplate(user.fullName, "Debit — Transfer", num, detailMap),
    );

    res.json({
      msg: "Transfer submitted. Processing within 1–3 business days.",
      txId: tx._id,
    });
  } catch (err) {
    console.error("Transfer error:", err.message);
    res.status(500).json({ msg: "Transfer failed." });
  }
});

// ── TRANSACTION HISTORY ───────────────────────────────────────────────────────
router.get("/transactions", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { user: req.user.id };
    if (type) filter.type = type;

    const txs = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);
    res.json({ transactions: txs, total, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ msg: "Failed to fetch transactions." });
  }
});

module.exports = router;
