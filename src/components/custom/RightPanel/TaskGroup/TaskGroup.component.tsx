import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SquareCheckBig, X, Plus, RotateCcw } from "lucide-react";
import * as S from "./TaskGroup.styled";
import {
	taskAPI,
	CreateTaskRequest,
	UpdateTaskRequest,
	TaskQuery,
	UpdateTaskStatusRequest,
} from "@/services/taskAPI";
import { Task as ApiTask, TaskStatus } from "@/types/task";
import { membersGroup } from "@/services/userGroupAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { get } from "@/services/apiCaller";
import SearchFilter from "./SearchFilter";
import {
	Task,
	GroupMember,
	TaskGroupProps,
	SelectOption,
	EditPermissions,
	TaskFormData,
} from "./TaskGroup.types";
import {
	convertApiTaskToLocal,
	convertLocalToApiCreate,
	convertLocalToApiUpdate,
	fireAlert,
	buildDateRange,
	hasTaskChanged,
} from "./TaskGroup.helpers";
import TaskList from "./TaskList";
import {
	CreateTaskDialog,
	UpdateTaskDialog,
	DeleteTaskDialog,
} from "./TaskDialogs";

const STATUS_OPTIONS: SelectOption[] = [
	{ value: "Open", label: "Open" },
	{ value: "To Do", label: "To Do" },
	{ value: "In Progress", label: "In Progress" },
	{ value: "Done", label: "Done" },
];

const PRIORITY_OPTIONS: SelectOption[] = [
	{ value: "Low", label: "Low" },
	{ value: "Medium", label: "Medium" },
	{ value: "High", label: "High" },
];

const createEmptyFormState = (): TaskFormData => ({
	name: "",
	description: "",
	status: "Open",
	priority: "Medium",
	startDate: "",
	dueDate: "",
	assignedTo: "",
});

export default function TaskGroup({ onClose, groupId }: TaskGroupProps) {
	const queryClient = useQueryClient();
	const [appliedFilters, setAppliedFilters] = useState<{
		status?: TaskStatus | undefined;
		assigneeId?: string | undefined;
		unassigned?: boolean | undefined;
		priority?: number | undefined;
		startDate?: string | undefined;
		dueDate?: string | undefined;
		overdue?: boolean | undefined;
	}>({});

	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const debounceRef = useRef<number | null>(null);
	const DEBOUNCE_MS = 500;

	const currentUserProfile = useSelector(
		(state: RootState) => state.user.profile,
	);
	const currentUserId = currentUserProfile?.id || "";

	const { data: groupData } = useQuery({
		queryKey: ["groupInfo", groupId],
		queryFn: () => get(`/api/group/${groupId}`),
		enabled: !!groupId,
		refetchOnWindowFocus: false,
	});

	const groupCreatorId = groupData?.data?.createdBy || "";
	const isGroupCreator = currentUserId === groupCreatorId;

	useEffect(() => {
		if (debounceRef.current) {
			window.clearTimeout(debounceRef.current);
		}
		debounceRef.current = window.setTimeout(() => {
			setDebouncedSearch(searchTerm.trim());
		}, DEBOUNCE_MS);
		return () => {
			if (debounceRef.current) {
				window.clearTimeout(debounceRef.current);
			}
		};
	}, [searchTerm]);

	const tasksQueryParams = useMemo<TaskQuery>(() => {
		const params: TaskQuery = {
			page: 1,
			limit: 100,
			search: debouncedSearch || undefined,
			status: appliedFilters.status,
			assigneeId: appliedFilters.assigneeId,
			priority: appliedFilters.priority,
			overdue: appliedFilters.overdue ?? null,
			unassigned: appliedFilters.unassigned ?? null,
		};

		const startRange = buildDateRange(appliedFilters.startDate);
		if (startRange) {
			params.startDateFrom = startRange.from;
			params.startDateTo = startRange.to;
		}

		const dueRange = buildDateRange(appliedFilters.dueDate);
		if (dueRange) {
			params.dueDateFrom = dueRange.from;
			params.dueDateTo = dueRange.to;
		}

		return params;
	}, [debouncedSearch, appliedFilters]);

	const {
		data: apiTasksData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
		queryFn: () => taskAPI.getTasks(groupId!, tasksQueryParams),
		enabled: !!groupId,
		refetchOnWindowFocus: false,
		refetchInterval: groupId ? 10000 : false,
		refetchIntervalInBackground: true,
	});

	const { data: membersData, isLoading: membersLoading } = useQuery({
		queryKey: ["groupMembers", groupId],
		queryFn: () => membersGroup(groupId!),
		enabled: !!groupId,
		refetchOnWindowFocus: false,
	});

	const groupMembers: GroupMember[] = membersData?.data || [];

	const apiTasks: ApiTask[] = apiTasksData?.data || [];
	const tasks = apiTasks.map(convertApiTaskToLocal);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editPermissions, setEditPermissions] = useState<EditPermissions>({
		canEdit: false,
		fullAccess: false,
		canView: false,
	});
	const [formData, setFormData] = useState<TaskFormData>(createEmptyFormState);
	const [originalFormData, setOriginalFormData] =
		useState<TaskFormData>(createEmptyFormState);

	const handleFormFieldChange = (field: keyof TaskFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleStartDateChange = (value: string) => {
		setFormData((prev) => {
			const next = { ...prev, startDate: value };
			if (
				value &&
				prev.dueDate &&
				new Date(prev.dueDate).getTime() < new Date(value).getTime()
			) {
				fireAlert("warning", "Due date adjusted to match the new start date");
				next.dueDate = value;
			}
			return next;
		});
	};

	const handleDueDateChange = (value: string) => {
		if (
			value &&
			formData.startDate &&
			new Date(value).getTime() < new Date(formData.startDate).getTime()
		) {
			fireAlert("warning", "Due date cannot be earlier than the start date");
			return;
		}
		setFormData((prev) => ({ ...prev, dueDate: value }));
	};

	const statusOptions = STATUS_OPTIONS;
	const priorityOptions = PRIORITY_OPTIONS;

	const assigneeOptions: SelectOption[] = groupMembers.map(
		(member: GroupMember) => ({
			value: member.id,
			label: `${member.username} (${member.email})`,
		}),
	);

	const validateDateOrder = () => {
		if (!formData.startDate || !formData.dueDate) {
			return true;
		}
		const start = new Date(formData.startDate).getTime();
		const due = new Date(formData.dueDate).getTime();
		if (Number.isNaN(start) || Number.isNaN(due)) {
			return true;
		}
		if (due < start) {
			fireAlert("warning", "Due date cannot be earlier than the start date");
			return false;
		}
		return true;
	};

	const resetForm = () => {
		const empty = createEmptyFormState();
		setFormData(empty);
		setOriginalFormData(empty);
	};

	const createTaskMutation = useMutation({
		mutationFn: (data: CreateTaskRequest) => taskAPI.createTask(groupId!, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
			});
			fireAlert("success", "Task created successfully");
		},
		onError: (mutationError) => {
			console.error("Failed to create task:", mutationError);
			fireAlert("error", "Failed to create task. Please try again.");
		},
	});

	const updateTaskMutation = useMutation({
		mutationFn: ({
			taskId,
			data,
		}: {
			taskId: string;
			data: UpdateTaskRequest;
		}) => taskAPI.updateTask(groupId!, taskId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
			});
			fireAlert("success", "Task updated successfully");
		},
		onError: (mutationError) => {
			console.error("Failed to update task:", mutationError);
			fireAlert("error", "Failed to update task. Please try again.");
		},
	});

	const updateTaskStatusMutation = useMutation({
		mutationFn: ({
			taskId,
			data,
		}: {
			taskId: string;
			data: UpdateTaskStatusRequest;
		}) => taskAPI.updateTaskStatus(groupId!, taskId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
			});
			fireAlert("success", "Task status updated successfully");
		},
		onError: (mutationError) => {
			console.error("Failed to update task status:", mutationError);
			fireAlert("error", "Failed to update task status. Please try again.");
		},
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (taskId: string) => taskAPI.deleteTask(groupId!, taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
			});
			fireAlert("success", "Task deleted successfully");
		},
		onError: (mutationError) => {
			console.error("Failed to delete task:", mutationError);
			fireAlert("error", "Failed to delete task. Please try again.");
		},
	});

	const handleRefreshTasks = () => {
		if (!groupId) {
			fireAlert("warning", "Select a group to refresh tasks");
			return;
		}
		queryClient.invalidateQueries({
			queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
		});
	};

	const handleCreate = () => {
		if (!groupId) {
			fireAlert("error", "No group selected");
			return;
		}
		if (!formData.name.trim()) {
			fireAlert("warning", "Task name is required");
			return;
		}
		if (!formData.startDate) {
			fireAlert("warning", "Start date is required");
			return;
		}
		if (!validateDateOrder()) {
			return;
		}

		const createData = convertLocalToApiCreate(formData as Omit<Task, "id">);
		createTaskMutation.mutate(createData, {
			onSuccess: () => {
				setIsCreateOpen(false);
				resetForm();
			},
		});
	};

	const handleUpdate = () => {
		if (!selectedTask) return;
		if (!groupId) {
			fireAlert("error", "No group selected");
			return;
		}
		if (!formData.name.trim()) {
			fireAlert("warning", "Task name is required");
			return;
		}
		if (editPermissions.fullAccess) {
			if (!formData.startDate) {
				fireAlert("warning", "Start date is required");
				return;
			}
			if (!validateDateOrder()) {
				return;
			}
		}

		if (!editPermissions.fullAccess) {
			const statusPayload = convertLocalToApiUpdate({
				status: formData.status,
			} as Partial<Task>).status;
			if (typeof statusPayload === "undefined") {
				fireAlert("error", "Unable to determine new task status");
				return;
			}
			updateTaskStatusMutation.mutate(
				{ taskId: selectedTask.id, data: { status: statusPayload } },
				{
					onSuccess: () => {
						setIsUpdateOpen(false);
						setSelectedTask(null);
						resetForm();
					},
				},
			);
			return;
		}

		const updateData = convertLocalToApiUpdate(formData as Partial<Task>);
		updateTaskMutation.mutate(
			{ taskId: selectedTask.id, data: updateData },
			{
				onSuccess: () => {
					setIsUpdateOpen(false);
					setSelectedTask(null);
					resetForm();
				},
			},
		);
	};

	const handleDelete = () => {
		if (!selectedTask) return;
		if (!groupId) {
			fireAlert("error", "No group selected");
			return;
		}
		deleteTaskMutation.mutate(selectedTask.id, {
			onSuccess: () => {
				setIsDeleteOpen(false);
				setSelectedTask(null);
			},
		});
	};

	const resolvePermissions = (task: Task): EditPermissions => {
		if (isGroupCreator) {
			return { canEdit: true, fullAccess: true, canView: true };
		}
		if (task.assignedTo === currentUserId) {
			return { canEdit: true, fullAccess: false, canView: true };
		}
		return { canEdit: false, fullAccess: false, canView: true };
	};

	const openTaskDialog = (task: Task) => {
		setSelectedTask(task);
		setEditPermissions(resolvePermissions(task));
		const taskData: TaskFormData = {
			name: task.name,
			description: task.description,
			status: task.status,
			priority: task.priority,
			startDate: task.startDate,
			dueDate: task.dueDate,
			assignedTo: task.assignedTo,
		};
		setFormData(taskData);
		setOriginalFormData(taskData);
		setIsUpdateOpen(true);
	};

	const openDeleteDialog = (task: Task) => {
		setSelectedTask(task);
		setIsDeleteOpen(true);
	};

	const isUpdateProcessing = editPermissions.fullAccess
		? updateTaskMutation.isPending
		: updateTaskStatusMutation.isPending;

	const hasFormChanges = hasTaskChanged(formData, originalFormData);

	return (
		<S.PageWrapper>
			<S.Header>
				<S.HeaderLeft>
					<S.HeaderIcon>
						<SquareCheckBig size={20} />
					</S.HeaderIcon>
					<S.Title>Task Management</S.Title>
				</S.HeaderLeft>

				<S.HeaderRight>
					{onClose && (
						<S.CloseButton onClick={onClose}>
							<X size={20} />
						</S.CloseButton>
					)}
				</S.HeaderRight>
			</S.Header>

			<S.ContentArea>
				<S.HeaderWrapper>
					<div>
						<S.SubTitle>Task Group</S.SubTitle>
						<S.Description>
							Manage your team's tasks and assignments
						</S.Description>
					</div>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<S.Button
							variant="ghost"
							onClick={handleRefreshTasks}
							disabled={!groupId}
							style={{
								opacity: groupId ? 1 : 0.5,
								cursor: groupId ? "pointer" : "not-allowed",
							}}
						>
							<RotateCcw
								size={16}
								style={{
									animation: isLoading ? "spin 1s linear infinite" : "none",
								}}
							/>
							Refresh
						</S.Button>
						<S.Button
							variant="primary"
							onClick={() => {
								resetForm();
								setIsCreateOpen(true);
							}}
							disabled={!isGroupCreator}
							style={{
								opacity: isGroupCreator ? 1 : 0.5,
								cursor: isGroupCreator ? "pointer" : "not-allowed",
							}}
						>
							<Plus size={16} /> Create Task
						</S.Button>
					</div>
				</S.HeaderWrapper>

				<SearchFilter
					appliedFilters={appliedFilters}
					setAppliedFilters={setAppliedFilters}
					groupMembers={groupMembers}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					setDebouncedSearch={setDebouncedSearch}
					debounceRef={debounceRef}
				/>

				<TaskList
					groupId={groupId}
					isLoading={!!groupId && isLoading}
					isError={isError}
					error={error}
					tasks={tasks}
					apiTasks={apiTasks}
					groupMembers={groupMembers}
					currentUserId={currentUserId}
					isGroupCreator={isGroupCreator}
					onOpenTask={openTaskDialog}
					onDeleteTask={openDeleteDialog}
				/>
			</S.ContentArea>

			<CreateTaskDialog
				isOpen={isCreateOpen}
				formData={formData}
				onClose={() => setIsCreateOpen(false)}
				onSubmit={handleCreate}
				isSubmitting={createTaskMutation.isPending}
				priorityOptions={priorityOptions}
				assigneeOptions={assigneeOptions}
				membersLoading={membersLoading}
				onFormFieldChange={handleFormFieldChange}
				onStartDateChange={handleStartDateChange}
				onDueDateChange={handleDueDateChange}
			/>

			<UpdateTaskDialog
				isOpen={isUpdateOpen}
				formData={formData}
				onClose={() => setIsUpdateOpen(false)}
				onSubmit={handleUpdate}
				isProcessing={isUpdateProcessing}
				hasChanges={hasFormChanges}
				membersLoading={membersLoading}
				assigneeOptions={assigneeOptions}
				priorityOptions={priorityOptions}
				statusOptions={statusOptions}
				editPermissions={editPermissions}
				onFormFieldChange={handleFormFieldChange}
				onStartDateChange={handleStartDateChange}
				onDueDateChange={handleDueDateChange}
			/>

			<DeleteTaskDialog
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={handleDelete}
				isDeleting={deleteTaskMutation.isPending}
				taskName={selectedTask?.name}
			/>
		</S.PageWrapper>
	);
}
