import { users, posts, comments } from "./dataSource.js";

export const blogFieldResolvers = {
  User: {
    posts: (parent) => posts.filter((p) => p.authorId === parent.id),
    comments: (parent) => comments.filter((c) => c.authorId === parent.id),
  },
  Post: {
    author: (parent) => users.find((u) => u.id === parent.authorId),
    comments: (parent) => comments.filter((c) => c.postId === parent.id),
  },
  Comment: {
    author: (parent) => users.find((u) => u.id === parent.authorId),
    post: (parent) => posts.find((p) => p.id === parent.postId),
  },
};