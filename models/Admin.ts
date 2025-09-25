import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string; // hashed
}

const AdminSchema: Schema<IAdmin> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
