/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
	createTodo,
	deleteTodo,
	getTodos,
	Todo,
	TodoPriorityEnum,
	TodoStatusEnum,
	updateTodo,
	UpdateTodoRequest,
} from "../../../../services/todoAPI";
import {
	Search,
	Plus,
	Edit3,
	Trash2,
	Check,
	X,
	Calendar,
	AlertCircle,
	MoreHorizontal,
	GripVertical,
	Flag,
} from "lucide-react";
import {
	ActionsCol,
	AddBtn,
	Card,
	Checkbox,
	Field,
	Meta,
	Root,
	Row,
	SearchBox,
	SearchInput,
	Select,
	TaskDesc,
	TaskItem,
	TaskList,
	TaskMain,
	TaskTitle,
	Textarea,
	TextInput,
	PriorityBadge,
	MoreWrap,
	MoreButton,
	Dropdown,
	DropdownItem,
	DragHandle,
	Container,
} from "./PersonalTodo.styled";

/* ---------- utils ---------- */
function parseDateInputToISO(value: string | null) {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString();
}
function formatDateShort(iso?: string) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString();
}
function isoToDatetimeLocal(iso?: string) {
	if (!iso) return "";
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
		d.getMinutes(),
	)}`;
}
function daysDiffFromNow(iso?: string) {
	if (!iso) return null;
	const d = new Date(iso).getTime();
	const now = Date.now();
	const diff = d - now;
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Mapping functions for priority
function toApiPriority(p: number): TodoPriorityEnum {
	if (p === 1) return TodoPriorityEnum.HIGH;
	if (p === 2) return TodoPriorityEnum.MEDIUM;
	return TodoPriorityEnum.LOW;
}

function fromApiPriority(p: TodoPriorityEnum): number {
	if (p === TodoPriorityEnum.HIGH) return 1;
	if (p === TodoPriorityEnum.MEDIUM) return 2;
	return 3;
}

// // Mapping functions for status
// function toApiStatus(done: boolean): TodoStatusEnum {
// 	return done ? TodoStatusEnum.DONE : TodoStatusEnum.TODO;
// }

function fromApiStatus(s: TodoStatusEnum): boolean {
	return s === TodoStatusEnum.DONE;
}

/* ---------- component ---------- */
export default function PersonalTodo() {
	const [tasks, setTasks] = useState<Todo[]>([]);

	const [q, setQ] = useState<string>("");
	const [showAddCard, setShowAddCard] = useState(false);

	// add form
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<number>(3);
	const [dueDateInput, setDueDateInput] = useState<string>(""); // datetime-local
	const inputRef = useRef<HTMLInputElement | null>(null);

	// inline edit
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editFields, setEditFields] = useState<Partial<Todo>>({});

	async function fetchTasks() {
		try {
			const res = await getTodos({ page: 1, limit: 100 }); // TODO: add pagination
			setTasks(
				res.data.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)),
			);
		} catch (e) {
			console.error("Failed to fetch tasks", e);
			// TODO: show error to user
		}
	}

	useEffect(() => {
		fetchTasks();
	}, []);

	/* ---------- CRUD: add / delete / toggle / inline edit ---------- */
	async function addTaskFinalize() {
		const nm = (name ?? "").trim();
		if (!nm) return;
		const iso = parseDateInputToISO(dueDateInput);
		try {
			await createTodo({
				name: nm,
				description: description?.trim() || null,
				priority: toApiPriority(priority),
				status: TodoStatusEnum.TODO,
				dueDate: iso || null,
			});
			fetchTasks(); // Refresh the list after adding
		} catch (e) {
			console.error("Failed to create task", e);
			// TODO: show error to user
		}

		setName("");
		setDescription("");
		setPriority(3);
		setDueDateInput("");
		setShowAddCard(false);
	}
	function addTaskCancel() {
		setName("");
		setDescription("");
		setPriority(3);
		setDueDateInput("");
		setShowAddCard(false);
	}

	async function deleteTask(id: string) {
		const ok = window.confirm("Are you sure you want to delete this task?");
		if (!ok) return;
		try {
			await deleteTodo(id);
			fetchTasks(); // Refresh the list after deleting
		} catch (e) {
			console.error("Failed to delete task", e);
			// TODO: show error to user
		}
	}

	async function toggleDone(id: string) {
		const task = tasks.find((x) => x.id === id);
		if (!task) return;
		const newStatus =
			task.status === TodoStatusEnum.DONE
				? TodoStatusEnum.TODO
				: TodoStatusEnum.DONE;
		try {
			await updateTodo(id, { status: newStatus });
			fetchTasks(); // Refresh the list after toggling done status
		} catch (e) {
			console.error("Failed to update task status", e);
			// TODO: show error to user
		}
	}

	function startEditInline(id: string) {
		const t = tasks.find((x) => x.id === id);
		if (!t) return;
		setEditingId(id);
		setEditFields({
			...t,
			priority: fromApiPriority(t.priority),
			// The status is already a number in the API, so no special mapping needed for editFields
		});
	}
	function cancelInlineEdit() {
		setEditingId(null);
		setEditFields({});
	}
	async function saveInlineEdit(id: string) {
		const text = (editFields.name ?? "").trim();
		if (!text) return;

		const updatedData: UpdateTodoRequest = {
			name: text,
			description: editFields.description ?? null,
			priority: toApiPriority(editFields.priority as number),
			status: editFields.status,
			dueDate: editFields.dueDate ?? null,
		};

		try {
			await updateTodo(id, updatedData);
			fetchTasks(); // Refresh the list after saving
		} catch (e) {
			console.error("Failed to update task", e);
			// TODO: show error to user
		}

		setEditingId(null);
		setEditFields({});
	}

	/* ---------- drag & drop reorder (FIXED: operate by id, not by shown index) ---------- */
	const dragItemIdRef = useRef<string | null>(null); // store id of dragged item
	const [dragOverId, setDragOverId] = useState<string | null>(null);
	const [draggingId, setDraggingId] = useState<string | null>(null);

	function onDragStart(e: React.DragEvent, id: string) {
		dragItemIdRef.current = id;
		setDraggingId(id);
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "move";
			try {
				e.dataTransfer.setData("text/plain", id); // store id as fallback
			} catch {
				// ignore
			}
		}
	}
	function onDragOver(e: React.DragEvent, overId: string) {
		e.preventDefault();
		// optional: set dropEffect
		try {
			if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
		} catch {
			// ignore
		}
		if (dragOverId !== overId) setDragOverId(overId);
	}
	function onDrop(e: React.DragEvent, targetId: string) {
		e.preventDefault();
		const fromId = dragItemIdRef.current;
		const toId = targetId;
		if (!fromId || !toId || fromId === toId) {
			cleanupDrag();
			return;
		}

		setTasks((s) => {
			const arr = s.slice();
			const fromIndex = arr.findIndex((x) => x.id === fromId);
			let toIndex = arr.findIndex((x) => x.id === toId);
			if (fromIndex === -1 || toIndex === -1) return s;

			// **Important fix**: if moving downwards, after removing the item,
			// the target index decreases by 1. Adjust toIndex accordingly.
			const item = arr[fromIndex];
			arr.splice(fromIndex, 1);
			if (fromIndex < toIndex) {
				toIndex = toIndex - 1;
			}
			arr.splice(toIndex, 0, item);
			return arr;
		});

		cleanupDrag();
	}
	function onDragEnd() {
		cleanupDrag();
	}
	function cleanupDrag() {
		dragItemIdRef.current = null;
		setDragOverId(null);
		setDraggingId(null);
	}

	/* ---------- view data (filter / sort) ---------- */
	const shown = tasks.filter((t) => {
		if (!q) return true;
		const hh = `${t.name} ${t.description ?? ""}`.toLowerCase();
		return hh.includes(q.toLowerCase());
	});

	const [openDropdownFor, setOpenDropdownFor] = useState<string | null>(null);

	return (
		<Container>
			<Root>
				<Row style={{ marginBottom: 12 }}>
					<SearchBox>
						<Search size={16} color="#94a3b8" />
						<SearchInput
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search tasks..."
						/>
					</SearchBox>

					<AddBtn onClick={() => setShowAddCard((s) => !s)} title="Add new">
						<Plus size={14} /> Add new
					</AddBtn>
				</Row>

				{showAddCard && (
					<Card style={{ marginBottom: 12 }}>
						<Row style={{ alignItems: "flex-start" }}>
							<div style={{ flex: 1 }}>
								<Field>
									<TextInput
										ref={inputRef}
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="Task name"
									/>
								</Field>
								<Field>
									<Textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Description (optional)"
										rows={3}
									/>
								</Field>
								<Row gap={12}>
									<Select
										value={priority}
										onChange={(e) => setPriority(Number(e.target.value))}
									>
										<option value={1}>Priority 1 (High)</option>
										<option value={2}>Priority 2</option>
										<option value={3}>Priority 3 (Low)</option>
										<option value={0}>None</option>
									</Select>
									<Row>
										<Calendar size={16} color="#64748b" />
										<TextInput
											type="datetime-local"
											value={dueDateInput}
											onChange={(e) => setDueDateInput(e.target.value)}
											style={{ marginLeft: 8 }}
										/>
									</Row>
								</Row>
							</div>

							<ActionsCol>
								<button
									onClick={addTaskFinalize}
									style={{
										background: "#16a34a",
										color: "white",
										padding: "8px 12px",
										borderRadius: 8,
										border: "none",
										cursor: "pointer",
										display: "flex",
										gap: 8,
										alignItems: "center",
									}}
								>
									<Check size={14} /> Complete
								</button>
								<button
									onClick={addTaskCancel}
									style={{
										background: "transparent",
										color: "#dc2626",
										padding: "8px 12px",
										borderRadius: 8,
										border: "1px solid rgba(226,232,240,1)",
										cursor: "pointer",
										display: "flex",
										gap: 8,
										alignItems: "center",
									}}
								>
									<X size={14} /> Close
								</button>
							</ActionsCol>
						</Row>
					</Card>
				)}

				<TaskList>
					{shown.length === 0 ? (
						<div style={{ color: "#64748b" }}>No matching tasks.</div>
					) : (
						shown.map((t) => {
							const daysLeft = daysDiffFromNow(t.dueDate ?? "");
							const isDueSoon =
								daysLeft !== null && daysLeft <= 2 && daysLeft >= 0;
							const isOverdue = daysLeft !== null && daysLeft < 0;
							const priorityLevel = t.priority ?? 3;
							const priorityLabel =
								priorityLevel === 1 ? "P1" : priorityLevel === 2 ? "P2" : "P3";
							const isEditing = editingId === t.id;

							// style cho panel edit (you can move to styled-component)
							const editPanelStyle: React.CSSProperties = {
								position: "absolute",
								right: 12,
								top: 12,
								zIndex: 30,
								background: "white",
								boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
								borderRadius: 10,
								padding: 12,
								minWidth: 360,
							};

							return (
								<TaskItem
									key={t.id}
									draggable
									onDragStart={(e) => onDragStart(e, t.id)}
									onDragOver={(e) => onDragOver(e, t.id)}
									onDrop={(e) => onDrop(e, t.id)}
									onDragEnd={onDragEnd}
									dragging={draggingId === t.id}
									style={{ position: "relative" }} // needed for absolute edit panel
								>
									<DragHandle title="Drag to reorder">
										<GripVertical size={16} color="#94a3b8" />
									</DragHandle>

									<div>
										<Checkbox
											type="checkbox"
											checked={fromApiStatus(t.status)}
											onChange={() => toggleDone(t.id)}
										/>
									</div>

									{/* ---------- Main display (always visible) ---------- */}
									<TaskMain>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												gap: 12,
											}}
										>
											<div style={{ flex: 1 }}>
												<TaskTitle done={fromApiStatus(t.status)}>
													{t.name}
												</TaskTitle>
												<TaskDesc>{t.description}</TaskDesc>
											</div>

											<Meta>
												<div
													style={{
														display: "flex",
														gap: 8,
														alignItems: "center",
														justifyContent: "flex-end",
													}}
												>
													{/* Hide priority badge when priority === 0 */}
													{priorityLevel !== 0 && (
														<PriorityBadge level={priorityLevel}>
															<Flag size={14} />
															{priorityLabel}
														</PriorityBadge>
													)}
												</div>

												<div style={{ marginTop: 8 }}>
													{t.dueDate ? (
														<div
															title={
																isOverdue
																	? "Overdue"
																	: isDueSoon
																		? `Due in ${Math.max(daysLeft ?? 0, 0)} days`
																		: `Due: ${new Date(t.dueDate).toLocaleString()}`
															}
															style={{
																display: "inline-flex",
																gap: 8,
																alignItems: "center",
																padding: "6px 8px",
																borderRadius: 8,
																background: isDueSoon
																	? "rgba(254,226,226,0.6)"
																	: "rgba(241,245,249,1)",
																color: isDueSoon ? "#991b1b" : "#334155",
																fontSize: 12,
																justifyContent: "flex-end",
															}}
														>
															{isOverdue ? (
																<AlertCircle size={16} color="#dc2626" />
															) : (
																<Calendar size={14} color="#64748b" />
															)}
															<span>
																{isDueSoon
																	? `Due in ${Math.max(daysLeft ?? 0, 0)} days`
																	: formatDateShort(t.dueDate)}
															</span>
														</div>
													) : (
														<div
															style={{
																color: "#94a3b8",
																fontSize: 12,
																textAlign: "right",
															}}
														>
															No due date
														</div>
													)}
												</div>

												<div style={{ marginTop: 8 }}>
													{isEditing ? (
														<Select
															value={editFields.status ?? t.status ?? 0}
															onChange={(e) =>
																setEditFields((p) => ({
																	...p,
																	status: Number(e.target.value),
																}))
															}
														>
															<option value={0}>To do</option>
															<option value={1}>Done</option>
															<option value={2}>Blocked</option>
														</Select>
													) : null}
												</div>
											</Meta>
										</div>

										{/* ---------- Edit panel separated into its own div (absolute) ---------- */}
										{isEditing && (
											<div style={editPanelStyle}>
												<div style={{ display: "flex", gap: 8 }}>
													<TextInput
														value={editFields.name ?? ""}
														onChange={(e) =>
															setEditFields((p) => ({
																...p,
																name: e.target.value,
															}))
														}
														placeholder="Task name"
													/>
												</div>

												<div style={{ marginTop: 8 }}>
													<Textarea
														rows={3}
														value={editFields.description ?? ""}
														onChange={(e) =>
															setEditFields((p) => ({
																...p,
																description: e.target.value,
															}))
														}
													/>
												</div>

												<div
													style={{
														marginTop: 8,
														display: "flex",
														gap: 8,
														alignItems: "center",
														justifyContent: "space-between",
													}}
												>
													<Select
														value={editFields.priority ?? priorityLevel}
														onChange={(e) =>
															setEditFields((p) => ({
																...p,
																priority: Number(e.target.value),
															}))
														}
													>
														<option value={1}>Priority 1 (High)</option>
														<option value={2}>Priority 2</option>
														<option value={3}>Priority 3 (Low)</option>
														<option value={0}>None</option>
													</Select>

													<TextInput
														type="datetime-local"
														value={
															editFields.dueDate
																? isoToDatetimeLocal(editFields.dueDate)
																: ""
														}
														onChange={(e) =>
															setEditFields((p) => ({
																...p,
																dueDate: e.target.value
																	? new Date(e.target.value).toISOString()
																	: undefined,
															}))
														}
														style={{ width: 180 }}
													/>
												</div>

												<div
													style={{
														marginTop: 10,
														display: "flex",
														gap: 8,
														justifyContent: "flex-end",
													}}
												>
													<button
														onClick={() => saveInlineEdit(t.id)}
														style={{
															background: "#16a34a",
															color: "white",
															padding: 8,
															borderRadius: 8,
															border: "none",
															cursor: "pointer",
															display: "flex",
															gap: 8,
															alignItems: "center",
														}}
													>
														<Check size={14} /> Save
													</button>
													<button
														onClick={cancelInlineEdit}
														style={{
															background: "transparent",
															color: "#dc2626",
															padding: 8,
															borderRadius: 8,
															border: "1px solid rgba(226,232,240,1)",
															cursor: "pointer",
															display: "flex",
															gap: 8,
															alignItems: "center",
														}}
													>
														<X size={14} /> Cancel
													</button>
												</div>
											</div>
										)}
									</TaskMain>

									<MoreWrap>
										<MoreButton
											onClick={() =>
												setOpenDropdownFor((s) => (s === t.id ? null : t.id))
											}
											aria-haspopup
										>
											<MoreHorizontal size={16} />
										</MoreButton>

										{openDropdownFor === t.id && (
											<Dropdown>
												<DropdownItem
													onClick={() => {
														setOpenDropdownFor(null);
														startEditInline(t.id);
													}}
												>
													<Edit3 size={14} /> Edit
												</DropdownItem>

												<DropdownItem
													onClick={() => {
														setOpenDropdownFor(null);
														deleteTask(t.id);
													}}
												>
													<Trash2 size={14} /> Delete
												</DropdownItem>
											</Dropdown>
										)}
									</MoreWrap>
								</TaskItem>
							);
						})
					)}
				</TaskList>
			</Root>
		</Container>
	);
}
