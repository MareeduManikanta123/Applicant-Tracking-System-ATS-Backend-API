import { emailQueue } from "../queues/email.queue.js";

export async function sendEmailAsync({ to, subject, text }) {
  await emailQueue.add("send-email", {
    to,
    subject,
    text,
  });
}
