import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// CREATE message
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    const client = await clientPromise
    const db = client.db("portfolio")
    const result = await db.collection("messages").insertOne(body)

    // Send email notification via Resend
    await resend.emails.send({
      from: "Portfolio Contact <no-reply@yourdomain.com>",
      to: "knopholuoch@gmail.com",
      subject: `New Message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// READ all messages
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const messages = await db.collection("messages").find({}).toArray()

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// UPDATE message
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json()
    const client = await clientPromise
    const db = client.db("portfolio")

    const result = await db
      .collection("messages")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

// DELETE message
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const client = await clientPromise
    const db = client.db("portfolio")

    const result = await db.collection("messages").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}



import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auth = url.searchParams.get("auth");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "5", 10);
  const search = url.searchParams.get("search") || "";

  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const auth = url.searchParams.get("auth");
  const id = url.searchParams.get("id");

  if (auth !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "Message ID required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
