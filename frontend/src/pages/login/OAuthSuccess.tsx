import { useAuthContext } from "@/providers/authContext"
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
	const navigate = useNavigate();
	const { setToken } = useAuthContext();
	const params = new URLSearchParams(window.location.search);
	const accessToken = params.get("accessToken");
	if (accessToken) {
		setToken(accessToken);
		navigate("/");
	}
	return (
		<div></div>
	)
}