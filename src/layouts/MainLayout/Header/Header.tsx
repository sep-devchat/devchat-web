import {
	Bell,
	MessageSquarePlus,
	Spool,
	SquareCode,
	UserPlus2,
	Users,
} from "lucide-react";
import {
	HeaderContainer,
	NavTabTitle,
	IconBtn,
	Tooltip,
} from "./Header.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type ButtonHeaderProps = {
	id: string;
	title: string;
	isPrimary?: boolean;
	icon?: React.ReactNode;
	onClick?: () => void;
};

type Props = {
	setIconSelected?: (icon: string) => void;
	iconSelected?: string;
};

const Header = ({ setIconSelected, iconSelected }: Props) => {
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
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
	const compact = iconSelected === "spool" || iconSelected === "code";

	const onIconClick = (name: string) => {
		if (setIconSelected) setIconSelected(name);
	};

	const onIconKeyDown = (e: React.KeyboardEvent, name: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onIconClick(name);
		}
	};

	return (
		<HeaderContainer
			className="rounded-tr-lg"
			style={{
				borderTopRightRadius: compact ? "10px" : "0",
			}}
		>
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
					<div className="flex gap-2">
						<IconBtn
							aria-label="notifications"
							onMouseEnter={() => setHoveredIcon("notifications")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "notifications" ? null : h))
							}
							onClick={() => onIconClick("notifications")}
							onKeyDown={(e) => onIconKeyDown(e, "notifications")}
						>
							<Bell size={20} />
							<Tooltip visible={hoveredIcon === "notifications"}>
								Notifications
							</Tooltip>
						</IconBtn>
						<IconBtn
							aria-label="spool"
							onMouseEnter={() => setHoveredIcon("spool")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "spool" ? null : h))
							}
							onClick={() => onIconClick("spool")}
							onKeyDown={(e) => onIconKeyDown(e, "spool")}
						>
							<Spool size={20} />
							<Tooltip visible={hoveredIcon === "spool"}>Spool</Tooltip>
						</IconBtn>

						{/* SquareCode -> "code" */}
						<IconBtn
							aria-label="code"
							onMouseEnter={() => setHoveredIcon("code")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "code" ? null : h))
							}
							onClick={() => onIconClick("code")}
							onKeyDown={(e) => onIconKeyDown(e, "code")}
						>
							<SquareCode size={20} />
							<Tooltip visible={hoveredIcon === "code"}>Code</Tooltip>
						</IconBtn>

						{/* Users */}
						<IconBtn
							aria-label="users"
							onMouseEnter={() => setHoveredIcon("users")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "users" ? null : h))
							}
							onClick={() => onIconClick("users")}
							onKeyDown={(e) => onIconKeyDown(e, "users")}
						>
							<Users size={20} />
							<Tooltip visible={hoveredIcon === "users"}>Members</Tooltip>
						</IconBtn>
						{/* <Button className="shadow-none">
              <Users />
            </Button> */}
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
