import { posts, users, comments } from "./dataSource.js";

// Generic sort utility
const sortData = (data, sortBy, sortOrder = 'asc') => {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA == null || valB == null) return 0;

    if (typeof valA === "string") {
      return sortOrder === "desc"
        ? valB.localeCompare(valA)
        : valA.localeCompare(valB);
    }

    return sortOrder === "desc" ? valB - valA : valA - valB;
  });
};

export const blogQueryResolvers = {
  getUsers: () => users,

  getUserById: (_, { id }) => users.find(user => user.id === id),

  getPosts: (_, { page = 1, limit = 10, sortBy, sortOrder }) => {
    const sorted = sortData(posts, sortBy, sortOrder);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(posts.length / limit),
      totalCount: posts.length,
    };
  },

  getPostById: (_, { id }) => posts.find(post => post.id === id),

  getPostsByUserId: (_, { userId, page = 1, limit = 10, sortBy, sortOrder }) => {
    const userPosts = posts.filter(post => post.authorId === userId);
    const sorted = sortData(userPosts, sortBy, sortOrder);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(userPosts.length / limit),
      totalCount: userPosts.length,
    };
  },

  getComments: (_, { page = 1, limit = 10, sortBy, sortOrder }) => {
    const sorted = sortData(comments, sortBy, sortOrder);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(comments.length / limit),
      totalCount: comments.length,
    };
  },

  getCommentsByPostId: (_, { postId, page = 1, limit = 10, sortBy, sortOrder }) => {
    const postComments = comments.filter(comment => comment.postId === postId);
    const sorted = sortData(postComments, sortBy, sortOrder);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(postComments.length / limit),
      totalCount: postComments.length,
    };
  },

  getUserByComment: (_, { commentId }) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return null;
    return users.find(user => user.id === comment.userId);
  },

  getAuthorOfPost: (_, { postId }) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    return users.find(user => user.id === post.authorId);
  },
};