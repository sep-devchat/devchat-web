/* eslint-disable @typescript-eslint/no-explicit-any */
import MainBg from "@/components/custom/MainBackground/MainBg";
import { Outlet, useParams, useSearch } from "@tanstack/react-router";
import {
	CenterPanel,
	MainLayoutContainer,
	ContentWrapper,
	RightSection,
	OutletContainer,
	BottomSpacer,
	RightPanelWrapper,
	LeftSection,
} from "./MainLayout.styled";
import TitleBar from "./TitleBar/TitleBar";
import { User } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
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
		if (isHalf && iconSelected === "users") {
			setIconSelected("");
			setShowThreadPanel(false);
			setSelectedThreadId("");
		}
	}, [isHalf]);

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
			}
		};
		fetchGroupDetail();
	}, [groupId, currentUserId]);

	useEffect(() => {
		if (iconSelected === "code") {
			setShowThreadPanel(false);
			setSelectedThreadId("");
			setShowCodeListPanel(true);
		} else {
			setShowCodeListPanel(false);
		}
	}, [iconSelected]);

	useEffect(() => {
		if (showThreadPanel) {
			setShowCodeListPanel(false);
			setIconSelected("");
		}
	}, [showThreadPanel]);

	// Listen for thread selection requests coming from ChatArea (message thread button)
	useEffect(() => {
		const onThreadSelected = (e: Event) => {
			try {
				const ce = e as CustomEvent;
				const tid = ce.detail?.threadId as string | undefined;
				if (tid) {
					setSelectedThreadId(tid);
					setShowThreadPanel(true);
					setIconSelected("");
				}
			} catch {
				/* noop */
			}
		};
		window.addEventListener(
			"app:threadSelected",
			onThreadSelected as EventListener,
		);
		return () => {
			window.removeEventListener(
				"app:threadSelected",
				onThreadSelected as EventListener,
			);
		};
	}, []);

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

	useEffect(() => {
		if (
			groupId &&
			iconSelected === "" &&
			!showThreadPanel &&
			!showCodeListPanel
		) {
			setIconSelected("users");
		}
		if (!groupId && iconSelected === "users") {
			setIconSelected("");
		}
	}, [groupId]);

	const renderRightPanel = () => {
		if ((showCodeListPanel || iconSelected === "code") && !showThreadPanel) {
			return <CodeList onClose={handleCloseCodePanel} />;
		}

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
				return groupId ? (
					<MemberList onClose={isHalf ? handleClosePanel : undefined} />
				) : (
					<FriendList />
				);
			default:
				if (groupId && !isHalf) {
					return <MemberList />;
				}
				return isHalf ? null : <FriendList />;
		}
	};

	return (
		<AuthLayout>
			<MainBg />
			<TodoFloatingManager groups={localGroups} />

			{!settingSelect ? (
				<MainLayoutContainer>
					<TitleBar title="DevChat" icon={<User />} />
					<ContentWrapper direction="horizontal">
						<LeftSection $isHalf={isHalf}>
							<GroupSidebar />
							<LeftSidebar setSettingSelect={setSettingSelect} />
						</LeftSection>

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
					<BottomSpacer />
				</MainLayoutContainer>
			) : (
				<GroupSetting setSettingSelect={setSettingSelect} isAdmin={isAdmin} />
			)}
		</AuthLayout>
	);
};

export default MainLayout;
