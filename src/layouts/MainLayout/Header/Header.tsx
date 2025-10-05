import { MessageSquarePlus, UserPlus2, Users } from "lucide-react";
import { HeaderContainer, NavTabTitle } from "./Header.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
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
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as {
		channel?: string;
		tab?: string;
	};
	const params = useParams({ strict: false }) as { groupId?: string };

	const baseTitle = "Friend";
	const actions: ButtonHeaderProps[] = [
		{ id: "all", title: "All", isPrimary: false },
		{ id: "pending", title: "Pending", isPrimary: false },
		{ id: "add-friend", title: "Add Friend", isPrimary: false },
	];

	const handleTabClick = (tabId: string) => {
		navigate({
			to: "/chat/friend",
			search: { tab: tabId } as any,
		});
	};

	const isGroupPage = Boolean(params.groupId);
	const displayedTitle =
		isGroupPage && search.channel ? `#${search.channel}` : baseTitle;

	return (
		<HeaderContainer className="rounded-tr-lg">
			{isGroupPage && search.channel ? (
				<h2 className="text-lg font-semibold">{displayedTitle}</h2>
			) : (
				<div className="flex items-center gap-2">
					<NavTabTitle>
						<UserPlus2 size={18} />
						Friend
					</NavTabTitle>
					{actions.map(({ id, title, isPrimary }) => (
						<Button
							key={id}
							size="sm"
							variant={isPrimary || search.tab === id ? "default" : "ghost"}
							onClick={() => handleTabClick(id)}
							className={
								isPrimary || search.tab === id
									? "bg-gray-100 text-white hover:bg-white shadow-none !outline-none focus:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
									: "shadow-none !outline-none focus:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
							}
						>
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
