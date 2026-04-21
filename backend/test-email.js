require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("Password loaded:", process.env.GMAIL_APP_PASSWORD ? "YES" : "NO");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "creditvault.support@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

console.log("Testing port 465...");
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ Port 465 failed:", err.message);
    console.log("\nTrying port 2525 as last resort...");
    const t2 = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 2525,
      secure: false,
      auth: {
        user: "creditvault.support@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    t2.verify((e2) => {
      if (e2)
        console.log(
          "❌ Port 2525 also failed:",
          e2.message,
          "\n\nAll Gmail SMTP ports are blocked on your network. Use a VPN or switch to Resend.com.",
        );
      else console.log("✅ Port 2525 works!");
    });
  } else {
    console.log("✅ Port 465 works! Sending test...");
    transporter.sendMail(
      {
        from: '"Credit Vault" <creditvault.support@gmail.com>',
        to: "creditvault.support@gmail.com",
        subject: "SMTP Test — Credit Vault",
        text: "Port 465 is working.",
      },
      (e, info) => {
        if (e) console.log("❌ Send failed:", e.message);
        else console.log("✅ Email sent successfully:", info.response);
      },
    );
  }
});
