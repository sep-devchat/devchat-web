// Layout wraps all pages; nested routes render via TanStack Router's Outlet
import MainBg from "@/components/custom/MainBackground/MainBg";
import { Outlet } from "@tanstack/react-router";
import { MainLayoutContainer } from "./MainLayout.styled";
import TitleBar from "./TitleBar/TitleBar";
import { User } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
import LeftSidebar from "./LeftSidebar";
import Header from "./Header";
import Profile from "./Profile";

const MainLayout = () => {
	return (
		<>
			<MainBg />
			<MainLayoutContainer className="px-4">
				<TitleBar title="DevChat" icon={<User />} />
				<div className="grid grid-cols-12 h-[93vh]">
					<div className="col-span-2 flex gap-2">
						<GroupSidebar />
						<LeftSidebar />
					</div>
					<div className="col-span-10 flex flex-col">
						<Header />
						<div className="bg-white w-full h-full rounded-br-lg">
							<Outlet />
						</div>
					</div>
				</div>
				<Profile />
			</MainLayoutContainer>
		</>
	);
};

export default MainLayout;
