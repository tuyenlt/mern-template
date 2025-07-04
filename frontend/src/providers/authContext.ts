import React, { createContext, useContext } from "react";
import type { User, UserRegister } from "@/types/global";

type ContextType = {
	user? : User,
	token? : string,
	setToken : React.Dispatch<React.SetStateAction<string | undefined>>;
	login : (username : string, password : string) => Promise<void>,
	logout : () => Promise<void>,
	register : (user : UserRegister) => Promise<void>,
	isAuthenticated : boolean,
}

export const AuthContext = createContext<ContextType>({
	user : undefined,
	token : undefined,
	setToken: () => { throw new Error("setToken must be overridden in AuthProvider"); },
	login : async ()=>{},
	logout : async () => {},
	register: async ()=> {},
	isAuthenticated : false,
})

export const useAuthContext = () => useContext(AuthContext);