/* eslint-disable @typescript-eslint/no-explicit-any */
import MainBg from "@/components/custom/MainBackground/MainBg";
import { Outlet } from "@tanstack/react-router";
import { CenterPanel, MainLayoutContainer } from "./MainLayout.styled";
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
				{/* nếu settingSelect = false: hiển thị layout chính, ngược lại hiển thị GroupSetting */}
				{!settingSelect ? (
					<>
						<MainLayoutContainer className="px-4">
							<TitleBar title="DevChat" icon={<User />} />
							<div className="grid grid-cols-12 h-[93vh]">
								<div className="col-span-2 flex gap-2">
									<GroupSidebar />
									<LeftSidebar setSettingSelect={setSettingSelect} />
								</div>

								<div className="col-span-10 flex">
									<CenterPanel>
										<Header
											setIconSelected={setIconSelected}
											iconSelected={iconSelected}
										/>

										<div className="bg-white w-full h-full rounded-br-lg">
											<Outlet />
										</div>
									</CenterPanel>

									{renderPanel()}
								</div>
							</div>
							<Profile />
						</MainLayoutContainer>
					</>
				) : (
					<GroupSetting setSettingSelect={setSettingSelect} />
				)}
			</AuthLayout>
		</>
	);
};

export default MainLayout;
