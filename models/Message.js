import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);



const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    deliveryStatus: {
      toOwner: { type: String, default: "pending" },
      toSender: { type: String, default: "pending" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);



const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    deliveryStatus: {
      toOwner: { type: String, default: "pending" },  // success | failed | pending
      toSender: { type: String, default: "pending" }, // success | failed | pending
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);



const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    deliveryStatus: {
      toOwner: { type: String, default: "pending" },   // "success" | "failed"
      toSender: { type: String, default: "pending" },  // "success" | "failed"
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);



const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [10, "Message should be at least 10 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent recompiling models on hot reload
export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
