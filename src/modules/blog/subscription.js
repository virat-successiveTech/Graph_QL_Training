import { pubsub } from "../../server/pubsub.js";

export const blogSubscriptionResolvers = {
    commentAdded: { 
        subscribe: () => {
            return pubsub.asyncIterableIterator("COMMENT_ADDED");
        }
    }};
