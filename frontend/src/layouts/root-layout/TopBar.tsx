import UserAvatar from "@/components/shared/UserAvatar";
import { useAuthContext } from "@/providers/authContext"


export default function TopBar() {
	const { user } = useAuthContext();
	return (
		<div className="h-20 flex justify-between items-center px-6">
			<div className="">

			</div>
			<div className="">
				<UserAvatar avatarUrl={user?.avatar_url} />
			</div>
		</div>
	)
}