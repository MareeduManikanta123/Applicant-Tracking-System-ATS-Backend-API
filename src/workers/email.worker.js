import "dotenv/config";
import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import nodemailer from "nodemailer";

console.log("🚀 Email Worker started...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  "emailQueue",
  async (job) => {
    console.log("📨 Email job received:", job.data);

    try {
      const { to, subject, text } = job.data;

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error("❌ EMAIL ERROR FULL:", err);
    }
  },
  { connection: redis }
);
