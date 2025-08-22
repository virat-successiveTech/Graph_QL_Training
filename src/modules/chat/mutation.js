import jwt from "jsonwebtoken";
import { ChatUser,ChatMessage } from "../../models/chatModel.js";
const SECRET_KEY = "ASDFG";

export const AllMessages = [];

export const chatMutationResolver = {
    register: async (_, { username, password }) => {
    const existing = await ChatUser.findOne({ username });
    if (existing) throw new Error("Username already exists");

    const user = new ChatUser({
      username,
      password,
      status: "offline",
    });

    await user.save();

    return user;
  },

    login: async (_, { username, password }, { pubsub }) => {
    // Find user by username
    const user = await ChatUser.findOne({ username });
    if (!user) throw new Error("ChatUser not found");


    if (user.password !== password) throw new Error("Invalid password");

    
    user.status = "online";
    await user.save();


    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" } 
    );

    pubsub.publish("USER_STATUS_CHANGED", { userStatusChanged: user });

    return { token, user };
  },
    logout: async (_, __, { user, pubsub, blacklist, token }) => {
  if (!user) throw new Error("Unauthorized");

  await ChatUser.findByIdAndUpdate(user.id, { status: "offline" }, { new: true });

  pubsub.publish("USER_STATUS_CHANGED", { userStatusChanged: { ...user, status: "offline" } });

  blacklist.add(token);

  return { message: "Logged out successfully" };
},

    sendMessage: async (_, { content }, { user }) => {
      
        if (!user) throw new Error("Unauthorized");
        if (!content || content.trim() === "") throw new Error("Message content required");

        // Ensure user._id is defined
        if (!user._id) {
            throw new Error("User ID missing in context");
        }

        const message = new ChatMessage({
            content,
            timestamp: new Date(),
            sender: user._id, // ✅ Use _id here
        });

        await message.save();
      const msg = await ChatMessage.findById(message._id).populate("sender"); 
      await message.populate("sender");
        AllMessages.push(msg);
        return msg;
    }



};