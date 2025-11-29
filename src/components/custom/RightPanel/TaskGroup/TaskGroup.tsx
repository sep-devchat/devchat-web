/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
	SquareCheckBig,
	X,
	Plus,
	Edit2,
	Trash2,
	Calendar,
	UserX,
	Clock,
	AlertCircle,
	CheckCircle2,
	Circle,
	Trash,
	Loader,
	Eye,
} from "lucide-react";
import * as S from "./TaskGroup.styled";
import {
	taskAPI,
	CreateTaskRequest,
	UpdateTaskRequest,
	TaskQuery,
} from "@/services/taskAPI";
import { Task as ApiTask, TaskStatus, TaskPriority } from "@/types/task";
import { membersGroup } from "@/services/userGroupAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { get } from "@/services/apiCaller";
import SearchFilter from "./SearchFilter";
import CustomSelect from "../../CustomSelect/CustomSelect";
import CustomDatePicker from "../../CustomDatePicker/CustomDatePicker";

type Task = {
	id: string;
	name: string;
	description: string;
	status: "Open" | "To Do" | "In Progress" | "Done";
	priority: "Low" | "Medium" | "High";
	dueDate: string;
	assignedTo: string;
};

type GroupMember = {
	id: string;
	username: string;
	email: string;
	role?: string;
	joined_at?: string;
};

const convertApiTaskToLocal = (apiTask: ApiTask): Task => {
	const statusMap: Record<TaskStatus, Task["status"]> = {
		[TaskStatus.TODO]: "To Do",
		[TaskStatus.IN_PROGRESS]: "In Progress",
		[TaskStatus.DONE]: "Done",
	};

	const priorityMap: Record<TaskPriority, Task["priority"]> = {
		[TaskPriority.LOW]: "Low",
		[TaskPriority.MEDIUM]: "Medium",
		[TaskPriority.HIGH]: "High",
	};

	return {
		id: apiTask.id,
		name: apiTask.name,
		description: apiTask.description || "",
		status: statusMap[apiTask.status] || "To Do",
		priority: priorityMap[apiTask.priority] || "Medium",
		dueDate: apiTask.dueDate || new Date().toISOString().split("T")[0],
		assignedTo: apiTask.assignee?.id || "",
	};
};

const convertLocalToApiCreate = (
	localTask: Omit<Task, "id">,
): CreateTaskRequest => {
	const statusMap: Record<Task["status"], TaskStatus> = {
		Open: TaskStatus.TODO,
		"To Do": TaskStatus.TODO,
		"In Progress": TaskStatus.IN_PROGRESS,
		Done: TaskStatus.DONE,
	};

	const priorityMap: Record<Task["priority"], TaskPriority> = {
		Low: TaskPriority.LOW,
		Medium: TaskPriority.MEDIUM,
		High: TaskPriority.HIGH,
	};

	return {
		name: localTask.name,
		description: localTask.description,
		status: statusMap[localTask.status],
		priority: priorityMap[localTask.priority],
		dueDate: localTask.dueDate
			? new Date(localTask.dueDate).toISOString()
			: undefined,
		assigneeId:
			localTask.assignedTo && localTask.assignedTo.trim() !== ""
				? localTask.assignedTo
				: undefined,
	};
};

const convertLocalToApiUpdate = (
	localTask: Partial<Task>,
): UpdateTaskRequest => {
	const statusMap: Record<Task["status"], TaskStatus> = {
		Open: TaskStatus.TODO,
		"To Do": TaskStatus.TODO,
		"In Progress": TaskStatus.IN_PROGRESS,
		Done: TaskStatus.DONE,
	};

	const priorityMap: Record<Task["priority"], TaskPriority> = {
		Low: TaskPriority.LOW,
		Medium: TaskPriority.MEDIUM,
		High: TaskPriority.HIGH,
	};

	return {
		name: localTask.name,
		description: localTask.description,
		status: localTask.status ? statusMap[localTask.status] : undefined,
		priority: localTask.priority ? priorityMap[localTask.priority] : undefined,
		dueDate: localTask.dueDate
			? new Date(localTask.dueDate).toISOString()
			: undefined,
		assigneeId: localTask.assignedTo || undefined,
	};
};

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

const Dialog: React.FC<{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}> = ({ open, onOpenChange, children }) => {
	if (!open) return null;

	return (
		<S.DialogOverlay open={open} onClick={() => onOpenChange(false)}>
			<div onClick={(e) => e.stopPropagation()}>{children}</div>
		</S.DialogOverlay>
	);
};

export type TaskGroupProps = {
	onClose?: () => void;
	groupId?: string;
};

export default function TaskGroup({ onClose, groupId }: TaskGroupProps) {
	const queryClient = useQueryClient();
	const [appliedFilters, setAppliedFilters] = useState<{
		status?: TaskStatus | undefined;
		assigneeId?: string | undefined;
		unassigned?: boolean | undefined;
		priority?: number | undefined;
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
		return {
			page: 1,
			limit: 100,
			search: debouncedSearch || undefined,
			status: appliedFilters.status,
			assigneeId: appliedFilters.assigneeId,
			priority: appliedFilters.priority,
			overdue: appliedFilters.overdue || null,
			unassigned: appliedFilters.unassigned || null,
			dueDate: appliedFilters.dueDate,
		};
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
	});

	const { data: membersData, isLoading: membersLoading } = useQuery({
		queryKey: ["groupMembers", groupId],
		queryFn: () => membersGroup(groupId!),
		enabled: !!groupId,
		refetchOnWindowFocus: false,
	});

	const groupMembers = membersData?.data || [];

	const apiTasks = apiTasksData?.data || [];
	const tasks = apiTasks.map(convertApiTaskToLocal);

	const displayTasks = tasks;

	const createTaskMutation = useMutation({
		mutationFn: (data: CreateTaskRequest) => taskAPI.createTask(groupId!, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", groupId, JSON.stringify(tasksQueryParams)],
			});
			fireAlert("success", "Task created successfully");
		},
		onError: (error) => {
			console.error("Failed to create task:", error);
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
		onError: (error) => {
			console.error("Failed to update task:", error);
			fireAlert("error", "Failed to update task. Please try again.");
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
		onError: (error) => {
			console.error("Failed to delete task:", error);
			fireAlert("error", "Failed to delete task. Please try again.");
		},
	});

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editPermissions, setEditPermissions] = useState({
		canEdit: false,
		fullAccess: false,
		canView: false,
	});
	const [originalFormData, setOriginalFormData] = useState({
		name: "",
		description: "",
		status: "Open" as Task["status"],
		priority: "Medium" as Task["priority"],
		dueDate: "",
		assignedTo: "",
	});

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		status: "Open" as Task["status"],
		priority: "Medium" as Task["priority"],
		dueDate: "",
		assignedTo: "",
	});

	const statusOptions = [
		{ value: "Open", label: "Open" },
		{ value: "To Do", label: "To Do" },
		{ value: "In Progress", label: "In Progress" },
		{ value: "Done", label: "Done" },
	];

	const priorityOptions = [
		{ value: "Low", label: "Low" },
		{ value: "Medium", label: "Medium" },
		{ value: "High", label: "High" },
	];

	const assigneeOptions = groupMembers.map((member: GroupMember) => ({
		value: member.id,
		label: `${member.username} (${member.email})`,
	}));

	const canEditTask = (task: Task) => {
		if (isGroupCreator) {
			return { canEdit: true, fullAccess: true, canView: true };
		}
		if (task.assignedTo === currentUserId) {
			return { canEdit: true, fullAccess: false, canView: true };
		}
		return { canEdit: false, fullAccess: false, canView: true };
	};

	const canDeleteTask = () => {
		return isGroupCreator;
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			status: "Open",
			priority: "Medium",
			dueDate: "",
			assignedTo: "",
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

		const createData = convertLocalToApiCreate(formData);
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

		const updateData = convertLocalToApiUpdate(formData);
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

	const openUpdateDialog = (task: Task) => {
		setSelectedTask(task);
		const permissions = canEditTask(task);
		setEditPermissions(permissions);
		const taskData = {
			name: task.name,
			description: task.description,
			status: task.status,
			priority: task.priority,
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

	const getAssigneeDisplayName = (assigneeId: string) => {
		if (!assigneeId) return "Unassigned";
		const member = groupMembers.find((m: GroupMember) => m.id === assigneeId);
		return member ? member.username : "Unknown User";
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "High":
				return { text: "#D83232", bg: "#D8323233" };
			case "Medium":
				return { text: "#EFB008", bg: "#EFB00833" };
			case "Low":
				return { text: "#1CCA93", bg: "#1CCA9333" };
			default:
				return { text: "#6b7280", bg: "#f3f4f6" };
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Open":
				return { text: "#6b7280", bg: "#f3f4f6" };
			case "To Do":
				return { text: "#EFB008", bg: "#EFB00833" };
			case "In Progress":
				return { text: "#608BC1", bg: "#608BC133" };
			case "Done":
				return { text: "#1CCA93", bg: "#1CCA9333" };
			default:
				return { text: "#6b7280", bg: "#f3f4f6" };
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "Open":
				return <Loader size={14} />;
			case "To Do":
				return <Circle size={14} />;
			case "In Progress":
				return <Clock size={14} />;
			case "Done":
				return <CheckCircle2 size={14} />;
			default:
				return <Circle size={14} />;
		}
	};

	const getPriorityIcon = (priority: string) => {
		console.log("Getting icon for priority:", priority);
		return <AlertCircle size={14} />;
	};

	const hasChanges = () => {
		return (
			formData.name !== originalFormData.name ||
			formData.description !== originalFormData.description ||
			formData.status !== originalFormData.status ||
			formData.priority !== originalFormData.priority ||
			formData.dueDate !== originalFormData.dueDate ||
			formData.assignedTo !== originalFormData.assignedTo
		);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const renderTaskActions = (task: Task) => {
		const { canEdit } = canEditTask(task);

		return (
			<S.TaskActions>
				{canEdit ? (
					<Edit2
						size={18}
						style={{ cursor: "pointer", color: "#608BC1" }}
						onClick={() => openUpdateDialog(task)}
					/>
				) : (
					<Eye
						size={18}
						style={{ cursor: "pointer", color: "#6b7280" }}
						onClick={() => openUpdateDialog(task)}
					/>
				)}
				{canDeleteTask() && (
					<Trash2
						size={18}
						style={{ cursor: "pointer", color: "#D83232" }}
						onClick={() => openDeleteDialog(task)}
					/>
				)}
			</S.TaskActions>
		);
	};

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
					<S.Button
						variant="primary"
						onClick={() => setIsCreateOpen(true)}
						disabled={!isGroupCreator}
						style={{
							opacity: isGroupCreator ? 1 : 0.5,
							cursor: isGroupCreator ? "pointer" : "not-allowed",
						}}
					>
						<Plus size={16} /> Create Task
					</S.Button>
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

				{isLoading && (
					<S.TaskCard>
						<div style={{ textAlign: "center", padding: "20px" }}>
							<Loader
								size={20}
								style={{ animation: "spin 1s linear infinite" }}
							/>
							<div style={{ marginTop: "10px" }}>Loading tasks...</div>
						</div>
					</S.TaskCard>
				)}
				{isError && (
					<S.TaskCard>
						<div
							style={{ textAlign: "center", padding: "20px", color: "#D83232" }}
						>
							Error loading tasks: {error?.message || "Unknown error"}
						</div>
					</S.TaskCard>
				)}
				{!groupId && (
					<S.TaskCard>
						<div
							style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
						>
							<div style={{ fontSize: "18px", marginBottom: "8px" }}>
								No group selected
							</div>
							<div style={{ fontSize: "14px" }}>
								Please select a group to view tasks
							</div>
						</div>
					</S.TaskCard>
				)}
				{groupId && !isLoading && displayTasks.length === 0 && !isError && (
					<S.TaskCard>
						<S.EmptyStateContainer>
							<S.EmptyStateTitle>No tasks yet</S.EmptyStateTitle>
							<S.EmptyStateDescription>
								Create your first task to get started
							</S.EmptyStateDescription>
						</S.EmptyStateContainer>
					</S.TaskCard>
				)}
				{groupId &&
					!isLoading &&
					displayTasks.length > 0 &&
					displayTasks.map((task) => {
						const statusColors = getStatusColor(task.status);
						const priorityColors = getPriorityColor(task.priority);

						return (
							<S.TaskCard key={task.id}>
								<S.TaskHeader>
									<S.TaskTitle>{task.name}</S.TaskTitle>
									{renderTaskActions(task)}
								</S.TaskHeader>

								<S.TaskDescription>{task.description}</S.TaskDescription>

								<S.TaskBadges>
									<S.Badge bg={statusColors.bg} color={statusColors.text}>
										{getStatusIcon(task.status)}
										{task.status}
									</S.Badge>
									<S.Badge bg={priorityColors.bg} color={priorityColors.text}>
										{getPriorityIcon(task.priority)}
										{task.priority}
									</S.Badge>
								</S.TaskBadges>

								<S.TaskMeta>
									<S.MetaItem>
										{(() => {
											const apiTask = apiTasks.find(
												(a: any) => a.id === task.id,
											);
											const assignee = apiTask?.assignee;
											if (!assignee) {
												return <UserX size={14} />;
											}

											if (assignee?.avatarUrl) {
												return (
													<S.AvatarImg
														src={assignee?.avatarUrl}
														alt={
															assignee?.firstName ||
															assignee.username ||
															"avatar"
														}
													/>
												);
											}

											const displayName = (
												assignee?.firstName ||
												assignee.username ||
												""
											).trim();
											const initial = displayName
												? displayName.charAt(0).toUpperCase()
												: "?";
											return <S.AvatarInitials>{initial}</S.AvatarInitials>;
										})()}

										<span>{getAssigneeDisplayName(task.assignedTo)}</span>
									</S.MetaItem>
									<S.MetaItem>
										<Calendar size={14} /> {formatDate(task.dueDate)}
									</S.MetaItem>
								</S.TaskMeta>
							</S.TaskCard>
						);
					})}
			</S.ContentArea>

			{/* Create Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<S.DialogContent maxWidth="42rem">
					<S.DialogHeader>
						<S.DialogTitle>Create New Task</S.DialogTitle>
					</S.DialogHeader>

					<S.DialogBody>
						<S.FormGroup>
							<S.Label>
								Task Name <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<S.Input
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Enter task name"
							/>
						</S.FormGroup>

						<S.FormGroup>
							<S.Label>
								Description <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<S.TextArea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="Enter task description"
							/>
						</S.FormGroup>

						<S.FormRow>
							<S.FormColumn>
								<S.FormGroup>
									<S.Label>
										Priority <span style={{ color: "#D83232" }}>*</span>
									</S.Label>
									<CustomSelect
										value={formData.priority}
										onChange={(value) =>
											setFormData({
												...formData,
												priority: value as Task["priority"],
											})
										}
										options={priorityOptions}
									/>
								</S.FormGroup>
							</S.FormColumn>
						</S.FormRow>

						<S.FormGroup>
							<S.Label>
								Due Date <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<CustomDatePicker
								value={formData.dueDate}
								onChange={(value) =>
									setFormData({ ...formData, dueDate: value })
								}
							/>
						</S.FormGroup>

						<S.FormGroup>
							<S.Label>Assign To</S.Label>
							<CustomSelect
								value={formData.assignedTo}
								onChange={(value) =>
									setFormData({ ...formData, assignedTo: value })
								}
								options={assigneeOptions}
								placeholder={
									membersLoading ? "Loading members..." : "Select assignee..."
								}
								disabled={membersLoading}
							/>
						</S.FormGroup>
					</S.DialogBody>

					<S.DialogFooter>
						<S.Button
							variant="ghost"
							onClick={() => setIsCreateOpen(false)}
							disabled={createTaskMutation.isPending}
						>
							Cancel
						</S.Button>
						<S.Button
							variant="primary"
							onClick={handleCreate}
							disabled={createTaskMutation.isPending}
						>
							{createTaskMutation.isPending ? "Creating..." : "Create Task"}
						</S.Button>
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>

			<Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
				<S.DialogContent maxWidth="42rem">
					<S.DialogHeader>
						<S.DialogTitle>
							{editPermissions.canEdit ? "Update Task" : "View Task"}
						</S.DialogTitle>
					</S.DialogHeader>

					<S.DialogBody>
						<S.FormGroup>
							<S.Label>
								Task Name <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<S.Input
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Enter task name"
								disabled={!editPermissions.fullAccess}
								style={{
									cursor: editPermissions.fullAccess ? "text" : "not-allowed",
									opacity: editPermissions.fullAccess ? 1 : 0.6,
									background: editPermissions.fullAccess ? "white" : "#f3f4f6",
								}}
							/>
						</S.FormGroup>

						<S.FormGroup>
							<S.Label>
								Description <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<S.TextArea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="Enter task description"
								disabled={!editPermissions.fullAccess}
								style={{
									cursor: editPermissions.fullAccess ? "text" : "not-allowed",
									opacity: editPermissions.fullAccess ? 1 : 0.6,
									background: editPermissions.fullAccess ? "white" : "#f3f4f6",
								}}
							/>
						</S.FormGroup>

						<S.FormRow>
							<S.FormColumn>
								<S.FormGroup>
									<S.Label>Status</S.Label>
									<CustomSelect
										value={formData.status}
										onChange={(value) =>
											setFormData({
												...formData,
												status: value as Task["status"],
											})
										}
										options={statusOptions}
										disabled={!editPermissions.canEdit}
									/>
								</S.FormGroup>
							</S.FormColumn>

							<S.FormColumn>
								<S.FormGroup>
									<S.Label>
										Priority <span style={{ color: "#D83232" }}>*</span>
									</S.Label>
									<CustomSelect
										value={formData.priority}
										onChange={(value) =>
											setFormData({
												...formData,
												priority: value as Task["priority"],
											})
										}
										options={priorityOptions}
										disabled={!editPermissions.fullAccess}
									/>
								</S.FormGroup>
							</S.FormColumn>
						</S.FormRow>

						<S.FormGroup>
							<S.Label>
								Due Date <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<CustomDatePicker
								value={formData.dueDate}
								onChange={(value) =>
									setFormData({ ...formData, dueDate: value })
								}
								disabled={!editPermissions.fullAccess}
							/>
						</S.FormGroup>

						<S.FormGroup>
							<S.Label>
								Assign To <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<CustomSelect
								value={formData.assignedTo}
								onChange={(value) =>
									setFormData({ ...formData, assignedTo: value })
								}
								options={assigneeOptions}
								placeholder={
									membersLoading ? "Loading members..." : "Select assignee..."
								}
								disabled={!editPermissions.fullAccess || membersLoading}
							/>
						</S.FormGroup>
					</S.DialogBody>

					<S.DialogFooter>
						<S.Button
							variant="ghost"
							onClick={() => setIsUpdateOpen(false)}
							disabled={updateTaskMutation.isPending}
						>
							{editPermissions.canEdit ? "Cancel" : "Close"}
						</S.Button>
						{editPermissions.canEdit && (
							<S.Button
								variant="primary"
								onClick={handleUpdate}
								disabled={updateTaskMutation.isPending || !hasChanges()}
								style={{
									opacity: hasChanges() ? 1 : 0.5,
									cursor: hasChanges() ? "pointer" : "not-allowed",
								}}
							>
								{updateTaskMutation.isPending ? "Updating..." : "Update Task"}
							</S.Button>
						)}
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<S.DialogContent maxWidth="28rem">
					<S.DialogHeader>
						<S.DialogTitle>Delete Task</S.DialogTitle>
					</S.DialogHeader>

					<S.DialogBody>
						<S.WarningBox>
							Are you sure you want to delete{" "}
							<strong>{selectedTask?.name || "this task"}</strong>?<br />
							This action cannot be undone.
						</S.WarningBox>
					</S.DialogBody>

					<S.DialogFooter>
						<S.Button
							variant="ghost"
							onClick={() => setIsDeleteOpen(false)}
							disabled={deleteTaskMutation.isPending}
						>
							Cancel
						</S.Button>
						<S.Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteTaskMutation.isPending}
						>
							<Trash size={16} />{" "}
							{deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
						</S.Button>
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>
			<style>{`
  .custom-select-wrapper .select-control,
  .datepicker-wrapper .datepicker-input {
    padding: 12px 40px 12px 16px;
    height: 43px;
    font-size: 14px;
  }

  .custom-select-wrapper .select-dropdown {
    top: calc(100% + 8px);
    padding: 6px;
  }

  .custom-select-wrapper .select-option {
    padding: 12px 16px;
    font-size: 14px;
    margin: 6px 8px;
    min-height: 42px;
  }

  .datepicker-wrapper .clear-date-btn {
    right: 44px;
  }

  .datepicker-modal {
    padding: 24px;
    min-width: 360px;
  }

  .datepicker-modal .month-year {
    font-size: 18px;
  }

  .datepicker-modal .subtitle {
    font-size: 13px;
  }

  .datepicker-modal .weekday-label {
    font-size: 12px;
    padding: 8px 0;
  }

  .datepicker-modal .day-cell {
    padding: 10px;
    font-size: 14px;
  }

  .icon-size {
    width: 18px;
    height: 18px;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  @media (min-width: 1920px) {
    .custom-select-wrapper .select-control,
    .datepicker-wrapper .datepicker-input {
      padding: 13.2px 44px 13.2px 17.6px;
      height: 47.3px;
      font-size: 15.4px;
    }

    .custom-select-wrapper .select-dropdown {
      top: calc(100% + 8.8px);
      padding: 6.6px;
    }

    .custom-select-wrapper .select-option {
      padding: 13.2px 17.6px;
      font-size: 15.4px;
      margin: 6.6px 8.8px;
      min-height: 46.2px;
    }

    .datepicker-wrapper .clear-date-btn {
      right: 48.4px;
    }

    .datepicker-modal {
      padding: 26.4px;
      min-width: 396px;
    }

    .datepicker-modal .month-year {
      font-size: 19.8px;
    }

    .datepicker-modal .subtitle {
      font-size: 14.3px;
    }

    .datepicker-modal .weekday-label {
      font-size: 13.2px;
      padding: 8.8px 0;
    }

    .datepicker-modal .day-cell {
      padding: 11px;
      font-size: 15.4px;
    }

    .icon-size {
      width: 19.8px;
      height: 19.8px;
    }

    .nav-icon {
      width: 22px;
      height: 22px;
    }
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    .custom-select-wrapper .select-control,
    .datepicker-wrapper .datepicker-input {
      padding: 10px 14px;
      height: 38px;
      font-size: 12px;
    }

    .custom-select-wrapper .select-dropdown {
      top: calc(100% + 6.4px);
      padding: 4.8px;
    }

    .custom-select-wrapper .select-option {
      padding: 9.6px 12.8px;
      font-size: 11px;
      margin: 4.8px 6.4px;
      min-height: 33.6px;
    }

    .datepicker-wrapper .clear-date-btn {
      right: 35.2px;
    }

    .datepicker-modal {
      padding: 20px;
      min-width: 300px;
    }

    .datepicker-modal .month-year {
      font-size: 14.4px;
    }

    .datepicker-modal .subtitle {
      font-size: 10.4px;
    }

    .datepicker-modal .weekday-label {
      font-size: 9.6px;
      padding: 6.4px 0;
    }

    .datepicker-modal .day-cell {
      padding: 8px;
      font-size: 11.2px;
    }

    .icon-size {
      width: 14.4px;
      height: 14.4px;
    }

    .nav-icon {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 1220px) {
    .custom-select-wrapper .select-control,
    .datepicker-wrapper .datepicker-input {
      padding: 10px 14px;
      height: 40px;
      font-size: 12px;
    }

    .custom-select-wrapper .select-dropdown {
      top: calc(100% + 5.6px);
      padding: 4px;
    }

    .custom-select-wrapper .select-option {
      padding: 8.4px 11.2px;
      font-size: 11px;
      margin: 4.2px 5.6px;
      min-height: 30px;
    }

    .datepicker-wrapper .clear-date-btn {
      right: 30.8px;
    }

    .datepicker-modal {
      padding: 20px;
      min-width: 300px;
    }

    .datepicker-modal .month-year {
      font-size: 12.6px;
    }

    .datepicker-modal .subtitle {
      font-size: 10px;
    }

    .datepicker-modal .weekday-label {
      font-size: 10px;
      padding: 5.6px 0;
    }

    .datepicker-modal .day-cell {
      padding: 7px;
      font-size: 10px;
    }

    .icon-size {
      width: 12.6px;
      height: 12.6px;
    }

    .nav-icon {
      width: 14px;
      height: 14px;
    }
  }
`}</style>
		</S.PageWrapper>
	);
}
