/* eslint-disable @typescript-eslint/no-explicit-any */
import MainBg from "@/components/custom/MainBackground/MainBg";
import { Outlet, useParams, useSearch } from "@tanstack/react-router";
import {
	CenterPanel,
	MainLayoutContainer,
	ContentWrapper,
	LeftSection,
	RightSection,
	OutletContainer,
	BottomSpacer,
	RightPanelWrapper,
} from "./MainLayout.styled";
import TitleBar from "./TitleBar/TitleBar";
import { User } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
import Profile from "./Profile";
import AuthLayout from "../AuthLayout";
import { useEffect, useState } from "react";
import ThreadPanel from "@/components/custom/RightPanel/ThreadPanel/ThreadPanel";
import CodeList from "@/components/custom/RightPanel/CodeList/CodeList";
import MemberList from "@/components/custom/RightPanel/MemberList/MemberList";
import Header from "./Header";
import { GroupSetting } from "@/pages/GroupSetting";
import { LeftSidebar } from "./LeftSidebar/LeftSidebar";
import TodoFloatingManager from "@/components/custom/ResizableFloatingWindow/TodoFloatingManager/TodoFloatingManager";
import { detailGroup, GroupResponse, listGroups } from "@/services/groupAPI";
import { theme } from "@/themes";
import { ResizableHandle } from "@/components/ui/resizable";
import TaskGroup from "@/components/custom/RightPanel/TaskGroup/TaskGroup";
import FriendList from "@/components/custom/RightPanel/FriendList/FriendList";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const MainLayout = () => {
	const [iconSelected, setIconSelected] = useState<string>("");
	const [settingSelect, setSettingSelect] = useState<boolean>(false);
	const [showThreadPanel, setShowThreadPanel] = useState<boolean>(false);
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");
	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };
	const groupId = params.groupId;
	const channelId = search.channel;
	const [localGroups, setLocalGroups] = useState<any[]>([]);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [showCodeListPanel, setShowCodeListPanel] = useState<boolean>(false);
	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";
	const [isHalf, setIsHalf] = useState(window.innerWidth < 1220);

	console.log("MainLayout - Current IDs:", { groupId, channelId });

	const hasOpenPanel = isHalf && (showThreadPanel || iconSelected !== "");

	const shouldShowBorderRadius =
		(showThreadPanel || iconSelected !== "") && iconSelected !== "users";

	useEffect(() => {
		const handleResize = () => setIsHalf(window.innerWidth < 1220);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		let mounted = true;
		const fetch = async () => {
			try {
				const res = await listGroups();
				const payload = (res && (res.data ?? res)) as GroupResponse[];
				if (!mounted) return;

				const mapped = (payload || []).map((g) => {
					const initials = (g.name || "")
						.split(" ")
						.map((s) => s[0] ?? "")
						.join("")
						.slice(0, 2)
						.toUpperCase();
					return {
						id: g.id,
						name: g.name,
						initials,
						avatarColor: `${theme.color.primary}`,
						unread: 0,
						avatar: g.avatar ?? undefined,
						isActive: g.isActive ?? true,
					} as any;
				});

				const onlyActive = mapped.filter((mg) => mg.isActive === true);

				setLocalGroups(onlyActive);
			} catch (err) {
				console.error("Failed to load groups:", err);
			}
		};

		fetch();
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		const fetchGroupDetail = async () => {
			if (!groupId) return;
			try {
				const res = await detailGroup(groupId || "");
				const createdBy = res?.data?.createdBy || res;
				if (currentUserId === createdBy) {
					setIsAdmin(true);
				} else {
					setIsAdmin(false);
				}
			} catch (err) {
				console.error("Failed to fetch channel detail:", err);
				// don't block UI with alert in layout
			}
		};
		fetchGroupDetail();
	}, [groupId, currentUserId]);

	// Ensure opening one panel hides the other
	useEffect(() => {
		if (iconSelected === "code") {
			// when code icon is selected, close thread panel
			setShowThreadPanel(false);
			setSelectedThreadId("");
			setShowCodeListPanel(true);
		} else {
			// when selecting anything else, we don't force code panel open
			setShowCodeListPanel(false);
		}
	}, [iconSelected]);

	useEffect(() => {
		if (showThreadPanel) {
			// when thread panel opens, hide code list & clear icon selection
			setShowCodeListPanel(false);
			setIconSelected("");
		}
	}, [showThreadPanel]);

	const handleCreateThread = () => {
		setSelectedThreadId("");
		setShowThreadPanel(true);
		setIconSelected("");
	};

	const handleThreadCreated = (threadId: string) => {
		setSelectedThreadId(threadId);
		setShowThreadPanel(true);
		window.dispatchEvent(new CustomEvent("app:threadCreated"));
	};

	const handleThreadSelect = (threadId: string) => {
		setSelectedThreadId(threadId);
		setShowThreadPanel(true);
		setIconSelected("");
	};

	const handleClosePanel = () => {
		setIconSelected("");
		setShowThreadPanel(false);
		setSelectedThreadId("");
	};

	const handleCloseCodePanel = () => {
		setShowCodeListPanel(false);
		setIconSelected("");
	};

	const renderRightPanel = () => {
		// Give priority to code panel when it's active so it won't be hidden by thread
		if ((showCodeListPanel || iconSelected === "code") && !showThreadPanel) {
			return <CodeList onClose={handleCloseCodePanel} />;
		}

		// Thread panel should only show when explicitly opened and not blocked by code panel
		if (showThreadPanel && groupId && channelId && !showCodeListPanel) {
			return (
				<ThreadPanel
					key={selectedThreadId || "new-thread"}
					groupId={groupId}
					channelId={channelId}
					threadId={selectedThreadId || undefined}
					onClose={handleClosePanel}
					onThreadCreated={handleThreadCreated}
				/>
			);
		}

		switch (iconSelected) {
			case "tasks":
				return <TaskGroup groupId={groupId} onClose={handleClosePanel} />;
			case "code":
				return <CodeList onClose={handleCloseCodePanel} />;
			case "users":
				return <MemberList onClose={handleClosePanel} />;
			// case "notifications":
			// 	return null;
			default:
				return isHalf ? null : <FriendList />;
		}
	};

	return (
		<>
			<AuthLayout>
				<MainBg />
				<TodoFloatingManager groups={localGroups} />

				{!settingSelect ? (
					<MainLayoutContainer>
						<TitleBar title="DevChat" icon={<User />} />
						<ContentWrapper direction="horizontal">
							<LeftSection
								defaultSize={isHalf ? 25 : 20}
								collapsible
								minSize={isHalf ? 30 : 15}
								maxSize={isHalf ? 35 : 25}
							>
								<GroupSidebar />
								<LeftSidebar setSettingSelect={setSettingSelect} />
							</LeftSection>
							<ResizableHandle />
							<RightSection
								defaultSize={100}
								style={{ marginRight: isHalf ? "16px" : "0" }}
							>
								{!hasOpenPanel && (
									<CenterPanel
										$isHalf={isHalf}
										$hasRightBorderRadius={shouldShowBorderRadius}
									>
										<Header
											setIconSelected={setIconSelected}
											iconSelected={iconSelected}
											onCreateThread={handleCreateThread}
											onThreadSelect={handleThreadSelect}
										/>
										<OutletContainer>
											<Outlet />
										</OutletContainer>
									</CenterPanel>
								)}
								<RightPanelWrapper $fullWidth={hasOpenPanel}>
									{renderRightPanel()}
								</RightPanelWrapper>
							</RightSection>
						</ContentWrapper>
						<Profile />
						<BottomSpacer />
					</MainLayoutContainer>
				) : (
					<GroupSetting setSettingSelect={setSettingSelect} isAdmin={isAdmin} />
				)}
			</AuthLayout>
		</>
	);
};

export default MainLayout;
