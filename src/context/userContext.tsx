import React from "react"


export interface iUserData 
{
    page:any,
    user:{
        userId:string,
        token:string
    }
}
 
let userContext : React.Context<iUserData>;
export const CreateUser =(data:iUserData)=>{
    userContext=React.createContext<iUserData>(data);
} 

export const useUser=()=>{
    return React.useContext<iUserData>(userContext)
}