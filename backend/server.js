// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "https://creditvault.org",
      "https://www.creditvault.org",
      "http://localhost:5173",
      "http://localhost:3000",
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── DATABASE CONNECTION WITH CACHING (Vercel serverless safe) ─────────────────
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        family: 4,
      })
      .then((m) => {
        console.log("✅ MongoDB Connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("❌ MongoDB Connection Error:", err.message);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

// Keep Atlas connection warm — ping every 4 minutes
setInterval(async () => {
  try {
    await mongoose.connection.db.admin().ping();
    console.log("🏓 DB keep-alive ping");
  } catch (err) {
    console.warn("Keep-alive ping failed:", err.message);
  }
}, 4 * 60 * 1000); // every 4 minutes

// Ensure DB is ready before any route handler runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res
      .status(503)
      .json({ msg: "Database unavailable. Please retry in a moment." });
  }
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/banking", require("./routes/banking"));
app.use("/api/admin", require("./routes/admin"));

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState,
    ts: Date.now(),
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

// ── ERROR HANDLER ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ msg: "Internal server error" });
});

// ── START (local dev only) ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
