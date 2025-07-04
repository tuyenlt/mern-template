import Login from "@/pages/login/Login";
import OAuthSuccess from "@/pages/login/OAuthSuccess";
import Register from "@/pages/register/Register";
import type { ReactNode } from "react";


type AuthRouteType = {
	path: string,
	element: ReactNode
}

export const authRoutes: AuthRouteType[] = [
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
	{
		path: "/oauth-login-success",
		element: <OAuthSuccess />
	}
]