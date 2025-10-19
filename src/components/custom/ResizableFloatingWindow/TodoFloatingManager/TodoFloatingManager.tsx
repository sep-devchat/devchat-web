/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ResizableFloatingWindow from "../ResizableFloating/ResizableFloatingWindow";
import PersonalTodo from "../PersonalTodo/PersonalTodo";
import GroupTodo from "../GroupTodo/GroupTodo";

export type Group = { id: string; name: string };

type Props = { groups?: Group[] };

export default function TodoFloatingManager({ groups = [] }: Props) {
	const [visible, setVisible] = useState(false);
	const [minimized, setMinimized] = useState(false);
	const [activeTabId, setActiveTabId] = useState<string | undefined>(
		"personal",
	);

	useEffect(() => {
		function onOpen(e: any) {
			const tabFromEvent = e?.detail?.tabId;
			setActiveTabId(tabFromEvent ?? "personal");
			setVisible(true);
			setMinimized(false);
		}
		window.addEventListener("app:openTodoWindow", onOpen as any);
		return () =>
			window.removeEventListener("app:openTodoWindow", onOpen as any);
	}, []);

	const tabs = [
		{ id: "personal", title: "Personal", content: <PersonalTodo /> },
		...groups.map((g) => ({
			id: `group-${g.id}`,
			title: g.name,
			content: <GroupTodo groupId={g.id} groupName={g.name} />,
		})),
	];

	function handleClose() {
		setVisible(false);
		setMinimized(false);
	}

	function handleMinimize() {
		setVisible(false);
		setMinimized(true);
	}

	function restoreFromMini() {
		setVisible(true);
		setMinimized(false);
		setActiveTabId("personal");
	}

	return (
		<>
			{visible && (
				<ResizableFloatingWindow
					title="TODO"
					initialWidth={700}
					initialHeight={420}
					tabs={tabs}
					initialTabId={activeTabId}
					onClose={handleClose}
					onMinimize={handleMinimize}
				/>
			)}

			{minimized && (
				<div className="fixed left-4 bottom-4 z-[9998]" style={{ width: 240 }}>
					<div className="rounded-md shadow-lg bg-white border border-slate-200 overflow-hidden">
						<div className="flex items-center justify-between p-2">
							<div className="text-sm font-medium">TODO</div>
							<div className="flex items-center gap-1">
								<button
									aria-label="Restore todo"
									onClick={restoreFromMini}
									className="px-2 py-1 rounded hover:bg-slate-50 focus:outline-none"
								>
									▢
								</button>
								<button
									aria-label="Close mini todo"
									onClick={() => setMinimized(false)}
									className="px-2 py-1 rounded hover:bg-red-50 focus:outline-none"
								>
									✕
								</button>
							</div>
						</div>
						<div className="p-3 border-t border-slate-100">
							<PersonalTodo />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
