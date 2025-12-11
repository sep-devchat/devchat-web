import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AlertCircle,
	Calendar,
	Flag,
	GripVertical,
	RefreshCw,
} from "lucide-react";
import {
	BadgeRow,
	DeadlineCard,
	Desc,
	Header,
	InfoFooter,
	Note,
	Root,
	StatusBlock,
	TaskBoardButton,
	TaskContent,
	TaskInfoColumn,
	TaskItem,
	TaskList,
	TaskMain,
	TaskMetaColumn,
	Title,
} from "./GroupTodo.styled";
import {
	DragHandle,
	PriorityBadge,
	Select,
} from "../PersonalTodo/PersonalTodo.styled";
import {
	taskAPI,
	TaskQuery,
	UpdateTaskStatusRequest,
} from "@/services/taskAPI";
import { Task as ApiTask, TaskStatus } from "@/types/task";
import { RootState } from "@/store";
import { resolveLockState } from "../../RightPanel/TaskGroup/TaskGroup.helpers";

type DisplayTask = {
	id: string;
	name: string;
	description?: string | null;
	priority?: number | null;
	status?: TaskStatus;
	startDate?: string | null;
	dueDate?: string | null;
	createdAt?: number;
	done?: boolean;
	isLocked?: boolean;
	lockedAt?: string;
};

type Props = {
	groupId?: string;
	groupName?: string;
};

const ACTIVE_STATUSES: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS];
const ACTIVE_STATUS_QUERY = ACTIVE_STATUSES.join(",");
const LOCKED_TASK_MESSAGE =
	"Tasks marked as done for more than 3 days can no longer be updated or deleted.";

function convertApiTaskToLocalTask(apiTask: ApiTask): DisplayTask {
	const { isLocked, lockedAt } = resolveLockState(apiTask);
	return {
		id: apiTask.id,
		name: apiTask.name,
		description: apiTask.description,
		priority: apiTask.priority,
		status: apiTask.status,
		startDate: apiTask.startDate,
		dueDate: apiTask.dueDate,
		createdAt: new Date(apiTask.createdAt).getTime(),
		done: apiTask.status === TaskStatus.DONE,
		isLocked,
		lockedAt,
	};
}

function formatDateShort(iso?: string | null) {
	if (!iso) return "Not set";
	return new Date(iso).toLocaleDateString();
}

function daysDiffFromNow(iso?: string | null) {
	if (!iso) return null;
	const deadline = new Date(iso).getTime();
	const diff = deadline - Date.now();
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusLabel(status?: TaskStatus) {
	switch (status) {
		case TaskStatus.IN_PROGRESS:
			return "In Progress";
		case TaskStatus.DONE:
			return "Done";
		default:
			return "To Do";
	}
}

function getStatusColor(status?: TaskStatus) {
	switch (status) {
		case TaskStatus.DONE:
			return "#16a34a";
		case TaskStatus.IN_PROGRESS:
			return "#0ea5e9";
		default:
			return "#475569";
	}
}

export default function GroupTodo({ groupId, groupName }: Props) {
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const dragItemIdRef = useRef<string | null>(null);
	const [showDoneTasks, setShowDoneTasks] = useState(false);
	const queryClient = useQueryClient();
	const hasValidGroup = Boolean(groupId);
	const currentUserId = useSelector(
		(state: RootState) => state.user.profile?.id,
	);

	const taskQueryParams: TaskQuery = {
		page: 1,
		limit: 100,
		status: ACTIVE_STATUS_QUERY + (showDoneTasks ? `,${TaskStatus.DONE}` : ""),
	};
	if (currentUserId) {
		taskQueryParams.assigneeId = currentUserId;
	}

	const queryKey = [
		"group-todo",
		"user",
		groupId,
		currentUserId ?? "anonymous",
		showDoneTasks ? "with-done" : "active-only",
	];
	const {
		data: apiTasks = [],
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useQuery<DisplayTask[]>({
		queryKey,
		queryFn: async () => {
			if (!groupId) return [];
			const response = await taskAPI.getTasks(groupId, taskQueryParams);
			const payload = Array.isArray(response)
				? response
				: (response?.data ?? []);
			return payload.map(convertApiTaskToLocalTask);
		},
		enabled: hasValidGroup,
		refetchInterval: hasValidGroup ? 5000 : false,
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: true,
		staleTime: 1000,
	});

	const updateTaskStatusMutation = useMutation({
		mutationFn: async ({
			taskId,
			data,
		}: {
			taskId: string;
			data: UpdateTaskStatusRequest;
		}) => {
			if (!groupId) return;
			await taskAPI.updateTaskStatus(groupId, taskId, data);
		},
		onSuccess: () => {
			if (groupId) {
				queryClient.invalidateQueries({ queryKey });
				// Force immediate refetch
				refetch();
			}
		},
	});

	// Force refetch when window/app becomes visible again
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && hasValidGroup) {
				console.log("GroupTodo: App became visible, refreshing tasks");
				refetch();
			}
		};

		const handleAppResume = () => {
			if (hasValidGroup) {
				console.log("GroupTodo: App resumed, refreshing tasks");
				refetch();
			}
		};

		const handleTodoWindowOpened = () => {
			if (hasValidGroup) {
				console.log("GroupTodo: Todo window opened, refreshing tasks");
				refetch();
			}
		};

		// Listen for visibility changes (works on web and mobile)
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Listen for custom app resume events (for mobile apps)
		window.addEventListener("app:resume", handleAppResume);

		// Listen for todo window opened event
		window.addEventListener("app:todoWindowOpened", handleTodoWindowOpened);

		// Also listen for window focus (backup for desktop)
		window.addEventListener("focus", handleAppResume);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("app:resume", handleAppResume);
			window.removeEventListener(
				"app:todoWindowOpened",
				handleTodoWindowOpened,
			);
			window.removeEventListener("focus", handleAppResume);
		};
	}, [hasValidGroup, refetch]);

	const usingSampleData = !hasValidGroup;
	const tasksToRender = apiTasks;
	const isRefreshing = !usingSampleData && isFetching && !isLoading;
	const statusControlDisabled =
		!usingSampleData && updateTaskStatusMutation.isPending;

	const handleRefresh = () => {
		if (groupId) {
			queryClient.invalidateQueries({ queryKey });
		}
		window.dispatchEvent(new CustomEvent("app:refreshTodoGroups"));
	};

	const handleStatusChange = (taskId: string, status: TaskStatus) => {
		const targetTask = tasksToRender.find((task) => task.id === taskId);
		if (targetTask?.isLocked) {
			return;
		}
		updateTaskStatusMutation.mutate({ taskId, data: { status } });
	};

	const onDragStart = (event: React.DragEvent, id: string) => {
		if (!usingSampleData) return;
		dragItemIdRef.current = id;
		setDraggingId(id);
		event.dataTransfer?.setData("text/plain", id);
	};

	const onDragOver = (event: React.DragEvent, overId: string) => {
		if (!usingSampleData) return;
		event.preventDefault();
		if (dragItemIdRef.current === overId) return;
	};

	const onDrop = (event: React.DragEvent, targetId: string) => {
		if (!usingSampleData) return;
		event.preventDefault();
		const sourceId = dragItemIdRef.current;
		if (!sourceId || sourceId === targetId) {
			cleanupDrag();
			return;
		}

		cleanupDrag();
	};

	const onDragEnd = () => {
		if (!usingSampleData) return;
		cleanupDrag();
	};

	const cleanupDrag = () => {
		dragItemIdRef.current = null;
		setDraggingId(null);
	};

	const renderList = () => {
		if (isLoading && !usingSampleData) {
			return <Note>Loading tasks…</Note>;
		}

		if (!tasksToRender.length) {
			return (
				<Note>
					{usingSampleData
						? "Select a group to load your assigned tasks. Sample tasks show here for reference."
						: "No tasks found for this group yet."}
				</Note>
			);
		}

		return (
			<TaskList>
				{tasksToRender.map((task: DisplayTask) => {
					const daysLeft = daysDiffFromNow(task.dueDate);
					const isDueSoon = daysLeft !== null && daysLeft <= 2 && daysLeft >= 0;
					const isOverdue = daysLeft !== null && daysLeft < 0;
					const priorityLevel = task.priority ?? 3;
					const priorityLabel =
						priorityLevel === 1 ? "P1" : priorityLevel === 2 ? "P2" : "P3";
					const statusLabel = getStatusLabel(task.status);
					const statusColor = getStatusColor(task.status);
					const isTaskLocked = Boolean(task.isLocked);
					const lockedSince = task.lockedAt
						? formatDateShort(task.lockedAt)
						: null;

					return (
						<TaskItem
							key={task.id}
							draggable={usingSampleData}
							onDragStart={(event) => onDragStart(event, task.id)}
							onDragOver={(event) => onDragOver(event, task.id)}
							onDrop={(event) => onDrop(event, task.id)}
							onDragEnd={onDragEnd}
							dragging={draggingId === task.id}
						>
							<DragHandle
								title={
									usingSampleData
										? "Drag to reorder sample tasks"
										: "Reordering disabled for synced tasks"
								}
								style={{
									opacity: usingSampleData ? 1 : 0.35,
									cursor: usingSampleData ? "grab" : "not-allowed",
								}}
							>
								<GripVertical size={16} color="#94a3b8" />
							</DragHandle>

							<TaskMain>
								<TaskContent
									style={{ opacity: statusControlDisabled ? 0.9 : 1 }}
								>
									<TaskInfoColumn>
										<Title done={task.done}>{task.name}</Title>
										<Desc>{task.description || ""}</Desc>
										<InfoFooter>
											Start: {formatDateShort(task.startDate)}
										</InfoFooter>
									</TaskInfoColumn>

									<TaskMetaColumn>
										<BadgeRow>
											{priorityLevel !== 0 && (
												<PriorityBadge level={priorityLevel}>
													<Flag size={14} />
													{priorityLabel}
												</PriorityBadge>
											)}
										</BadgeRow>

										{task.dueDate ? (
											<DeadlineCard
												$variant={
													isOverdue ? "overdue" : isDueSoon ? "soon" : "default"
												}
												title={
													isOverdue
														? "Deadline passed"
														: isDueSoon
															? `Due in ${Math.max(daysLeft ?? 0, 0)} days`
															: `Due: ${new Date(task.dueDate).toLocaleString()}`
												}
											>
												{isOverdue ? (
													<AlertCircle size={16} color="#dc2626" />
												) : (
													<Calendar size={14} color="#64748b" />
												)}
												<span>
													{isDueSoon
														? `Due in ${Math.max(daysLeft ?? 0, 0)} days`
														: formatDateShort(task.dueDate)}
												</span>
											</DeadlineCard>
										) : (
											<DeadlineCard $variant="default">
												<Calendar size={14} color="#94a3b8" />
												<span>No due date</span>
											</DeadlineCard>
										)}

										<StatusBlock>
											<div style={{ color: statusColor }}>
												Status: <strong>{statusLabel}</strong>
												{isTaskLocked && (
													<span
														style={{
															marginLeft: "0.35rem",
															fontSize: "0.75rem",
														}}
													>
														(locked)
													</span>
												)}
											</div>
											<Select
												value={task.status ?? TaskStatus.TODO}
												onChange={(event) =>
													handleStatusChange(
														task.id,
														Number(event.target.value) as TaskStatus,
													)
												}
												disabled={statusControlDisabled || isTaskLocked}
												title={
													isTaskLocked && lockedSince
														? `${LOCKED_TASK_MESSAGE}\nLocked since ${lockedSince}`
														: isTaskLocked
															? LOCKED_TASK_MESSAGE
															: undefined
												}
											>
												<option value={TaskStatus.TODO}>To Do</option>
												<option value={TaskStatus.IN_PROGRESS}>
													In Progress
												</option>
												<option value={TaskStatus.DONE}>Done</option>
											</Select>
											{isTaskLocked && (
												<small
													style={{ color: "#dc2626", marginTop: "0.25rem" }}
												>
													{LOCKED_TASK_MESSAGE}
												</small>
											)}
										</StatusBlock>
									</TaskMetaColumn>
								</TaskContent>
							</TaskMain>
						</TaskItem>
					);
				})}
			</TaskList>
		);
	};

	return (
		<Root>
			<Header>
				<div>
					<div style={{ fontWeight: 600, color: "#0f172a" }}>
						{groupName ? `${groupName} tasks` : "Group tasks"}
					</div>
					{usingSampleData && (
						<Note>"Select a group to load your assigned tasks."</Note>
					)}
				</div>
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<TaskBoardButton
						onClick={handleRefresh}
						title="Refresh tasks and groups"
						disabled={isRefreshing}
						style={{ padding: "0.5rem" }}
					>
						<RefreshCw
							size={16}
							style={{
								animation: isRefreshing ? "spin 1s linear infinite" : "none",
							}}
						/>
					</TaskBoardButton>
					<TaskBoardButton
						onClick={() => setShowDoneTasks((prev) => !prev)}
						title="Toggle showing completed tasks"
						disabled={isRefreshing}
					>
						{showDoneTasks ? "Hide done" : "Show done"}
					</TaskBoardButton>
				</div>
			</Header>

			{isError && (
				<Note style={{ color: "#dc2626" }}>
					Unable to load tasks right now.
				</Note>
			)}

			{renderList()}
		</Root>
	);
}
