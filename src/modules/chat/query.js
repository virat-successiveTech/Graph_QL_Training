import {users,messages} from "./dataSource.js"
import { AllMessages } from "./mutation.js"

export const chatQueryResolver ={
    chatUsers: () => users,
    chatMessages: () => messages,
    allMessages:(_,__,{user})=>
    {
        if(!user) 
        {
        throw new Error("Unauthorized")

        }
        if(user.role !== "admin")
        {
            throw new Error("Access denied")
        }
        return AllMessages;
    }
}