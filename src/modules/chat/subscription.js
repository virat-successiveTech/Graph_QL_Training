import { pubsub } from "../../server/pubsub.js";

export const chatSubscriptionResolvers = {
  userStatusChanged: {
    subscribe: () => pubsub.asyncIterableIterator(["USER_STATUS_CHANGED"]),
  },
};