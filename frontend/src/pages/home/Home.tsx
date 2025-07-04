import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/authContext"
import { useNavigate } from "react-router-dom";


export default function Home() {
	const { user, logout } = useAuthContext();
	const navigate = useNavigate();
	return (
		<div className="">
			<div className="text-lg">This is Home</div>
			<div className="text-lg">{user ? "Logged in" : "Not Logged in"}</div>
			<Button onClick={() => navigate("/login")}>Login</Button>
			<Button onClick={logout} > Logout</Button>
		</div>
	)
}