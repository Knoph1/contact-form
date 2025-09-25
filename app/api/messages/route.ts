import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import { sendMail } from "../../../lib/mail";
import { verifyToken } from "../../../lib/auth";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Save in DB
    const contact = await Contact.create({ name, email, subject, message });

    // Send email
    await sendMail({ name, email, subject, message });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Admin-only endpoints: GET, DELETE, RESEND
export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const user = token && verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const user = token && verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Resend email for a specific message
export async function PUT(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const user = token && verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Message ID required" }, { status: 400 });

    const contact = await Contact.findById(id);
    if (!contact) return NextResponse.json({ error: "Message not found" }, { status: 404 });

    await sendMail({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
