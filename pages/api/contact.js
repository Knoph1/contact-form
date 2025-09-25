import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Save to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2️⃣ Send Email with Resend
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Replace with verified domain/email
      to: "your.email@example.com", // Your personal email
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error saving/sending message:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
}



import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Save to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2️⃣ Send Email Notification to YOU
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Replace with verified domain/email
      to: "your.email@example.com", // Your personal email
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 3️⃣ Auto-Reply to the Sender
    await resend.emails.send({
      from: "Knoph Ayieko <onboarding@resend.dev>", // Use your verified domain/email
      to: email, // Send to visitor’s email
      subject: "✅ Thank you for contacting me!",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for reaching out to me via my portfolio website.</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>Knoph Oluoch Ayieko</strong></p>
        <p>Web Developer | IT Specialist</p>
      `,
    });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error saving/sending message:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
}



import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Save new message (default statuses = "pending")
    let newMessage = await Message.create({ name, email, message });

    // 2️⃣ Send Email to YOU
    try {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "your.email@example.com", // Replace with your email
        subject: "📩 New Contact Form Submission",
        html: `
          <h2>New Message from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      newMessage.deliveryStatus.toOwner = "success";
    } catch (error) {
      console.error("Error sending to owner:", error);
      newMessage.deliveryStatus.toOwner = "failed";
    }

    // 3️⃣ Send Auto-Reply to Sender
    try {
      await resend.emails.send({
        from: "Knoph Ayieko <onboarding@resend.dev>",
        to: email,
        subject: "✅ Thank you for contacting me!",
        html: `
          <h2>Hello ${name},</h2>
          <p>Thank you for reaching out via my portfolio website.</p>
          <p>I have received your message and will get back to you soon.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>Knoph Oluoch Ayieko</strong></p>
          <p>Web Developer | IT Specialist</p>
        `,
      });

      newMessage.deliveryStatus.toSender = "success";
    } catch (error) {
      console.error("Error sending to sender:", error);
      newMessage.deliveryStatus.toSender = "failed";
    }

    // 4️⃣ Save updated delivery status
    await newMessage.save();

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
}





import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = await Message.create({ name, email, message });

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
}
