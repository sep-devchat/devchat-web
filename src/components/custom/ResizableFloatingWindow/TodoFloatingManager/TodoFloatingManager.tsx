/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ResizableFloatingWindow from "../ResizableFloating/ResizableFloatingWindow";
import GroupTodo from "../GroupTodo/GroupTodo";

const buildGroupTabId = (id: string) => `group-${id}`;

export type Group = { id: string; name: string };

type Props = { groups?: Group[]; onRefresh?: () => void | Promise<void> };

export default function TodoFloatingManager({ groups = [], onRefresh }: Props) {
	const [visible, setVisible] = useState(false);
	const [minimized, setMinimized] = useState(false);

	const firstGroupTabId = groups.length
		? buildGroupTabId(groups[0].id)
		: undefined;

	const [activeTabId, setActiveTabId] = useState<string | undefined>(
		firstGroupTabId,
	);

	useEffect(() => {
		function onOpen(e: any) {
			const tabFromEvent = e?.detail?.tabId;
			const fallback = tabFromEvent ?? firstGroupTabId;
			setActiveTabId(fallback);
			setVisible(true);
			setMinimized(false);

			// Refetch groups when opening the todo window
			if (onRefresh) {
				onRefresh();
			}

			// Dispatch event to notify GroupTodo to refresh
			window.dispatchEvent(new CustomEvent("app:todoWindowOpened"));
		}
		window.addEventListener("app:openTodoWindow", onOpen as any);
		return () =>
			window.removeEventListener("app:openTodoWindow", onOpen as any);
	}, [firstGroupTabId, onRefresh]);

	useEffect(() => {
		if (!groups.length) {
			setActiveTabId(undefined);
			return;
		}

		setActiveTabId((current) => {
			const availableIds = groups.map((group) => buildGroupTabId(group.id));
			if (current && availableIds.includes(current)) {
				return current;
			}
			return availableIds[0];
		});
	}, [groups]);

	const tabs = groups.map((group) => ({
		id: buildGroupTabId(group.id),
		title: group.name,
		content: <GroupTodo groupId={group.id} groupName={group.name} />,
	}));

	const activeGroup = groups.find(
		(group) => buildGroupTabId(group.id) === activeTabId,
	);

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
		setActiveTabId((current) => current ?? firstGroupTabId);

		// Refetch groups when restoring from minimized
		if (onRefresh) {
			onRefresh();
		}

		// Dispatch event to notify GroupTodo to refresh
		window.dispatchEvent(new CustomEvent("app:todoWindowOpened"));
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
							{activeGroup ? (
								<GroupTodo
									groupId={activeGroup.id}
									groupName={activeGroup.name}
								/>
							) : (
								<div className="text-sm text-slate-500">
									No groups available yet.
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
