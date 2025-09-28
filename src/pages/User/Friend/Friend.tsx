import React, { useEffect, useState } from "react";
import { ContentWrapper, PageWrapper } from "./Friend.styled";
import { SampleData, sampleData } from "@/sampleData";
import MainBg from "@/components/MainBackground/MainBg";
import HeaderBar from "@/components/UserHeader/UserHeader";
import { IoNotifications } from "react-icons/io5";
import ThreadPanel from "@/components/RightPanel/ThreadPanel/ThreadPanel";
import CodeList from "@/components/RightPanel/CodeList/CodeList";
import MemberList from "@/components/RightPanel/MemberList/MemberList";
import FriendCenter from "@/components/FriendCenter/FriendCenter";
import MainNav from "@/components/MainNav/MenuNav";

export const ChatChanel: React.FC = () => {
	const data: SampleData = sampleData();

	const [activeSection, setActiveSection] = useState<any>("");
	const [channelSelected, setChannelSelected] = useState<any>("");
	const [iconSelected] = useState<any>("");
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
					<MainNav
						activeSection={activeSection}
						channelSelected={channelSelected}
						setGrNameSelected={setGrNameSelected}
					/>
					<FriendCenter />
					{renderPanel()}
				</ContentWrapper>
			</PageWrapper>
		</>
	);
};
