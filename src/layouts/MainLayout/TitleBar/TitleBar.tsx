interface TitleBarProps {
	title: string;
	icon?: React.ReactNode;
}

const TitleBar = ({ title, icon }: TitleBarProps) => {
	return (
		<div className="flex justify-center items-center gap-3 p-2">
			<div className="flex items-center gap-3 text-lg font-bold">
				{icon && <span className="dark:text-white">{icon}</span>}
				<p className="dark:text-white">{title}</p>
			</div>
		</div>
	);
};

export default TitleBar;
