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
} from "./MainLayout.styled";
import TitleBar from "./TitleBar/TitleBar";
import { User } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
import Profile from "./Profile";
import AuthLayout from "../AuthLayout";
import { useState } from "react";
import ThreadPanel from "@/components/custom/RightPanel/ThreadPanel/ThreadPanel";
import CodeList from "@/components/custom/RightPanel/CodeList/CodeList";
import MemberList from "@/components/custom/RightPanel/MemberList/MemberList";
import Header from "./Header";
import { GroupSetting } from "@/pages/GroupSetting";
import { LeftSidebar } from "./LeftSidebar/LeftSidebar";
import { ResizableHandle } from "@/components/ui/resizable";

const MainLayout = () => {
	const [iconSelected, setIconSelected] = useState<string>("");
	const [settingSelect, setSettingSelect] = useState<boolean>(false);
	const [showThreadPanel, setShowThreadPanel] = useState<boolean>(false);
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");
	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };
	const groupId = params.groupId;
	const channelId = search.channel;

	console.log("MainLayout - Current IDs:", { groupId, channelId });

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

	const handleCloseThreadPanel = () => {
		setShowThreadPanel(false);
		setSelectedThreadId("");
	};

	const renderRightPanel = () => {
		if (showThreadPanel && groupId && channelId) {
			return (
				<ThreadPanel
					key={selectedThreadId || "new-thread"}
					groupId={groupId}
					channelId={channelId}
					threadId={selectedThreadId || undefined}
					onClose={handleCloseThreadPanel}
					onThreadCreated={handleThreadCreated}
				/>
			);
		}
		switch (iconSelected) {
			case "code":
				return <CodeList />;
			case "users":
				return <MemberList />;
			case "notifications":
				return null;
			default:
				return <MemberList />;
		}
	};

	return (
		<>
			<AuthLayout>
				<MainBg />
				{!settingSelect ? (
					<MainLayoutContainer>
						<TitleBar title="DevChat" icon={<User />} />
						<ContentWrapper direction="horizontal">
							<LeftSection
								defaultSize={20}
								collapsible
								minSize={15}
								maxSize={25}
							>
								<GroupSidebar />
								<LeftSidebar setSettingSelect={setSettingSelect} />
							</LeftSection>
							<ResizableHandle />
							<RightSection defaultSize={100}>
								<CenterPanel>
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
								{renderRightPanel()}
							</RightSection>
						</ContentWrapper>
						<Profile />
						<BottomSpacer />
					</MainLayoutContainer>
				) : (
					<GroupSetting setSettingSelect={setSettingSelect} />
				)}
			</AuthLayout>
		</>
	);
};

export default MainLayout;
