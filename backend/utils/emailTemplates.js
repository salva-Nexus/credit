const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "creditvault.support@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

const BANK_NAME = "Credit Vault";
const BRAND_COLOR = "#1a3c5e";

const baseWrap = (content) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08);">
    <div style="background: ${BRAND_COLOR}; padding: 28px 32px;">
      <h1 style="margin:0; color:white; font-size:20px; font-weight:700; letter-spacing:-0.3px;">
        ${BANK_NAME}
      </h1>
      <p style="margin:4px 0 0; color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">
        Secure Banking Notification
      </p>
    </div>
    <div style="padding: 32px;">
      ${content}
    </div>
    <div style="padding: 20px 32px; background: #f8f9fb; border-top: 1px solid #e8ecf0;">
      <p style="margin:0; font-size:11px; color:#94a3b8; line-height:1.6;">
        This is an automated message from ${BANK_NAME}. Do not reply to this email.
        If you did not initiate this action, please contact us immediately at
        <a href="mailto:${"creditvault.support@gmail.com"}" style="color:${BRAND_COLOR};">${"creditvault.support@gmail.com"}</a>.
      </p>
    </div>
  </div>
</div>`;

const otpTemplate = (name, otp, action = "verify your account") =>
  baseWrap(`
  <h2 style="margin:0 0 8px; color:#0f172a; font-size:22px; font-weight:700;">Security Code</h2>
  <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
    Hello ${name}, use the code below to ${action}. This code expires in <strong>10 minutes</strong>.
  </p>
  <div style="background:#f1f5f9; border:2px dashed #cbd5e1; border-radius:10px; padding:28px; text-align:center; margin-bottom:24px;">
    <p style="margin:0 0 6px; font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.1em;">One-Time Code</p>
    <h2 style="margin:0; font-size:44px; font-weight:800; color:${BRAND_COLOR}; letter-spacing:0.3em; font-family:monospace;">${otp}</h2>
  </div>
  <p style="margin:0; font-size:13px; color:#94a3b8;">
    Never share this code with anyone — ${BANK_NAME} will never ask for it.
  </p>
`);

const welcomeTemplate = (name, accountNumber, routingNumber) =>
  baseWrap(`
  <h2 style="margin:0 0 8px; color:#0f172a; font-size:22px; font-weight:700;">Welcome to ${BANK_NAME}</h2>
  <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.7;">
    Hi ${name}, your account has been created successfully. Here are your account details:
  </p>
  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:24px; margin-bottom:24px;">
    <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #e2e8f0;">
      <span style="font-size:13px; color:#64748b;">Account Number</span>
      <span style="font-size:13px; font-weight:700; color:#0f172a; font-family:monospace;">${accountNumber}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:12px 0;">
      <span style="font-size:13px; color:#64748b;">Routing Number</span>
      <span style="font-size:13px; font-weight:700; color:#0f172a; font-family:monospace;">${routingNumber}</span>
    </div>
  </div>
  <a href="https://creditvault.app/signin" style="display:inline-block; background:${BRAND_COLOR}; color:white; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
    Sign in to your account →
  </a>
`);

const transactionTemplate = (name, type, amount, details) =>
  baseWrap(`
  <h2 style="margin:0 0 8px; color:#0f172a; font-size:22px; font-weight:700;">Transaction Notification</h2>
  <p style="margin:0 0 24px; color:#64748b; font-size:14px;">
    Hi ${name}, here's a summary of your recent transaction.
  </p>
  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:24px; margin-bottom:20px;">
    <div style="text-align:center; padding-bottom:18px; border-bottom:1px solid #e2e8f0; margin-bottom:18px;">
      <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#64748b;">${type}</p>
      <p style="margin:0; font-size:36px; font-weight:800; color:${type.includes("Credit") ? "#16a34a" : "#dc2626"};">
        ${type.includes("Credit") ? "+" : "-"}$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
    ${Object.entries(details)
      .map(
        ([k, v]) => `
    <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f1f5f9;">
      <span style="font-size:13px; color:#64748b;">${k}</span>
      <span style="font-size:13px; font-weight:600; color:#0f172a;">${v}</span>
    </div>`,
      )
      .join("")}
  </div>
`);

async function sendEmail(to, subject, html) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${BANK_NAME}" <${"creditvault.support@gmail.com"}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }
}

async function notifyAdmin(subject, html) {
  await sendEmail("creditvault.support@gmail.com", subject, html);
}

module.exports = {
  sendEmail,
  notifyAdmin,
  otpTemplate,
  welcomeTemplate,
  transactionTemplate,
  BANK_NAME,
  BRAND_COLOR,
};
