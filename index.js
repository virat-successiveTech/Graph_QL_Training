import { createApolloServer } from "./src/server/express.js";
import { connectDB } from "./src/db/db.js";

async function start() {
  // Connect to MongoDB first
  await connectDB();
  console.log("Database connection established");
  const httpServer = await createApolloServer(4000);

  // Start listening only after DB connection
  httpServer.listen(4001, () => {
    console.log(`🚀 Query/Mutation endpoint: http://localhost:4001/graphql`);
    console.log(`🚀 Subscription endpoint: ws://localhost:4001/graphql`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
