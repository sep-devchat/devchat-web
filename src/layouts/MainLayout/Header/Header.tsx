/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	ArrowLeft,
	Info,
	NotebookPenIcon,
	Spool,
	SquareCode,
	Users,
} from "lucide-react";
import {
	HeaderContainer,
	NavTabTitle,
	IconBtn,
	Tooltip,
	TabButton,
	TitleSection,
	BackButton,
} from "./Header.styled";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
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
	showBackButton?: boolean;
	onBackClick?: () => void;
};

const Header = ({
	setIconSelected,
	iconSelected,
	onCreateThread,
	onThreadSelect,
	showBackButton,
	onBackClick,
}: Props) => {
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as {
		channel?: string;
		tab?: string;
	};
	const [channelData, setChannelData] = useState<ChannelResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [showThreadDropdown, setShowThreadDropdown] = useState(false);
	const params = useParams({ strict: false }) as {
		groupId?: string;
		userId?: string;
	};
	const groupId = params.groupId;
	const channelId = search.channel;
	const directUserId = params.userId;
	const isDirectPage = Boolean(directUserId);

	// Responsive window width tracking
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1440,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Responsive size functions
	const getIconSize = () => {
		if (windowWidth >= 1920) return 26;
		if (windowWidth >= 1440) return 20;
		if (windowWidth < 1440 && windowWidth > 1220) return 20;
		if (windowWidth <= 1220) return 18;
		return 20;
	};

	const getSpinnerSize = () => {
		if (windowWidth >= 1920) return "h-4.4 w-4.4";
		if (windowWidth >= 1440) return "h-3.2 w-3.2";
		if (windowWidth < 1440 && windowWidth > 1220) return "h-3.2 w-3.2";
		if (windowWidth <= 1220) return "h-2.8 w-2.8";
		return "h-4 w-4";
	};

	const getLoadingBarSize = () => {
		if (windowWidth >= 1920) return "h-5.5 w-35.2";
		if (windowWidth >= 1440) return "h-4 w-25.6";
		if (windowWidth < 1440 && windowWidth > 1220) return "h-4 w-25.6";
		if (windowWidth <= 1220) return "h-3.5 w-22.4";
		return "h-5 w-32";
	};

	const getTitleFontSize = () => {
		if (windowWidth >= 1920) return "text-xl";
		if (windowWidth >= 1440) return "text-base";
		if (windowWidth < 1440 && windowWidth > 1220) return "text-base";
		if (windowWidth <= 1220) return "text-base";
		return "text-lg";
	};

	const getGapSize = () => {
		if (windowWidth >= 1920) return "gap-3";
		if (windowWidth >= 1440) return "gap-2.4";
		if (windowWidth < 1440 && windowWidth > 1220) return "gap-2.4";
		if (windowWidth <= 1220) return "gap-3";
		return "gap-2";
	};

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
		isGroupPage && channelData?.name ? `# ${channelData.name}` : baseTitle;
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
	const compact =
		iconSelected === "spool" ||
		iconSelected === "code" ||
		// iconSelected === "info" ||
		iconSelected === "tasks";

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

	const handleBackClick = () => {
		if (onBackClick) {
			onBackClick();
		}
	};

	const iconSize = getIconSize();
	const spinnerSize = getSpinnerSize();
	const loadingBarSize = getLoadingBarSize();
	const titleFontSize = getTitleFontSize();
	const gapSize = getGapSize();

	return (
		<HeaderContainer
			// className="rounded-tr-lg"
			style={{
				borderTopRightRadius: compact
					? "10px"
					: iconSelected === "users"
						? "0px"
						: "10px",
			}}
		>
			<TitleSection>
				{showBackButton && (
					<BackButton
						type="button"
						aria-label="Back to chat"
						onClick={handleBackClick}
					>
						<ArrowLeft size={16} />
						<span>Back</span>
					</BackButton>
				)}
				{isGroupPage && search.channel ? (
					loading ? (
						<div className={`flex items-center ${gapSize}`}>
							<div
								className={`animate-spin ${spinnerSize} border-2 border-gray-300 border-t-blue-500 rounded-full`}
							/>
							<div
								className={`${loadingBarSize} bg-gray-200 animate-pulse rounded`}
							/>
						</div>
					) : (
						<h2 className={`${titleFontSize} font-semibold`}>
							{displayedTitle}
						</h2>
					)
				) : isDirectPage ? (
					<h2 className={`${titleFontSize} font-semibold`}>Direct Message</h2>
				) : (
					<div className={`flex items-center ${gapSize}`}>
						<NavTabTitle>
							<Users size={iconSize} />
							Friend
						</NavTabTitle>
						{actions.map(({ id, title, isPrimary }) => (
							<TabButton
								key={id}
								isActive={isPrimary || search.tab === id}
								onClick={() => handleTabClick(id)}
							>
								{title}
							</TabButton>
						))}
					</div>
				)}
			</TitleSection>

			<div className="flex items-center gap-2" style={{ position: "relative" }}>
				{isGroupPage ? (
					<div className={`flex ${gapSize}`}>
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
							<NotebookPenIcon size={iconSize} />
							<Tooltip visible={hoveredIcon === "tasks"}>Tasks</Tooltip>
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
						>
							<Spool size={iconSize} />
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
							<SquareCode size={iconSize} />
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
							<Users size={iconSize} />
							<Tooltip visible={hoveredIcon === "users"}>Members</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="info"
							onMouseEnter={() => setHoveredIcon("info")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "info" ? null : h))
							}
							onClick={() => onIconClick("info")}
							onKeyDown={(e) => onIconKeyDown(e, "info")}
							disabled={loading}
						>
							<Info size={iconSize} />
							<Tooltip visible={hoveredIcon === "info"}>Info</Tooltip>
						</IconBtn>

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
				) : directUserId ? (
					<div className={`flex ${gapSize}`}>
						<IconBtn
							aria-label="code"
							onMouseEnter={() => setHoveredIcon("code")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "code" ? null : h))
							}
							onClick={() => onIconClick("code")}
							onKeyDown={(e) => onIconKeyDown(e, "code")}
						>
							<SquareCode size={iconSize} />
							<Tooltip visible={hoveredIcon === "code"}>Code</Tooltip>
						</IconBtn>

						<IconBtn
							aria-label="info"
							onMouseEnter={() => setHoveredIcon("info")}
							onMouseLeave={() =>
								setHoveredIcon((h) => (h === "info" ? null : h))
							}
							onClick={() => onIconClick("info")}
							onKeyDown={(e) => onIconKeyDown(e, "info")}
						>
							<Info size={iconSize} />
							<Tooltip visible={hoveredIcon === "info"}>Attachments</Tooltip>
						</IconBtn>
					</div>
				) : (
					<></>
				)}
			</div>
		</HeaderContainer>
	);
};

export default Header;
