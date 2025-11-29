/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ContentWrapper, PageWrapper } from "./Channel.styled";
import { SidebarMenu } from "@/components/custom/Sidebar/Sidebar";
import { SampleData, sampleData } from "@/sampleData";
import CenterPanel from "@/components/custom/CenterPanel/CenterPanel";
import MainBg from "@/components/custom/MainBackground/MainBg";
import HeaderBar from "@/components/custom/UserHeader/UserHeader";
import { IoNotifications } from "react-icons/io5";
import ThreadPanel from "@/components/custom/RightPanel/ThreadPanel/ThreadPanel";
import CodeList from "@/components/custom/RightPanel/CodeList/CodeList";
import MemberList from "@/components/custom/RightPanel/MemberList/MemberList";
import AuthLayout from "@/layouts/AuthLayout";

import { useParams, useSearch } from "@tanstack/react-router";

export const ChatChannel: React.FC = () => {
	const data: SampleData = sampleData();

	const params = useParams({ strict: false }) as { groupId?: string };
	const search = useSearch({ strict: false }) as { channel?: string };

	const groupId = params.groupId;
	const channelId = search.channel;

	const [activeSection, setActiveSection] = useState<any>("");
	const [channelSelected, setChannelSelected] = useState<any>("");
	const [iconSelected, setIconSelected] = useState<any>("");
	const [grNameSelected, setGrNameSelected] = useState<any>("");
	const [selectedThreadId, setSelectedThreadId] = useState<string>("");

	useEffect(() => {
		setActiveSection(data.groups[0]?.name || "");
		setChannelSelected(data.expanded_group.channels[0]?.name || "");
	}, [data.expanded_group, data.groups]);

	const handleCloseThreadPanel = () => {
		setIconSelected("");
		setSelectedThreadId("");
	};

	const handleThreadCreated = () => {};

	const renderPanel = () => {
		switch (iconSelected) {
			case "spool":
				return groupId && channelId ? (
					<ThreadPanel
						groupId={groupId}
						channelId={channelId}
						threadId={selectedThreadId}
						onClose={handleCloseThreadPanel}
						onThreadCreated={handleThreadCreated}
					/>
				) : null;
			case "code":
				return <CodeList groupId={groupId} channelId={channelId} />;
			case "users":
				return <MemberList />;
			default:
				return <MemberList />;
		}
	};

	return (
		<AuthLayout>
			<MainBg />
			<PageWrapper>
				<HeaderBar
					title={grNameSelected ?? "Hi friend!"}
					right={<IoNotifications />}
				/>
				<ContentWrapper>
					<SidebarMenu
						activeSection={activeSection}
						channelSelected={channelSelected}
						setGrNameSelected={setGrNameSelected}
					/>
					<CenterPanel
						currentUserId="user-123"
						setIconSelected={setIconSelected}
						iconSelected={iconSelected}
					/>
					{renderPanel()}
				</ContentWrapper>
			</PageWrapper>
		</AuthLayout>
	);
};

export default ChatChannel;
