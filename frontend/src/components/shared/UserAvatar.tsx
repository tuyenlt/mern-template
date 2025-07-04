import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";

type AvatarProps = {
	avatarUrl?: string;
	className?: string;
	fallbackText?: string;
};

export default function UserAvatar({ avatarUrl, className, fallbackText }: AvatarProps) {
	return (
		<Avatar className={className}>
			<AvatarImage src={avatarUrl} alt="User Avatar" />
			<AvatarFallback>
				{fallbackText ?? "?"}
			</AvatarFallback>
		</Avatar>
	);
}
