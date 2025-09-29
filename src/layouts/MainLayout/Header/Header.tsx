import { MessageSquarePlus, Users } from "lucide-react";
import { HeaderContainer } from "./Header.styled";
import { useParams, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ButtonHeaderProps = {
	id: string;
	title: string;
	isPrimary?: boolean;
	icon?: React.ReactNode;
	onClick?: () => void;
};

const Header = () => {
	const baseTitle = "Friend";
	const actions: ButtonHeaderProps[] = [
		{ id: "all", title: "All", isPrimary: false },
		{ id: "online", title: "Online", isPrimary: false },
		{ id: "pending", title: "Pending", isPrimary: false },
		{ id: "add-friend", title: "Add Friend", isPrimary: true },
	];
	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };
	const isGroupPage = Boolean(params.groupId);
	const displayedTitle =
		isGroupPage && search.channel ? `#${search.channel}` : baseTitle;

	return (
		<HeaderContainer className="rounded-tr-lg">
			{isGroupPage && search.channel ? (
				<h2 className="text-lg font-semibold">{displayedTitle}</h2>
			) : (
				<div className="flex items-center gap-2">
					{actions.map(({ id, title, isPrimary, icon, onClick }) => (
						<Button
							key={id}
							size="sm"
							variant={isPrimary ? "default" : "ghost"}
							onClick={onClick}
							className={
								isPrimary
									? "bg-gray-100 text-white hover:bg-white shadow-none"
									: "shadow-none"
							}
						>
							{icon ? <span className="mr-1.5 inline-flex">{icon}</span> : null}
							{title}
						</Button>
					))}
				</div>
			)}

			<div className="flex items-center gap-2">
				{isGroupPage ? (
					<div className="flex">
						<Button className="shadow-none">
							<Users />
						</Button>
						<Input className="shadow-none" placeholder="Search" />
					</div>
				) : (
					<Button className="shadow-none">
						<MessageSquarePlus />
					</Button>
				)}
			</div>
		</HeaderContainer>
	);
};

export default Header;
