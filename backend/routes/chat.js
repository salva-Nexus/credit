const router = require("express").Router();
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/send", auth, async (req, res) => {
  try {
    const { message, recipientId } = req.body;
    if (!message?.trim())
      return res.status(400).json({ msg: "Empty message." });
    const sender = await User.findById(req.user.id);
    const targetUserId = sender.role === "admin" ? recipientId : req.user.id;
    const msg = new ChatMessage({
      user: targetUserId,
      sender: sender.role === "admin" ? "admin" : "user",
      message: message.trim(),
    });
    await msg.save();
    res.json({ msg: "Sent.", message: msg });
  } catch {
    res.status(500).json({ msg: "Send failed." });
  }
});

router.put("/message/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin")
      return res.status(403).json({ msg: "Admin only." });
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: "Not found." });
    msg.message = req.body.message.trim();
    msg.edited = true;
    await msg.save();
    res.json({ msg: "Updated.", message: msg });
  } catch {
    res.status(500).json({ msg: "Edit failed." });
  }
});

router.get("/messages", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userId =
      user.role === "admin" && req.query.userId
        ? req.query.userId
        : req.user.id;
    const messages = await ChatMessage.find({ user: userId }).sort({
      createdAt: 1,
    });
    if (user.role === "admin" && req.query.userId) {
      await ChatMessage.updateMany(
        { user: userId, sender: "user", read: false },
        { read: true },
      );
    }
    res.json(messages);
  } catch {
    res.status(500).json({ msg: "Fetch failed." });
  }
});

router.put("/mark-read", auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { user: req.user.id, sender: "admin", read: false },
      { read: true },
    );
    res.json({ msg: "Marked." });
  } catch {
    res.status(500).json({ msg: "Failed." });
  }
});

router.get("/unread-count", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const count =
      user.role === "admin"
        ? await ChatMessage.countDocuments({ sender: "user", read: false })
        : await ChatMessage.countDocuments({
            user: req.user.id,
            sender: "admin",
            read: false,
          });
    res.json({ unreadCount: count });
  } catch {
    res.status(500).json({ msg: "Failed." });
  }
});

router.get("/conversations", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin")
      return res.status(403).json({ msg: "Admin only." });
    const convos = await ChatMessage.aggregate([
      {
        $group: {
          _id: "$user",
          lastMessage: { $last: "$message" },
          lastDate: { $last: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sender", "user"] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastDate: -1 } },
    ]);
    await User.populate(convos, { path: "_id", select: "fullName email" });
    res.json(convos);
  } catch {
    res.status(500).json({ msg: "Failed." });
  }
});

module.exports = router;