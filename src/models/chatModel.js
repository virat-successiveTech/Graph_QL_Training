import mongoose from "mongoose";
const { Schema, model } = mongoose;

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // store hashed passwords in real apps!
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

// Message Schema
const messageSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: Schema.Types.ObjectId, ref: "ChatUser", required: true },
}, { timestamps: true });

// Models
export const ChatUser = model("ChatUser", userSchema);
export const ChatMessage = model("ChatMessage", messageSchema);
