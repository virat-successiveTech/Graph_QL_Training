import { User, Post, Comment } from "../../models/blogModel.js";

// Utility delay function (optional)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const blogMutation = {
  createPost: async (_, { title, content, authorId }) => {
    await delay(1000); // Simulate delay
    console.log("working");

    // Validate author exists in DB
    const author = await User.findById(authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    // Create and save new post
    const newPost = new Post({
      title,
      content,
      authorId,
    });

    await newPost.save();

    return newPost;
  },

  createComment: async (_, { postId, content, authorId }, { pubsub }) => {
    await delay(1000); // Simulate delay

    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Validate author exists
    const author = await User.findById(authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    // Create and save comment
    const newComment = new Comment({
      postId,
      text: content,  // assuming your Comment schema uses 'text' for content
      authorId,
      createdAt: new Date(),
    });

    await newComment.save();

    // Publish subscription event
    pubsub.publish(`COMMENT_ADDED`, { commentAdded: newComment });

    return newComment;
  },

  updateUser: async (_, { userId, newInfo }) => {
    await delay(1000); // Simulate delay

    // Find user and update with newInfo
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, newInfo);
    await user.save();

    return user;
  },

  deleteComment: async (_, { commentId }) => {
    await delay(1000); // Simulate delay

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      throw new Error("Comment not found");
    }

    return true;
  },
};
