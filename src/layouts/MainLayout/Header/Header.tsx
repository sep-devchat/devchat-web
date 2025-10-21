/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Bell,
	Folder,
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
import { useState, useEffect } from "react";
import { ChannelResponse, detailChannel } from "@/services/channelAPI";
import ThreadList from "@/components/custom/ThreadList/ThreadList";

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
	onCreateThread?: () => void;
	onThreadSelect?: (threadId: string) => void;
};

const Header = ({
	setIconSelected,
	iconSelected,
	onCreateThread,
	onThreadSelect,
}: Props) => {
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as {
		channel?: string;
		tab?: string;
	};
	const [channelData, setChannelData] = useState<ChannelResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [showThreadDropdown, setShowThreadDropdown] = useState(false);
	const params = useParams({ strict: false }) as { groupId?: string };
	const groupId = params.groupId;
	const channelId = search.channel;

	useEffect(() => {
		const fetchChannelData = async () => {
			if (search.channel && groupId) {
				setLoading(true);
				try {
					const response = await detailChannel(groupId, search.channel);
					setChannelData(response.data);
				} catch (error) {
					console.error("Error fetching channel:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchChannelData();
	}, [search.channel, groupId]);

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
		isGroupPage && channelData?.name ? `#${channelData.name}` : baseTitle;
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
	const compact = iconSelected === "spool" || iconSelected === "code";

	const handleThreadIconClick = () => {
		if (groupId && channelId) {
			setShowThreadDropdown(!showThreadDropdown);
			if (setIconSelected && !showThreadDropdown) {
				setIconSelected("");
			}
		} else {
			alert("Please select a channel first");
		}
	};

	const handleCreateThreadFromDropdown = () => {
		setShowThreadDropdown(false);
		if (onCreateThread) {
			onCreateThread();
		}
	};

	const handleThreadSelectFromDropdown = (threadId: string) => {
		setShowThreadDropdown(false);
		if (onThreadSelect) {
			onThreadSelect(threadId);
		}
	};

	const onIconClick = (name: string) => {
		if (name === "spool") {
			handleThreadIconClick();
		} else {
			setShowThreadDropdown(false);
			if (setIconSelected) setIconSelected(name);
		}
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
				loading ? (
					<div className="flex items-center gap-2">
						<div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full" />
						<div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
					</div>
				) : (
					<h2 className="text-lg font-semibold">{displayedTitle}</h2>
				)
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

			<div className="flex items-center gap-2" style={{ position: "relative" }}>
				{isGroupPage ? (
					<div className="flex gap-2">
						<IconBtn
							aria-label="tasks"
							onMouseEnter={() => setHoveredIcon("tasks")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "tasks" ? null : h))
							}
							onClick={() => onIconClick("tasks")}
							onKeyDown={(e) => onIconKeyDown(e, "tasks")}
							disabled={loading}
						>
							<Folder size={20} />
							<Tooltip visible={hoveredIcon === "tasks"}>Tasks</Tooltip>
						</IconBtn>
						<IconBtn
							aria-label="notifications"
							onMouseEnter={() => setHoveredIcon("notifications")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "notifications" ? null : h))
							}
							onClick={() => onIconClick("notifications")}
							onKeyDown={(e) => onIconKeyDown(e, "notifications")}
							disabled={loading}
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
							disabled={loading}
							style={{
								background: showThreadDropdown ? "#eff6ff" : undefined,
								color: showThreadDropdown ? "#6366f1" : undefined,
							}}
						>
							<Spool size={20} />
							<Tooltip visible={hoveredIcon === "spool"}>Threads</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="code"
							onMouseEnter={() => setHoveredIcon("code")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "code" ? null : h))
							}
							onClick={() => onIconClick("code")}
							onKeyDown={(e) => onIconKeyDown(e, "code")}
							disabled={loading}
						>
							<SquareCode size={20} />
							<Tooltip visible={hoveredIcon === "code"}>Code</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="users"
							onMouseEnter={() => setHoveredIcon("users")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "users" ? null : h))
							}
							onClick={() => onIconClick("users")}
							onKeyDown={(e) => onIconKeyDown(e, "users")}
							disabled={loading}
						>
							<Users size={20} />
							<Tooltip visible={hoveredIcon === "users"}>Members</Tooltip>
						</IconBtn>

						<Input
							className="shadow-none"
							placeholder="Search"
							disabled={loading}
						/>

						{showThreadDropdown && groupId && channelId && (
							<ThreadList
								groupId={groupId}
								channelId={channelId}
								onClose={() => setShowThreadDropdown(false)}
								onCreateThread={handleCreateThreadFromDropdown}
								onThreadSelect={handleThreadSelectFromDropdown}
							/>
						)}
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
