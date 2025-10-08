/* eslint-disable @typescript-eslint/no-explicit-any */
import MainBg from "@/components/custom/MainBackground/MainBg";
import { Outlet } from "@tanstack/react-router";
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
									/>

									<OutletContainer>
										<Outlet />
									</OutletContainer>
								</CenterPanel>

								{renderPanel()}
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
