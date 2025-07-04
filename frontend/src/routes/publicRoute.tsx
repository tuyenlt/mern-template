import Home from "@/pages/home/Home"
import type { ReactNode } from "react"


type PublicRouteType = {
	path: string,
	element: ReactNode
}

export const publicRoutes: PublicRouteType[] = [
	{
		path: "/",
		element: <Home />
	}
]