export const users = [
  {
    id: "1",
    username: "alice",
    password: "password123", 
    status: "ofline",
  },
  {
    id: "2",
    username: "bob",
    password: "secret456", 
    status: "ofline",
  },
];

export const messages = [
  {
    id: "1",
    content: "Hello Bob!",
    timestamp: "2025-08-20T10:00:00Z",
    sender: {
      id: "1",
      username: "alice",
      status: "ofline",
    },
  },
  {
    id: "2",
    content: "Hey Alice, how are you?",
    timestamp: "2025-08-20T10:01:00Z",
    sender: {
      id: "2",
      username: "bob",
    },
  },
];