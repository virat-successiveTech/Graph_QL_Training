import { posts, users, comments } from "./dataSource.js";

// Utility delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const blogMutation = {
  createPost: async (_, { title, content, authorId }) => {
    await delay(1000); // Simulate delay
    console.log("working");

    // Validate author exists
    const author = users.find(user => user.id === authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const newPost = {
      id: String(posts.length + 1),
      title,
      content,
      authorId,
    };

    posts.push(newPost);
    return newPost;
  },

  createComment: async (_, { postId, content, authorId }) => {
    await delay(1000); // Simulate delay

    // Validate post exists
    const post = posts.find(p => p.id === postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Validate author exists
    const author = users.find(user => user.id === authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const newComment = {
      id: String(comments.length + 1),
      postId,
      content,
      authorId,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    return newComment;
  },

  updateUser: async (_, { userId, newInfo }) => {
    await delay(1000); // Simulate delay

    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, newInfo);
    return user;
  },

  deleteComment: async (_, { commentId }) => {
    await delay(1000); // Simulate delay

    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComment = comments.splice(commentIndex, 1)[0];
    return deletedComment ? true : false;
  },
};