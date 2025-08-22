import { User, Post, Comment } from "../../models/blogModel.js";

// Helper to build sort object for Mongoose queries
const buildSortOption = (sortBy, sortOrder = "asc") => {
  if (!sortBy) return {};
  return { [sortBy]: sortOrder === "desc" ? -1 : 1 };
};

export const blogQueryResolvers = {
  // Get all users - returns array
  getUsers: async () => {
    try {
      const users = await User.find({});
      return users ;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },

  // Get single user by ID
  getUserById: async (_, { id }) => {
    try {
      return await User.findById(id);
    } catch (err) {
      console.error(`Error fetching user with id ${id}:`, err);
      return null;
    }
  },

  // Get posts with pagination and sorting
  getPosts: async (_, { page = 1, limit = 10, sortBy, sortOrder }) => {
    try {
      const sortOption = buildSortOption(sortBy, sortOrder);
      const totalCount = await Post.countDocuments({});
      const posts = await Post.find({})
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: posts,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (err) {
      console.error("Error fetching posts:", err);
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      };
    }
  },

  // Get post by ID
  getPostById: async (_, { id }) => {
    try {
      return await Post.findById(id);
    } catch (err) {
      console.error(`Error fetching post with id ${id}:`, err);
      return null;
    }
  },

  // Get posts by user ID with pagination and sorting
  getPostsByUserId: async (_, { userId, page = 1, limit = 10, sortBy, sortOrder }) => {
    try {
      const sortOption = buildSortOption(sortBy, sortOrder);
      const totalCount = await Post.countDocuments({ authorId: userId });
      const posts = await Post.find({ authorId: userId })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: posts,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (err) {
      console.error(`Error fetching posts for user ${userId}:`, err);
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      };
    }
  },

  // Get comments with pagination and sorting
  getComments: async (_, { page = 1, limit = 10, sortBy, sortOrder }) => {
    try {
      const sortOption = buildSortOption(sortBy, sortOrder);
      const totalCount = await Comment.countDocuments({});
      const comments = await Comment.find({})
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: comments,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (err) {
      console.error("Error fetching comments:", err);
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      };
    }
  },

  // Get comments by post ID with pagination and sorting
  getCommentsByPostId: async (_, { postId, page = 1, limit = 10, sortBy, sortOrder }) => {
    try {
      const sortOption = buildSortOption(sortBy, sortOrder);
      const totalCount = await Comment.countDocuments({ postId });
      const comments = await Comment.find({ postId })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: comments,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      };
    }
  },

  // Get user who wrote a comment
  getUserByComment: async (_, { commentId }) => {
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) return null;
      return await User.findById(comment.authorId); // assuming `authorId` links user
    } catch (err) {
      console.error(`Error fetching user by comment ${commentId}:`, err);
      return null;
    }
  },

  // Get author of a post
  getAuthorOfPost: async (_, { postId }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) return null;
      return await User.findById(post.authorId);
    } catch (err) {
      console.error(`Error fetching author for post ${postId}:`, err);
      return null;
    }
  },
};
