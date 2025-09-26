/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ContentWrapper, PageWrapper } from "./Channel.styled";
import { SidebarMenu } from "@/components/Sidebar/Sidebar";
import { SampleData, sampleData } from "@/sampleData";
import CenterPanel from "@/components/CenterPanel/CenterPanel";
import MainBg from "@/components/MainBackground/MainBg";
import HeaderBar from "@/components/UserHeader/UserHeader";
import { IoNotifications } from "react-icons/io5";
import ThreadPanel from "@/components/RightPanel/ThreadPanel/ThreadPanel";
import CodeList from "@/components/RightPanel/CodeList/CodeList";
import MemberList from "@/components/RightPanel/MemberList/MemberList";

export const ChatChanel: React.FC = () => {
	const data: SampleData = sampleData();

	const [activeSection, setActiveSection] = useState<any>("");
	const [channelSelected, setChannelSelected] = useState<any>("");
	const [iconSelected, setIconSelected] = useState<any>("");
	const [grNameSelected, setGrNameSelected] = useState<any>("");

	useEffect(() => {
		setActiveSection(data.groups[0]?.name || "");
		setChannelSelected(data.expanded_group.channels[0]?.name || "");
	}, [data.expanded_group, data.groups]);

	const renderPanel = () => {
		switch (iconSelected) {
			case "spool":
				return <ThreadPanel />;
			case "code":
				return <CodeList />;
			case "users":
				return <MemberList />;
			default:
				return <MemberList />;
		}
	};

	return (
		<>
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
		</>
	);
};
