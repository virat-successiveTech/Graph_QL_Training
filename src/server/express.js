import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import tokenBlacklist from './blacklist.js';


import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { pubsub } from "./pubsub.js"; // Import the pubsub instance
import { typeDefs } from "../schema/typeDefs.js";
import { resolvers } from "../schema/resolvers.js";

import jwt from 'jsonwebtoken'
import { ChatUser } from "../models/chatModel.js"; // Import your models

// ✅ Your JWT secret (could be moved to env in real apps)
const SECRET_KEY = "ASDFG";

export async function createExpressServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Build GraphQL schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

const context = async ({ req }) => {
  const auth = req.headers.authorization || "";
  let token = "";
  let user = null;

  if (auth.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  }

  try {
    if (token && !tokenBlacklist.has(token)) {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded?.id) {
        user = await ChatUser.findById(decoded.id); // ✅ correct model
      }
    }
  } catch (err) {
    console.log("JWT verify error:", err.message);
  }

  return { pubsub, user, blacklist: tokenBlacklist, token };
};
  // Attach HTTP middleware
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, { context}
  
    )
  );

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      context: async () => ({ pubsub }),
    },
    wsServer
  );

  return httpServer;
}

export const createApolloServer = createExpressServer;