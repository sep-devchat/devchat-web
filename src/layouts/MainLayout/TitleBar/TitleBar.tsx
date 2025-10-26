import NotificationPopup from "@/components/custom/NotificationPopup/NotificationPopup";

interface TitleBarProps {
	title: string;
	icon?: React.ReactNode;
}

const TitleBar = ({ title, icon }: TitleBarProps) => {
	return (
		<div className="flex justify-between items-center p-2 px-4">
			<div></div>
			<div className="flex items-center gap-3 text-lg font-bold">
				{icon && <span className="dark:text-white">{icon}</span>}
				<p className="dark:text-white">{title}</p>
			</div>

			<NotificationPopup />
		</div>
	);
};

export default TitleBar;
