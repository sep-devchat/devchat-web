import NotificationPopup from "@/components/custom/NotificationPopup/NotificationPopup";

interface TitleBarProps {
	title: string;
	icon?: React.ReactNode;
}

const TitleBar = ({ title, icon }: TitleBarProps) => {
	return (
		<div className="flex justify-between items-center p-2 px-4">
			<div></div>
			<div className="flex items-center gap-2 min-[1440px]:gap-2.5 min-[1920px]:gap-3 text-sm min-[1440px]:text-base min-[1920px]:text-lg font-bold">
				{icon && (
					<span className="dark:text-white [&>*]:w-[18px] [&>*]:h-[18px] min-[1440px]:[&>*]:w-5 min-[1440px]:[&>*]:h-5 min-[1920px]:[&>*]:w-[22px] min-[1920px]:[&>*]:h-[22px]">
						{icon}
					</span>
				)}
				<p className="dark:text-white">{title}</p>
			</div>
			<NotificationPopup />
		</div>
	);
};

export default TitleBar;
