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
		setShowThreadPanel(true);
		setSelectedThreadId("");
		setIconSelected("");
	};

	const handleThreadCreated = () => {
		setShowThreadPanel(false);
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
					groupId={groupId}
					channelId={channelId}
					threadId={selectedThreadId}
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
						<ContentWrapper>
							<LeftSection>
								<GroupSidebar />
								<LeftSidebar setSettingSelect={setSettingSelect} />
							</LeftSection>
							<RightSection>
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
