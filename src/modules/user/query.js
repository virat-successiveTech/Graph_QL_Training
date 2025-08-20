import { users } from "./dataSource.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userResolvers = {
  getUsers2: async () => {
    await delay(5000);
    return users;
  },

  getUsersById2: async (_, { id }) => {
    await delay(5000);

    const user = users.find((user) => user.id === id);

    if(!user){
        return {
            message:"User not found",
            code:404
        }
    }

    return user;

  }

    
};
