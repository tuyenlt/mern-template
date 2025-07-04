import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";


export default function RootLayout() {
	return (
		<div>
			<TopBar />
			<main><Outlet /></main>
		</div>
	)
}