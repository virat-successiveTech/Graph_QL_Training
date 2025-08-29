import { chatMutationResolver } from "./mutation.js";
import { chatQueryResolver } from "./query.js";
import { chatSubscriptionResolvers } from "./subscription.js";  

export const chatModule ={
    Query:chatQueryResolver,
    Mutation:chatMutationResolver,
    Subscription:chatSubscriptionResolvers
}