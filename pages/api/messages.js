import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export default async function handler(req, res) {
  const { method } = req;

  await connectDB();

  // 1️⃣ Get messages (with optional filters)
  if (method === "GET") {
    try {
      const { password, search, status, days } = req.query;

      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let query = {};

      // Search (by name, email, or message)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by status
      if (status) {
        query.$or = [
          { "deliveryStatus.toOwner": status },
          { "deliveryStatus.toSender": status },
        ];
      }

      // Filter by date
      if (days) {
        const since = new Date();
        since.setDate(since.getDate() - parseInt(days));
        query.createdAt = { $gte: since };
      }

      const messages = await Message.find(query).sort({ createdAt: -1 });
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching messages" });
    }
  }

  // 2️⃣ Mark as read/unread
  if (method === "PATCH") {
    try {
      const { id, read } = req.body;
      const updated = await Message.findByIdAndUpdate(
        id,
        { read },
        { new: true }
      );
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: "Error updating message" });
    }
  }

  // 3️⃣ Delete message
  if (method === "DELETE") {
    try {
      const { id } = req.body;
      await Message.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting message" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}




export default async function handler(req, res) {
  const { password } = req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 }); // newest first
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
