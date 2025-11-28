import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Calendar, Flag, GripVertical } from "lucide-react";
import {
	BadgeRow,
	DeadlineCard,
	Desc,
	Header,
	InfoFooter,
	Note,
	Root,
	StatusBlock,
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
};

type Props = {
	groupId?: string;
	groupName?: string;
};

const ACTIVE_STATUSES: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS];
const ACTIVE_STATUS_QUERY = ACTIVE_STATUSES.join(",");

const now = Date.now();
const SAMPLE_TASKS: DisplayTask[] = [
	{
		id: "sample-1",
		name: "Share product update",
		description: "Summarize launch decisions with the design guild.",
		priority: 1,
		status: TaskStatus.TODO,
		startDate: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
		dueDate: new Date(now + 1000 * 60 * 60 * 24 * 2).toISOString(),
		createdAt: now - 1000 * 60 * 60 * 12,
		done: false,
	},
	{
		id: "sample-2",
		name: "Prep weekly sync",
		description: "Collect blockers before Friday's check-in.",
		priority: 2,
		status: TaskStatus.IN_PROGRESS,
		startDate: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
		dueDate: new Date(now + 1000 * 60 * 60 * 24 * 5).toISOString(),
		createdAt: now - 1000 * 60 * 60 * 3,
		done: false,
	},
	{
		id: "sample-3",
		name: "Close retro items",
		description: "Mark the last sprint's retro tasks as done.",
		priority: 3,
		status: TaskStatus.DONE,
		startDate: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
		dueDate: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
		createdAt: now - 1000 * 60 * 60 * 24,
		done: true,
	},
];

function convertApiTaskToLocalTask(apiTask: ApiTask): DisplayTask {
	try {
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
		};
	} catch (error) {
		console.warn("Unable to convert task", error, apiTask);
		return {
			id: apiTask.id || crypto.randomUUID(),
			name: apiTask.name || "Untitled task",
			description: apiTask.description,
			priority: apiTask.priority ?? 3,
			status: apiTask.status ?? TaskStatus.TODO,
			startDate: apiTask.startDate,
			dueDate: apiTask.dueDate,
			createdAt: Date.now(),
			done: apiTask.status === TaskStatus.DONE,
		};
	}
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
	const [sampleTasks, setSampleTasks] = useState<DisplayTask[]>(SAMPLE_TASKS);
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const dragItemIdRef = useRef<string | null>(null);
	const queryClient = useQueryClient();
	const hasValidGroup = Boolean(groupId);
	const currentUserId = useSelector(
		(state: RootState) => state.user.profile?.id,
	);

	const taskQueryParams: TaskQuery = {
		page: 1,
		limit: 100,
		status: ACTIVE_STATUS_QUERY,
	};
	if (currentUserId) {
		taskQueryParams.assigneeId = currentUserId;
	}

	const queryKey = [
		"group-todo",
		"user",
		groupId,
		currentUserId ?? "anonymous",
	];
	const {
		data: apiTasks = [],
		isLoading,
		isFetching,
		isError,
	} = useQuery({
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
			}
		},
	});

	const usingSampleData = !hasValidGroup;
	const tasksToRender = usingSampleData
		? sampleTasks.filter((task) =>
				!task.status ? true : ACTIVE_STATUSES.includes(task.status),
			)
		: apiTasks;
	const isRefreshing = !usingSampleData && isFetching && !isLoading;
	const statusControlDisabled =
		!usingSampleData && updateTaskStatusMutation.isPending;

	const handleStatusChange = (taskId: string, status: TaskStatus) => {
		if (usingSampleData || !groupId) {
			setSampleTasks((prev) =>
				prev.map((task: DisplayTask) =>
					task.id === taskId
						? { ...task, status, done: status === TaskStatus.DONE }
						: task,
				),
			);
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

		setSampleTasks((prev) => {
			const next = [...prev];
			const fromIndex = next.findIndex((task) => task.id === sourceId);
			let toIndex = next.findIndex((task) => task.id === targetId);
			if (fromIndex === -1 || toIndex === -1) return prev;
			const [moved] = next.splice(fromIndex, 1);
			if (fromIndex < toIndex) {
				toIndex -= 1;
			}
			next.splice(toIndex, 0, moved);
			return next;
		});

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
											</div>
											<Select
												value={task.status ?? TaskStatus.TODO}
												onChange={(event) =>
													handleStatusChange(
														task.id,
														Number(event.target.value) as TaskStatus,
													)
												}
												disabled={statusControlDisabled}
											>
												<option value={TaskStatus.TODO}>To Do</option>
												<option value={TaskStatus.IN_PROGRESS}>
													In Progress
												</option>
												<option value={TaskStatus.DONE}>Done</option>
											</Select>
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
				{isRefreshing && <Note>Syncing latest updates…</Note>}
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
