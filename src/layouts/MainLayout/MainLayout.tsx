/* eslint-disable @typescript-eslint/no-explicit-any */
import MainBg from "@/components/custom/MainBackground/MainBg";
import {
	Outlet,
	useNavigate,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import {
	CenterPanel,
	MainLayoutContainer,
	ContentWrapper,
	RightSection,
	OutletContainer,
	BottomSpacer,
	RightPanelWrapper,
	LeftSection,
	CollapsedHeaderBar,
} from "./MainLayout.styled";
import TitleBar from "./TitleBar/TitleBar";
import { User } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
import AuthLayout from "../AuthLayout";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setProfile } from "@/store/user.slice";
import { fetchProfile } from "@/services/auth/authAPI";
import { unfriendUser } from "@/services/friendAPI";
import { showGlobalAlert } from "@/components/custom/AlertCustom/Alert";
import ConfirmModal from "@/components/custom/ConfirmModal/ConfirmModal";
import ChannelInfor from "@/components/custom/RightPanel/ChannelInfor/ChannelInfor";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = () => {
	const [settingSelect, setSettingSelect] = useState<boolean>(false);
	const [showThreadPanel, setShowThreadPanel] = useState<boolean>(false);
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");
	const params = useParams({ strict: false }) as {
		groupId?: string;
		userId?: string;
		codeBlockId?: string;
	};
	const navigate = useNavigate();
	const search = useSearch({ strict: false });
	type LayoutSearchState = typeof search;
	const groupId = params.groupId;
	const directUserId = params.userId;
	const isCodeCollabRoute = Boolean(params.codeBlockId);
	const channelId = search.channel as string | undefined;
	const threadQuery =
		typeof search.thread === "string" ? (search.thread as string) : undefined;
	const activeTab =
		typeof search.tab === "string" ? (search.tab as string) : "";
	const isConversationRoute =
		!isCodeCollabRoute && Boolean(groupId || directUserId);
	const panelTab = isConversationRoute ? activeTab : "";

	const dispatch = useDispatch();
	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	const setPanelTab = useCallback(
		(nextTab?: LayoutSearchState["tab"]) => {
			navigate({
				to: ".",
				search: (prev: LayoutSearchState | undefined) => {
					const nextSearch: LayoutSearchState = { ...(prev || {}) };
					if (nextTab) {
						nextSearch.tab = nextTab;
					} else {
						delete nextSearch.tab;
					}
					return nextSearch;
				},
				replace: true,
			});
		},
		[navigate],
	);

	const setThreadSearch = useCallback(
		(nextThread?: LayoutSearchState["thread"]) => {
			navigate({
				to: ".",
				search: (prev: LayoutSearchState | undefined) => {
					const nextSearch: LayoutSearchState = { ...(prev || {}) };
					if (nextThread) {
						nextSearch.thread = nextThread;
					} else {
						delete nextSearch.thread;
					}
					return nextSearch;
				},
				replace: true,
			});
		},
		[navigate],
	);
	const [localGroups, setLocalGroups] = useState<any[]>([]);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [isHalf, setIsHalf] = useState(window.innerWidth < 1220);
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [unfriendTarget, setUnfriendTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
	const [isUnfriendLoading, setIsUnfriendLoading] = useState(false);
	const previousGroupIdRef = useRef<string | undefined>();
	const previousChannelIdRef = useRef<string | undefined>();
	const previousDirectUserIdRef = useRef<string | undefined>();
	const adminRedirectedRef = useRef(false);

	const hasOpenPanel =
		!isCodeCollabRoute && isHalf && (showThreadPanel || Boolean(panelTab));

	const shouldShowBorderRadius =
		!isCodeCollabRoute &&
		(showThreadPanel || Boolean(panelTab)) &&
		panelTab !== "users";

	// Refetch groups function
	const refetchGroups = useCallback(async () => {
		try {
			const res = await listGroups();
			const payload = (res && (res.data ?? res)) as GroupResponse[];

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
	}, []);

	// Handle resize
	useEffect(() => {
		const handleResize = () => setIsHalf(window.innerWidth < 1220);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Listen for profile updates from Settings page
	useEffect(() => {
		const handleProfileUpdate = async () => {
			try {
				const res = await fetchProfile();
				const data = res?.data ?? res;
				dispatch(setProfile(data));
				console.log("Profile refreshed in MainLayout:", data);
			} catch (err) {
				console.error("Failed to refresh profile in MainLayout:", err);
			}
		};

		window.addEventListener("app:profileUpdated", handleProfileUpdate);
		return () => {
			window.removeEventListener("app:profileUpdated", handleProfileUpdate);
		};
	}, [dispatch]);

	// Redirect admins to the dedicated dashboard
	useEffect(() => {
		if (!currentUserProfile?.isAdmin || adminRedirectedRef.current) {
			return;
		}
		adminRedirectedRef.current = true;
		navigate({
			to: "/admin",
			replace: true,
		});
	}, [currentUserProfile?.isAdmin, navigate]);

	useEffect(() => {
		if (isHalf && groupId) {
			setPanelTab(undefined);
			setShowThreadPanel(false);
			setSelectedThreadId("");
			setThreadSearch(undefined);
		}
	}, [groupId, isHalf, setPanelTab, setThreadSearch]);

	// Load groups on mount
	useEffect(() => {
		let mounted = true;

		const initLoad = async () => {
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

		initLoad();

		// Listen for refresh event
		const handleRefresh = () => refetchGroups();
		window.addEventListener("app:refreshTodoGroups", handleRefresh);

		return () => {
			mounted = false;
			window.removeEventListener("app:refreshTodoGroups", handleRefresh);
		};
	}, [refetchGroups]);

	// Fetch group detail để check admin
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

	// Handle thread panel
	useEffect(() => {
		if (showThreadPanel && panelTab) {
			setPanelTab(undefined);
		}
	}, [showThreadPanel, panelTab, setPanelTab]);

	useEffect(() => {
		if (!groupId || !channelId || !threadQuery) {
			return;
		}
		setSelectedThreadId(threadQuery);
		setShowThreadPanel(true);
		setPanelTab(undefined);
	}, [groupId, channelId, threadQuery, setPanelTab]);

	useEffect(() => {
		const groupChanged = Boolean(
			previousGroupIdRef.current && previousGroupIdRef.current !== groupId,
		);
		const channelChanged = Boolean(
			previousChannelIdRef.current &&
				previousChannelIdRef.current !== channelId,
		);
		const directChanged = Boolean(
			previousDirectUserIdRef.current &&
				previousDirectUserIdRef.current !== directUserId,
		);
		if (showThreadPanel && (groupChanged || channelChanged || directChanged)) {
			setShowThreadPanel(false);
			setSelectedThreadId("");
			setThreadSearch(undefined);
		}
		previousGroupIdRef.current = groupId;
		previousChannelIdRef.current = channelId;
		previousDirectUserIdRef.current = directUserId;
	}, [groupId, channelId, directUserId, showThreadPanel, setThreadSearch]);

	// Listen for thread selection requests coming from ChatArea (message thread button)
	useEffect(() => {
		const onThreadSelected = (e: Event) => {
			try {
				const ce = e as CustomEvent;
				const tid = ce.detail?.threadId as string | undefined;
				if (tid) {
					setSelectedThreadId(tid);
					setShowThreadPanel(true);
					setPanelTab(undefined);
					setThreadSearch(tid);
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
		setPanelTab(undefined);
		setThreadSearch(undefined);
	};

	const handleThreadCreated = (threadId: string) => {
		setSelectedThreadId(threadId);
		setShowThreadPanel(true);
		setThreadSearch(threadId);
		window.dispatchEvent(new CustomEvent("app:threadCreated"));
	};

	const handleThreadSelect = (threadId: string) => {
		setSelectedThreadId(threadId);
		setShowThreadPanel(true);
		setPanelTab(undefined);
		setThreadSearch(threadId);
	};

	const handleClosePanel = () => {
		setPanelTab(undefined);
		setShowThreadPanel(false);
		setSelectedThreadId("");
		setThreadSearch(undefined);
	};

	const handleCloseCodePanel = () => {
		setPanelTab(undefined);
	};

	const handleIconSelect = (icon: string) => {
		if (!icon) {
			setPanelTab(undefined);
			return;
		}
		setPanelTab(icon as LayoutSearchState["tab"]);
	};

	const handleBackToChat = () => {
		if (panelTab) {
			setPanelTab(undefined);
		}
		if (showThreadPanel) {
			setShowThreadPanel(false);
			setSelectedThreadId("");
			setThreadSearch(undefined);
		}
	};

	const handleMenuAction = (
		action: string,
		friendName: string,
		friendId: string,
	) => {
		setActiveMenu(null);

		if (action === "Unfriend") {
			setUnfriendTarget({ id: friendId, name: friendName });
			setIsUnfriendModalOpen(true);
		}
	};

	useEffect(() => {
		const handleClickOutside = () => {
			if (activeMenu) setActiveMenu(null);
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [activeMenu]);

	const handleCloseUnfriendModal = () => {
		setIsUnfriendModalOpen(false);
		setUnfriendTarget(null);
	};

	const confirmUnfriendAction = async () => {
		if (!unfriendTarget || isUnfriendLoading) return;

		setIsUnfriendLoading(true);
		try {
			await unfriendUser(unfriendTarget.id);

			// setAllFriends((prev) => prev.filter((f) => f.id !== unfriendTarget.id));

			showGlobalAlert({
				type: "success",
				message: `You have unfriended ${unfriendTarget.name}`,
			});

			window.dispatchEvent(new CustomEvent("friendListUpdated"));

			handleCloseUnfriendModal();
		} catch (err) {
			console.error("Unfriend failed", err);
			showGlobalAlert({
				type: "error",
				message: "Unable to unfriend. Please try again!",
			});
		} finally {
			setIsUnfriendLoading(false);
		}
	};

	useEffect(() => {
		const handleClickOutside = () => {
			if (activeMenu) setActiveMenu(null);
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [activeMenu]);

	// Auto show users panel chỉ khi KHÔNG phải isHalf
	useEffect(() => {
		if (groupId && !panelTab && !showThreadPanel && !isHalf) {
			setPanelTab("users");
		}
		if (!groupId && panelTab === "users") {
			setPanelTab(undefined);
		}
	}, [groupId, showThreadPanel, panelTab, isHalf, setPanelTab]);

	const renderRightPanel = () => {
		if (isCodeCollabRoute) {
			return null;
		}

		const resolvedTab = panelTab || (!isHalf && groupId ? "users" : "");

		if (showThreadPanel && groupId && channelId) {
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

		switch (resolvedTab) {
			case "tasks":
				return <TaskGroup groupId={groupId} onClose={handleClosePanel} />;
			case "code":
				return (
					<CodeList
						onClose={handleCloseCodePanel}
						groupId={groupId}
						channelId={channelId}
						directUserId={directUserId}
					/>
				);
			case "users":
				return groupId ? (
					<MemberList
						isHalf={isHalf}
						onClose={isHalf ? handleClosePanel : undefined}
					/>
				) : (
					<FriendList onMenuAction={handleMenuAction} />
				);
			case "info":
				if (groupId) {
					return <ChannelInfor groupId={groupId} channelId={channelId} />;
				}
				if (directUserId) {
					return <ChannelInfor directUserId={directUserId} />;
				}
				return null;
			default:
				if (groupId && !isHalf) {
					return <MemberList />;
				}
				return isHalf ? null : <FriendList onMenuAction={handleMenuAction} />;
		}
	};

	return (
		<AuthLayout>
			<MainBg />
			<TodoFloatingManager groups={localGroups} onRefresh={refetchGroups} />
			<Toaster richColors />

			{!settingSelect ? (
				<MainLayoutContainer>
					<TitleBar title="DevChat" icon={<User />} />
					<ContentWrapper direction="horizontal">
						{!isCodeCollabRoute && (
							<LeftSection $isHalf={isHalf}>
								<GroupSidebar />
								<LeftSidebar setSettingSelect={setSettingSelect} />
							</LeftSection>
						)}

						<RightSection
							defaultSize={100}
							style={{
								marginRight: !isCodeCollabRoute && isHalf ? "16px" : "0",
							}}
						>
							<CenterPanel
								$isHalf={isHalf}
								$hasRightBorderRadius={shouldShowBorderRadius}
								$isCollapsed={hasOpenPanel}
							>
								{!isCodeCollabRoute && (
									<CollapsedHeaderBar $isCollapsed={hasOpenPanel}>
										<Header
											setIconSelected={handleIconSelect}
											iconSelected={panelTab}
											onCreateThread={handleCreateThread}
											onThreadSelect={handleThreadSelect}
											showBackButton={hasOpenPanel}
											onBackClick={handleBackToChat}
										/>
									</CollapsedHeaderBar>
								)}

								<OutletContainer
									$hidden={!isCodeCollabRoute && hasOpenPanel}
									$fullBleed={isCodeCollabRoute}
									$type={panelTab}
								>
									<Outlet />
								</OutletContainer>
							</CenterPanel>
							{!isCodeCollabRoute && (
								<RightPanelWrapper $fullWidth={hasOpenPanel}>
									{renderRightPanel()}
								</RightPanelWrapper>
							)}
						</RightSection>
					</ContentWrapper>
					<BottomSpacer />

					{isUnfriendModalOpen && unfriendTarget && (
						<ConfirmModal
							isOpen={isUnfriendModalOpen}
							title={`Confirm Unfriend ${unfriendTarget.name}`}
							message={`Are you sure you want to unfriend ${unfriendTarget.name}? This action cannot be undone.`}
							confirmText="Unfriend"
							cancelText="Cancel"
							onConfirm={confirmUnfriendAction}
							onCancel={handleCloseUnfriendModal}
							isLoading={isUnfriendLoading}
						/>
					)}
				</MainLayoutContainer>
			) : (
				<GroupSetting
					setSettingSelect={setSettingSelect}
					isAdmin={isAdmin}
					groupId={groupId || ""}
				/>
			)}
		</AuthLayout>
	);
};

export default MainLayout;
