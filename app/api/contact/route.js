import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Save to MongoDB
    await Message.create({ name, email, message });

    // Send notification email
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "knophayieko@gmail.com", // <-- replace with your email
      subject: "New Contact Form Submission",
      html: `
        <h2>New Message from Portfolio</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}




import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1. Save message in MongoDB
    let newMessage = await Message.create({ name, email, message });

    // Track statuses
    let ownerStatus = "pending";
    let senderStatus = "pending";

    // 2. Try sending notification to YOU
    try {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL,
        subject: `📩 New Contact Message from ${name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <small>Saved to MongoDB at ${new Date().toLocaleString()}</small>
        `,
      });
      ownerStatus = "success";
    } catch (err) {
      console.error("❌ Error sending to owner:", err);
      ownerStatus = "failed";
    }

    // 3. Try sending confirmation to SENDER
    try {
      await resend.emails.send({
        from: "Knoph Ayieko <onboarding@resend.dev>",
        to: email,
        subject: "✅ We received your message!",
        html: `
          <h2>Hi ${name},</h2>
          <p>Thanks for reaching out through my portfolio website! 🙏</p>
          <p>I’ve received your message and will get back to you as soon as possible.</p>
          <p>Here’s a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #ccc; padding-left:10px;">
            ${message}
          </blockquote>
          <br />
          <p>Best regards,</p>
          <p><strong>Knoph Oluoch Ayieko</strong></p>
        `,
      });
      senderStatus = "success";
    } catch (err) {
      console.error("❌ Error sending to sender:", err);
      senderStatus = "failed";
    }

    // 4. Update message with delivery statuses
    newMessage.deliveryStatus.toOwner = ownerStatus;
    newMessage.deliveryStatus.toSender = senderStatus;
    await newMessage.save();

    return NextResponse.json(
      {
        success: true,
        msg: "Message processed successfully!",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in contact API:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}




import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1. Save message in MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2. Send notification email using Resend
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Resend allows "onboarding@resend.dev" by default
      to: process.env.NOTIFICATION_EMAIL, // Your notification email
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <small>Saved to MongoDB at ${new Date().toLocaleString()}</small>
      `,
    });

    return NextResponse.json(
      { success: true, msg: "Message sent successfully!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in contact API:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}




import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1. Save message to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2. Send notification email to you
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL,
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <small>Saved in MongoDB at ${new Date().toLocaleString()}</small>
      `,
    });

    // 3. Send confirmation email to the sender
    await resend.emails.send({
      from: "Knoph Ayieko <onboarding@resend.dev>", // later, replace with your domain email
      to: email,
      subject: "✅ We received your message!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thanks for reaching out through my portfolio website! 🙏</p>
        <p>I’ve received your message and will get back to you as soon as possible.</p>
        <p>Here’s a copy of what you sent:</p>
        <blockquote style="border-left:3px solid #ccc; padding-left:10px;">
          ${message}
        </blockquote>
        <br />
        <p>Best regards,</p>
        <p><strong>Knoph Oluoch Ayieko</strong></p>
      `,
    });

    return NextResponse.json(
      { success: true, msg: "Message sent successfully!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in contact API:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}




import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const newMessage = await Message.create({ name, email, message });

    return NextResponse.json(
      { success: true, msg: "Message sent successfully!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}



import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const data = await resend.emails.send({
      from: 'Portfolio Contact <contact@knoph.dev>',  // Must match your verified domain
      to: 'knophayieko@gmail.com',                    // Where you want to receive messages
      subject: `New Contact Form Message from ${name}`,
      reply_to: email,
      text: `
        You have a new message from your portfolio site:

        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}





import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: "Portfolio Contact <contact@knoph.dev>", // Must match your verified domain
      to: "knophayieko@gmail.com", // Where you want messages delivered
      subject: `New Message from ${name}`,
      reply_to: email,
      text: message,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}






import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactEmailTemplate } from "@/utils/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: "Portfolio Contact <contact@knoph.dev>", // verified sender domain
      to: "knophayieko@gmail.com", // your inbox
      subject: `📬 New Message from ${name}`,
      reply_to: email,
      html: contactEmailTemplate({ name, email, message }), // 👈 formatted HTML
      text: message, // fallback plain text (safe)
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}






import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactEmailTemplate } from "@/utils/emailTemplate";
import { confirmationEmailTemplate } from "@/utils/confirmationTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // 1. Send email to YOU
    await resend.emails.send({
      from: "Portfolio Contact <contact@knoph.dev>",
      to: "knophayieko@gmail.com",
      subject: `📬 New Message from ${name}`,
      reply_to: email,
      html: contactEmailTemplate({ name, email, message }),
      text: message,
    });

    // 2. Auto-reply to SENDER
    await resend.emails.send({
      from: "Knoph Ayieko <contact@knoph.dev>", // keep it branded
      to: email,
      subject: "✅ Thanks for contacting me!",
      html: confirmationEmailTemplate({ name }),
      text: `Hi ${name}, thanks for reaching out! I’ll get back to you soon. - Knoph`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}





import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "knopholuoch@gmail.com", // your receiving email
      subject: `New Contact Form Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}






import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for insert
);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1️⃣ Save message in Supabase
    const { error: dbError } = await supabase
      .from("messages")
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error("DB Error:", dbError.message);
    }

    // 2️⃣ Send email via Resend
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "knopholuoch@gmail.com",
      subject: `New Contact Form Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}




import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    await Message.create({ name, email, message });

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "knopholuoch@gmail.com",
      subject: `New Contact Form Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}





