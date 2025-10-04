import {
	Bell,
	MessageSquarePlus,
	Spool,
	SquareCode,
	Users,
} from "lucide-react";
import { HeaderContainer, IconBtn, Tooltip } from "./Header.styled";
import { useParams, useSearch } from "@tanstack/react-router";
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
