import { blogModule } from "../modules/blog/index.js";
import { blogFieldResolvers } from "../modules/blog/nestedResolver.js";
import { messageModule } from "../modules/message/index.js";
import { userModule } from "../modules/user/index.js";

export const resolvers = {
    Query :{
        ...messageModule.Query,
        ...blogModule.Query,
        ...userModule.Query,
    },
    Mutation:{
        ...messageModule.Mutation,
        ...blogModule.Mutation
    },
    ...blogFieldResolvers,

    

    userResult: {
        __resolveType(obj) {
            if (obj.name) {
                return 'User2';
            }
            if (obj.message) {
                return 'customError';
            }
            return null; // GraphQL will throw an error if no type is returned
        }   
}}
