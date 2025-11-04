import React from "react";

type Props = {
	rows?: number;
};

const ChatAreaLoading: React.FC<Props> = ({ rows = 8 }) => {
	const items = Array.from({ length: rows });
	return (
		<div className="w-full flex flex-col gap-3 py-2">
			{items.map((_, i) => (
				<div
					key={i}
					className={`flex items-start gap-2 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
				>
					<div className="flex items-start gap-2 max-w-[70%]">
						{i % 2 === 0 ? (
							<div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
						) : (
							<div className="h-8 w-8" />
						)}
						<div className="flex flex-col gap-2 w-full">
							<div className="flex items-center gap-3">
								<div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
								<div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
							</div>
							<div className="bg-slate-200 rounded-lg p-3 w-[220px] animate-pulse">
								<div className="h-3 w-11/12 bg-slate-300 rounded mb-2" />
								<div className="h-3 w-8/12 bg-slate-300 rounded" />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatAreaLoading;
