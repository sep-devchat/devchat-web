import React, { useState, useRef, useEffect } from "react";
import {
	SquareCheckBig,
	X,
	Plus,
	Edit2,
	Trash2,
	Calendar,
	User,
	Clock,
	AlertCircle,
	CheckCircle2,
	Circle,
	Trash,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Loader,
} from "lucide-react";
import * as S from "./TaskGroup.styled";

type Task = {
	id: string;
	name: string;
	description: string;
	status: "Open" | "To Do" | "In Progress" | "Done";
	priority: "Low" | "Medium" | "High";
	dueDate: string;
	assignedTo: string;
	createdBy: string;
};

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

const CustomSelect: React.FC<{
	value: string;
	disabled?: boolean;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
}> = ({ value, onChange, options, placeholder, disabled = false }) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (val: string) => {
		if (disabled) return;
		onChange(val);
		setIsOpen(false);
	};

	return (
		<div
			style={{ position: "relative", opacity: disabled ? 0.6 : 1 }}
			ref={selectRef}
			onClick={() => !disabled && setIsOpen(!isOpen)}
		>
			<div
				style={{
					width: "100%",
					padding: "12px 40px 12px 16px",
					border: `1.5px solid ${isOpen ? "#133e87" : "#e5e7eb"}`,
					borderRadius: "10px",
					fontSize: "14px",
					color: "#1f2937",
					background: disabled
						? "#f3f4f6"
						: isOpen
							? "white"
							: "linear-gradient(to bottom, #ffffff, #f9fafb)",
					cursor: disabled ? "not-allowed" : "pointer",
					transition: "all 0.3s ease",
					boxShadow: isOpen
						? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
						: "0 1px 3px rgba(0, 0, 0, 0.05)",
					userSelect: "none" as const,
				}}
				onMouseEnter={(e) => {
					if (disabled) return;
					e.currentTarget.style.borderColor = "#133e87";
					e.currentTarget.style.background = "white";
					e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)";
					e.currentTarget.style.transform = "translateY(-1px)";
				}}
				onMouseLeave={(e) => {
					if (disabled) return;
					if (!isOpen) {
						e.currentTarget.style.borderColor = "#e5e7eb";
						e.currentTarget.style.background =
							"linear-gradient(to bottom, #ffffff, #f9fafb)";
						e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
						e.currentTarget.style.transform = "translateY(0)";
					}
				}}
			>
				{selectedOption ? selectedOption.label : placeholder || "Select..."}
			</div>

			<div
				style={{
					position: "absolute",
					right: "12px",
					top: "50%",
					transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
					color: "#6b7280",
					pointerEvents: "none" as const,
					transition: "transform 0.3s ease",
				}}
			>
				<ChevronDown size={18} />
			</div>

			{isOpen && !disabled && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						left: 0,
						right: 0,
						background: "white",
						border: "1.5px solid #e5e7eb",
						borderRadius: "12px",
						boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
						zIndex: 1000,
						overflow: "hidden",
						animation: "slideDown 0.2s ease-out",
					}}
				>
					{placeholder && (
						<div
							style={{
								padding: "12px 16px",
								fontSize: "14px",
								color: "#6b7280",
								fontWeight: 500,
								fontStyle: "italic",
								cursor: "pointer",
								transition: "all 0.2s ease",
								margin: "6px 8px",
								borderRadius: "8px",
								minHeight: "42px",
								display: "flex",
								alignItems: "center",
							}}
							onClick={() => handleSelect("")}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									"linear-gradient(to right, #dbeafe, #eff6ff)";
								e.currentTarget.style.color = "#1e40af";
								e.currentTarget.style.transform = "translateX(4px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = "white";
								e.currentTarget.style.color = "#6b7280";
								e.currentTarget.style.transform = "translateX(0)";
							}}
						>
							{placeholder}
						</div>
					)}
					{options.map((option) => {
						const isSelected = option.value === value;
						return (
							<div
								key={option.value}
								style={{
									padding: "12px 16px",
									fontSize: "14px",
									color: isSelected ? "white" : "#1f2937",
									fontWeight: isSelected ? 600 : 500,
									background: isSelected ? "#133e87" : "white",
									cursor: "pointer",
									transition: "all 0.2s ease",
									margin: "6px 8px",
									borderRadius: "8px",
									minHeight: "42px",
									display: "flex",
									alignItems: "center",
								}}
								onClick={() => handleSelect(option.value)}
								onMouseEnter={(e) => {
									if (!isSelected) {
										e.currentTarget.style.background =
											"linear-gradient(to right, #dbeafe, #eff6ff)";
										e.currentTarget.style.color = "#1e40af";
									}
									e.currentTarget.style.transform = "translateX(4px)";
								}}
								onMouseLeave={(e) => {
									if (!isSelected) {
										e.currentTarget.style.background = "white";
										e.currentTarget.style.color = "#1f2937";
									}
									e.currentTarget.style.transform = "translateX(0)";
								}}
							>
								{option.label}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

const CustomDatePicker: React.FC<{
	value: string;
	onChange: (value: string) => void;
}> = ({ value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const dateRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatDisplayDate = (dateStr: string) => {
		if (!dateStr) return "Select date...";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			days.push({
				day: prevMonthLastDay - i,
				isCurrentMonth: false,
				date: new Date(year, month - 1, prevMonthLastDay - i),
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				day: i,
				isCurrentMonth: true,
				date: new Date(year, month, i),
			});
		}

		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({
				day: i,
				isCurrentMonth: false,
				date: new Date(year, month + 1, i),
			});
		}

		return days;
	};

	const days = getDaysInMonth(currentMonth);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const handleDateClick = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		onChange(`${year}-${month}-${day}`);
		setIsOpen(false);
	};

	const monthYear = currentMonth.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<S.DateInputWrapper ref={dateRef}>
			<S.DateInput
				type="text"
				value={formatDisplayDate(value)}
				onClick={() => setIsOpen(!isOpen)}
				readOnly
			/>
			<S.CalendarIcon onClick={() => setIsOpen(!isOpen)}>
				<Calendar size={18} />
			</S.CalendarIcon>
			{isOpen && (
				<S.CalendarDropdown>
					<S.CalendarHeader>
						<S.MonthYearNav>
							<S.NavButton
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() - 1,
										),
									)
								}
							>
								<ChevronLeft size={20} />
							</S.NavButton>
							<S.MonthYear>{monthYear}</S.MonthYear>
							<S.NavButton
								onClick={() =>
									setCurrentMonth(
										new Date(
											currentMonth.getFullYear(),
											currentMonth.getMonth() + 1,
										),
									)
								}
							>
								<ChevronRight size={20} />
							</S.NavButton>
						</S.MonthYearNav>
						<S.CalendarInstruction>Select due date</S.CalendarInstruction>
					</S.CalendarHeader>

					<S.WeekDays>
						{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
							<S.WeekDay key={day}>{day}</S.WeekDay>
						))}
					</S.WeekDays>

					<S.DaysGrid>
						{days.map((dayInfo, idx) => {
							const dayDate = new Date(dayInfo.date);
							dayDate.setHours(0, 0, 0, 0);
							const isToday = dayDate.getTime() === today.getTime();
							const isSelected = Boolean(
								value &&
									dayDate.getTime() === new Date(value).setHours(0, 0, 0, 0),
							);
							const isFuture = dayDate < today;

							return (
								<S.DayCell
									key={idx}
									$isCurrentMonth={dayInfo.isCurrentMonth}
									$isToday={isToday}
									$isSelected={isSelected}
									$isInRange={false}
									$isFuture={isFuture}
									onClick={() => {
										if (dayInfo.isCurrentMonth && !isFuture) {
											handleDateClick(dayInfo.date);
										}
									}}
								>
									{dayInfo.day}
								</S.DayCell>
							);
						})}
					</S.DaysGrid>
				</S.CalendarDropdown>
			)}
		</S.DateInputWrapper>
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
type TaskGroupProps = {
	onClose?: () => void;
};

export default function TaskGroup({ onClose }: TaskGroupProps) {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "1",
			name: "Implement user authentication",
			description: "Create login/register functionality with JWT tokens",
			status: "Open",
			priority: "Low",
			dueDate: "2026-01-01",
			assignedTo: "John Doe",
			createdBy: "Alice Johnson",
		},
		{
			id: "2",
			name: "Design database schema",
			description: "Create ERD and define relationships between entities",
			status: "To Do",
			priority: "Medium",
			dueDate: "2025-11-16",
			assignedTo: "Alice Johnson",
			createdBy: "John Doe",
		},
		{
			id: "3",
			name: "Implement user authentication",
			description: "Create login/register functionality with JWT tokens",
			status: "In Progress",
			priority: "High",
			dueDate: "2026-01-01",
			assignedTo: "John Doe",
			createdBy: "Alice Johnson",
		},
		{
			id: "4",
			name: "Design database schema",
			description: "Create ERD and define relationships between entities",
			status: "Done",
			priority: "Medium",
			dueDate: "2025-11-16",
			assignedTo: "Alice Johnson",
			createdBy: "John Doe",
		},
	]);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		status: "Open" as Task["status"],
		priority: "Medium" as Task["priority"],
		dueDate: "",
		assignedTo: "",
		createdBy: "John Doe",
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

	const assigneeOptions = [
		{ value: "John Doe", label: "John Doe" },
		{ value: "Alice Johnson", label: "Alice Johnson" },
		{ value: "Bob Smith", label: "Bob Smith" },
	];

	const createdByOptions = [
		{ value: "John Doe", label: "John Doe (john.doe@example.com)" },
		{ value: "Alice Johnson", label: "Alice Johnson" },
		{ value: "Bob Smith", label: "Bob Smith" },
	];

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			status: "Open",
			priority: "Medium",
			dueDate: "",
			assignedTo: "",
			createdBy: "John Doe",
		});
	};

	const handleCreate = () => {
		if (!formData.name.trim()) {
			fireAlert("warning", "Task name is required");
			return;
		}

		const newTask: Task = {
			id: Date.now().toString(),
			...formData,
		};

		setTasks([...tasks, newTask]);
		fireAlert("success", "Task created successfully");
		setIsCreateOpen(false);
		resetForm();
	};

	const handleUpdate = () => {
		if (!selectedTask) return;
		if (!formData.name.trim()) {
			fireAlert("warning", "Task name is required");
			return;
		}

		setTasks(
			tasks.map((task) =>
				task.id === selectedTask.id ? { ...task, ...formData } : task,
			),
		);
		fireAlert("success", "Task updated successfully");
		setIsUpdateOpen(false);
		setSelectedTask(null);
		resetForm();
	};

	const handleDelete = () => {
		if (!selectedTask) return;
		setTasks(tasks.filter((task) => task.id !== selectedTask.id));
		fireAlert("success", "Task deleted successfully");
		setIsDeleteOpen(false);
		setSelectedTask(null);
	};

	const openUpdateDialog = (task: Task) => {
		setSelectedTask(task);
		setFormData({
			name: task.name,
			description: task.description,
			status: task.status,
			priority: task.priority,
			dueDate: task.dueDate,
			assignedTo: task.assignedTo,
			createdBy: task.createdBy,
		});
		setIsUpdateOpen(true);
	};

	const openDeleteDialog = (task: Task) => {
		setSelectedTask(task);
		setIsDeleteOpen(true);
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
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
					<X style={{ cursor: "pointer" }} size={20} onClick={onClose} />
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
					<S.Button variant="primary" onClick={() => setIsCreateOpen(true)}>
						{" "}
						<Plus size={16} /> Create Task{" "}
					</S.Button>
				</S.HeaderWrapper>
				{tasks.map((task) => {
					const statusColors = getStatusColor(task.status);
					const priorityColors = getPriorityColor(task.priority);

					return (
						<S.TaskCard key={task.id}>
							<S.TaskHeader>
								<S.TaskTitle>{task.name}</S.TaskTitle>
								<S.TaskActions>
									<Edit2
										size={18}
										style={{ cursor: "pointer", color: "#608BC1" }}
										onClick={() => openUpdateDialog(task)}
									/>
									<Trash2
										size={18}
										style={{ cursor: "pointer", color: "#D83232" }}
										onClick={() => openDeleteDialog(task)}
									/>
								</S.TaskActions>
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
									<User size={14} /> {task.assignedTo}
								</S.MetaItem>
								<S.MetaItem>
									<User size={14} /> Created by {task.createdBy}
								</S.MetaItem>
								<S.MetaItem>
									<Calendar size={14} /> {formatDate(task.dueDate)}
								</S.MetaItem>
							</S.TaskMeta>
						</S.TaskCard>
					);
				})}
			</S.ContentArea>

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
							<S.Label>
								Created By <span style={{ color: "#D83232" }}>*</span>
							</S.Label>
							<CustomSelect
								value={formData.createdBy}
								onChange={(value) =>
									setFormData({ ...formData, createdBy: value })
								}
								options={createdByOptions}
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
								placeholder="Select assignee..."
							/>
						</S.FormGroup>
					</S.DialogBody>

					<S.DialogFooter>
						<S.Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
							Cancel
						</S.Button>
						<S.Button variant="primary" onClick={handleCreate}>
							Create Task
						</S.Button>
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>

			{/* Update Dialog */}
			<Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
				<S.DialogContent maxWidth="42rem">
					<S.DialogHeader>
						<S.DialogTitle>Update Task</S.DialogTitle>
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
										disabled
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
							<S.Label>Created By</S.Label>
							<S.Input value={formData.createdBy} disabled />
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
								placeholder="Select assignee..."
							/>
						</S.FormGroup>
					</S.DialogBody>

					<S.DialogFooter>
						<S.Button variant="ghost" onClick={() => setIsUpdateOpen(false)}>
							Cancel
						</S.Button>
						<S.Button variant="primary" onClick={handleUpdate}>
							Update Task
						</S.Button>
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>

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
						<S.Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</S.Button>
						<S.Button variant="destructive" onClick={handleDelete}>
							<Trash size={16} /> Delete Task
						</S.Button>
					</S.DialogFooter>
				</S.DialogContent>
			</Dialog>
		</S.PageWrapper>
	);
}
