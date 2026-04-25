const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://creditvault.org",
  "https://www.creditvault.org",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith(".vercel.app") || origin.endsWith(".onrender.com"))
        return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/banking", require("./routes/banking"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// Connect DB and start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);

      // ── Keep-alive ping ────────────────────────────────────────────────
      // Render free tier spins down after 15 min of inactivity.
      // Ping our own health endpoint every 14 minutes to stay awake.
      const BACKEND_URL =
        process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      setInterval(
        async () => {
          try {
            const http = require("http");
            const https = require("https");
            const url = `${BACKEND_URL}/api/health`;
            const client = url.startsWith("https") ? https : http;
            client
              .get(url, (res) => {
                console.log(`Keep-alive ping → ${res.statusCode}`);
              })
              .on("error", (err) => {
                console.warn("Keep-alive ping failed:", err.message);
              });
          } catch (e) {
            console.warn("Keep-alive error:", e.message);
          }
        },
        5 * 60 * 1000,
      ); // every 5 minutes
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
