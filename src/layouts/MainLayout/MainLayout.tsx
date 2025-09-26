// Layout wraps all pages; nested routes render via TanStack Router's Outlet
import { Outlet } from "@tanstack/react-router";

const HomeLayout = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default HomeLayout;
