import { emailQueue } from "./queues/email.queue.js";

await emailQueue.add("send-email", {
  to: "test@example.com",
  subject: "Test email",
  text: "This is a test email",
});

console.log("✅ Test job added to queue");
process.exit(0);
