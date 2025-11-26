import React from "react";
import { Calendar, UserX, Loader, Edit2, Eye, Trash2 } from "lucide-react";
import { Task, GroupMember } from "./TaskGroup.types";
import * as S from "./TaskGroup.styled";
import { Task as ApiTask } from "@/types/task";
import {
	formatDate,
	getPriorityColor,
	getPriorityIcon,
	getStatusColor,
	getStatusIcon,
} from "./TaskGroup.helpers";

export type TaskListProps = {
	groupId?: string;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	tasks: Task[];
	apiTasks: ApiTask[];
	groupMembers: GroupMember[];
	currentUserId: string;
	isGroupCreator: boolean;
	onOpenTask: (task: Task) => void;
	onDeleteTask: (task: Task) => void;
};

const TaskList: React.FC<TaskListProps> = ({
	groupId,
	isLoading,
	isError,
	error,
	tasks,
	apiTasks,
	groupMembers,
	currentUserId,
	isGroupCreator,
	onOpenTask,
	onDeleteTask,
}) => {
	if (isLoading) {
		return (
			<S.TaskCard>
				<div style={{ textAlign: "center", padding: "20px" }}>
					<Loader size={20} style={{ animation: "spin 1s linear infinite" }} />
					<div style={{ marginTop: "10px" }}>Loading tasks...</div>
				</div>
			</S.TaskCard>
		);
	}

	if (isError) {
		return (
			<S.TaskCard>
				<div style={{ textAlign: "center", padding: "20px", color: "#D83232" }}>
					Error loading tasks: {(error as Error)?.message || "Unknown error"}
				</div>
			</S.TaskCard>
		);
	}

	if (!groupId) {
		return (
			<S.TaskCard>
				<div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
					<div style={{ fontSize: "18px", marginBottom: "8px" }}>
						No group selected
					</div>
					<div style={{ fontSize: "14px" }}>
						Please select a group to view tasks
					</div>
				</div>
			</S.TaskCard>
		);
	}

	if (groupId && tasks.length === 0) {
		return (
			<S.TaskCard>
				<div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
					<div style={{ fontSize: "18px", marginBottom: "8px" }}>
						No tasks yet
					</div>
					<div style={{ fontSize: "14px" }}>
						Create your first task to get started
					</div>
				</div>
			</S.TaskCard>
		);
	}

	return (
		<>
			{tasks.map((task) => {
				const statusColors = getStatusColor(task.status);
				const priorityColors = getPriorityColor(task.priority);
				const canEdit = isGroupCreator || task.assignedTo === currentUserId;

				return (
					<S.TaskCard key={task.id}>
						<S.TaskHeader>
							<S.TaskTitle>{task.name}</S.TaskTitle>
							<S.TaskActions>
								{canEdit ? (
									<Edit2
										size={18}
										style={{ cursor: "pointer", color: "#608BC1" }}
										onClick={() => onOpenTask(task)}
									/>
								) : (
									<Eye
										size={18}
										style={{ cursor: "pointer", color: "#6b7280" }}
										onClick={() => onOpenTask(task)}
									/>
								)}
								{isGroupCreator && (
									<Trash2
										size={18}
										style={{ cursor: "pointer", color: "#D83232" }}
										onClick={() => onDeleteTask(task)}
									/>
								)}
							</S.TaskActions>
						</S.TaskHeader>

						<S.TaskDescription>{task.description}</S.TaskDescription>

						<S.TaskBadges>
							<S.Badge bg={statusColors.bg} color={statusColors.text}>
								{getStatusIcon(task.status)}
								{task.status}
							</S.Badge>
							<S.Badge bg={priorityColors.bg} color={priorityColors.text}>
								{getPriorityIcon()}
								{task.priority}
							</S.Badge>
						</S.TaskBadges>

						<S.TaskMeta>
							<S.MetaItem>
								{(() => {
									const apiTask = apiTasks.find((a) => a.id === task.id);
									const assignee = apiTask?.assignee;
									if (!assignee) {
										return <UserX size={14} />;
									}

									if (assignee?.avatarUrl) {
										return (
											<S.AvatarImg
												src={assignee.avatarUrl}
												alt={
													assignee.firstName || assignee.username || "avatar"
												}
											/>
										);
									}

									const displayName = (
										assignee?.firstName ||
										assignee?.username ||
										""
									).trim();
									const initial = displayName
										? displayName.charAt(0).toUpperCase()
										: "?";
									return <S.AvatarInitials>{initial}</S.AvatarInitials>;
								})()}

								<span>
									{(() => {
										if (!task.assignedTo) return "Unassigned";
										const member = groupMembers.find(
											(m) => m.id === task.assignedTo,
										);
										return member ? member.username : "Unknown User";
									})()}
								</span>
							</S.MetaItem>
							<S.MetaItem>
								<Calendar size={14} /> Start: {formatDate(task.startDate)}
							</S.MetaItem>
							<S.MetaItem>
								<Calendar size={14} /> Due: {formatDate(task.dueDate)}
							</S.MetaItem>
						</S.TaskMeta>
					</S.TaskCard>
				);
			})}
		</>
	);
};

export default TaskList;
