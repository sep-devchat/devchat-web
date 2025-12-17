import { useQuery } from "@tanstack/react-query";
import { X, Loader, ArrowRight } from "lucide-react";
import * as S from "./TaskGroup.styled";
import { taskAPI, AuditLogResponse } from "@/services/taskAPI";
import { Task } from "./TaskGroup.types";
import styled from "styled-components";

const HistoryContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const HistoryItem = styled.div`
	display: flex;
	gap: 12px;
	padding: 16px 0;
	border-bottom: 1px solid #e5e7eb;

	&:last-child {
		border-bottom: none;
	}
`;

const Avatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #608bc1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 14px;
	flex-shrink: 0;
`;

const HistoryContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const HistoryHeader = styled.div`
	display: flex;
	align-items: baseline;
	gap: 6px;
	margin-bottom: 4px;
`;

const UserName = styled.span`
	font-weight: 600;
	color: #1f2937;
	font-size: 14px;
`;

const ActionText = styled.span`
	color: #6b7280;
	font-size: 14px;
`;

const Timestamp = styled.div`
	color: #9ca3af;
	font-size: 12px;
	margin-top: 2px;
`;

const ChangeItem = styled.div`
	margin-top: 8px;
	font-size: 13px;
	color: #374151;
`;

const ChangeLabel = styled.div`
	color: #6b7280;
	margin-bottom: 4px;
	font-weight: 500;
`;

const ChangeValue = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ValueBadge = styled.span<{ type?: string }>`
	padding: 2px 8px;
	border-radius: 4px;
	font-weight: 500;
	background: ${(props) => {
		if (props.type === "status") {
			return "#f3f4f6";
		}
		return "#f3f4f6";
	}};
	border: 1px solid #e5e7eb;
	font-size: 12px;
`;

type TaskHistoryDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
	groupId: string;
};

export default function TaskHistoryDialog({
	isOpen,
	onClose,
	task,
	groupId,
}: TaskHistoryDialogProps) {
	const {
		data: historyResponse,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["task-history", groupId, task?.id],
		queryFn: () => taskAPI.getTaskHistory(groupId, task!.id),
		enabled: isOpen && !!task && !!groupId,
	});

	const history = historyResponse?.data || [];

	if (!isOpen || !task) return null;

	const formatTimestamp = (timestamp: string) => {
		const now = new Date();
		const date = new Date(timestamp);
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
			if (diffHours === 0) {
				const diffMinutes = Math.floor(diffMs / (1000 * 60));
				if (diffMinutes < 1) return "just now";
				return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
			}
			return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
		} else if (diffDays < 7) {
			return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
		}

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	};

	const getActionText = (action: string) => {
		switch (action) {
			case "create":
				return "created the task item";
			case "update":
				return "updated";
			case "delete":
				return "deleted";
			case "update-status":
				return "changed the Status";
			default:
				return action;
		}
	};

	const getFieldLabel = (key: string): string => {
		const labels: Record<string, string> = {
			status: "Status",
			priority: "Priority",
			assignedTo: "Assignee",
			name: "Title",
			description: "Description",
			startDate: "Start Date",
			dueDate: "Due Date",
		};
		return labels[key] || key;
	};

	const getUserInitials = (name?: string) => {
		if (!name) return "??";
		const parts = name.split(" ");
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const renderChanges = (log: AuditLogResponse) => {
		if (!log.newValues) return null;

		try {
			const newValues: Record<string, any> =
				typeof log.newValues === "string"
					? JSON.parse(log.newValues)
					: log.newValues;

			const oldValues: Record<string, any> = log.oldValues
				? typeof log.oldValues === "string"
					? JSON.parse(log.oldValues)
					: log.oldValues
				: {};

			return (
				<div>
					{Object.entries(newValues).map(([key, newValue]) => {
						const oldValue = oldValues[key];
						const label = getFieldLabel(key);

						// Skip rendering if both values are the same
						if (oldValue === newValue) return null;

						return (
							<ChangeItem key={key}>
								<ChangeLabel>{label}</ChangeLabel>
								<ChangeValue>
									{oldValue !== undefined &&
									oldValue !== null &&
									oldValue !== "" ? (
										<>
											<ValueBadge
												type={key === "status" ? "status" : undefined}
											>
												{String(oldValue)}
											</ValueBadge>
											<ArrowRight size={14} color="#9ca3af" />
										</>
									) : (
										<span style={{ color: "#9ca3af", fontSize: "12px" }}>
											None
										</span>
									)}
									<ValueBadge type={key === "status" ? "status" : undefined}>
										{String(newValue)}
									</ValueBadge>
								</ChangeValue>
							</ChangeItem>
						);
					})}
				</div>
			);
		} catch {
			return null;
		}
	};

	return (
		<S.DialogOverlay open={isOpen} onClick={onClose}>
			<S.DialogContent
				onClick={(e) => e.stopPropagation()}
				style={{ maxWidth: "600px" }}
			>
				<S.DialogHeader>
					<S.DialogTitle>Task History: {task.name}</S.DialogTitle>
					<S.CloseButton onClick={onClose}>
						<X size={20} />
					</S.CloseButton>
				</S.DialogHeader>

				<S.DialogBody>
					{isLoading && (
						<div style={{ textAlign: "center", padding: "20px" }}>
							<Loader
								size={24}
								style={{ animation: "spin 1s linear infinite" }}
							/>
							<div style={{ marginTop: "10px" }}>Loading history...</div>
						</div>
					)}

					{isError && (
						<div
							style={{ textAlign: "center", padding: "20px", color: "#D83232" }}
						>
							Failed to load task history
						</div>
					)}

					{!isLoading && !isError && history && history.length === 0 && (
						<div
							style={{
								textAlign: "center",
								padding: "40px",
								color: "#6b7280",
							}}
						>
							No history available for this task
						</div>
					)}

					{!isLoading && !isError && history && history.length > 0 && (
						<HistoryContainer>
							{history.map((log: AuditLogResponse, index: number) => (
								<HistoryItem key={index}>
									<Avatar title={log.userName}>
										{getUserInitials(log.userName)}
									</Avatar>
									<HistoryContent>
										<HistoryHeader>
											<UserName>{log.userName}</UserName>
											<ActionText>{getActionText(log.action)}</ActionText>
										</HistoryHeader>
										<Timestamp>{formatTimestamp(log.timestamp)}</Timestamp>
										{renderChanges(log)}
									</HistoryContent>
								</HistoryItem>
							))}
						</HistoryContainer>
					)}
				</S.DialogBody>
			</S.DialogContent>
		</S.DialogOverlay>
	);
}
