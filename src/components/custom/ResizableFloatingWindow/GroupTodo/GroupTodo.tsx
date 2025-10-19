/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
	Calendar,
	Edit3,
	Check,
	AlertCircle,
	MoreHorizontal,
	GripVertical,
	Trash2,
	X,
	Flag,
} from "lucide-react";
import {
	Checkbox,
	ControlsCol,
	Desc,
	Header,
	Meta,
	Note,
	Root,
	TaskItem,
	TaskList,
	TaskMain,
	Title,
} from "./GroupTodo.styled";
import {
	Textarea,
	TextInput,
	Select,
	PriorityBadge,
	MoreWrap,
	MoreButton,
	Dropdown,
	DropdownItem,
	DragHandle,
} from "../PersonalTodo/PersonalTodo.styled";

/* ---------- types ---------- */
type Task = {
	id: string;
	name: string;
	description?: string;
	priority?: number;
	status?: number;
	dueDate?: string;
	createdAt?: number;
	done?: boolean;
};

type Props = { groupId?: string; groupName?: string };

/* ---------- utils ---------- */
function getGroupKey(groupId: string) {
	return `devchat_group_tasks_${groupId}`;
}
function isoToDatetimeLocal(iso?: string) {
	if (!iso) return "";
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatDateShort(iso?: string) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString();
}
function daysDiffFromNow(iso?: string) {
	if (!iso) return null;
	const d = new Date(iso).getTime();
	const now = Date.now();
	const diff = d - now;
	return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ---------- component ---------- */
export default function GroupTodo({ groupId, groupName }: Props) {
	const gid = groupId ?? "unknown";
	const gname = groupName ?? "Group";

	const STORAGE_KEY = getGroupKey(gid);
	const SAMPLE_TASKS: Task[] = [
		{
			id: `g-${gid}-1`,
			name: `Prepare release for ${gname}`,
			description: "Check checklist and docs",
			priority: 1,
			status: 0,
			dueDate: undefined,
			createdAt: Date.now() - 1000 * 60 * 60 * 24,
			done: false,
		},
		{
			id: `g-${gid}-2`,
			name: `Review PRs for ${gname}`,
			description: "",
			priority: 2,
			status: 0,
			dueDate: undefined,
			createdAt: Date.now() - 1000 * 60 * 60 * 2,
			done: false,
		},
	];

	const [tasks, setTasks] = useState<Task[]>(() => {
		try {
			const raw =
				typeof window !== "undefined"
					? localStorage.getItem(STORAGE_KEY)
					: null;
			return raw ? JSON.parse(raw) : SAMPLE_TASKS;
		} catch (e) {
			console.warn("Failed to parse group tasks", e);
			return SAMPLE_TASKS;
		}
	});

	useEffect(() => {
		try {
			if (groupId) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
		} catch (e) {
			console.log("Failed to save group tasks", e);
		}
	}, [tasks, STORAGE_KEY, groupId]);

	/* ---------- inline edit ---------- */
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editFields, setEditFields] = useState<Partial<Task>>({});

	function startEditInline(id: string) {
		const t = tasks.find((x) => x.id === id);
		if (!t) return;
		setEditingId(id);
		setEditFields({ ...t });
	}
	function cancelInlineEdit() {
		setEditingId(null);
		setEditFields({});
	}
	function saveInlineEdit(id: string) {
		const text = (editFields.name ?? "").trim();
		if (!text) return;
		setTasks((s) =>
			s.map((x) => (x.id === id ? { ...x, ...(editFields as Task) } : x)),
		);
		setEditingId(null);
		setEditFields({});
	}

	/* ---------- toggle / delete ---------- */
	function toggleDone(id: string) {
		setTasks((s) => s.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
	}
	function deleteTask(id: string) {
		const ok = window.confirm("Are you sure you want to delete this task?");
		if (!ok) return;
		setTasks((s) => s.filter((x) => x.id !== id));
	}

	/* ---------- drag & drop reorder (match PersonalTodo behavior) ---------- */
	const dragItemIdRef = useRef<string | null>(null);
	const [dragOverId, setDragOverId] = useState<string | null>(null);
	const [draggingId, setDraggingId] = useState<string | null>(null);

	function onDragStart(e: React.DragEvent, id: string) {
		dragItemIdRef.current = id;
		setDraggingId(id);
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "move";
			try {
				e.dataTransfer.setData("text/plain", id);
			} catch {
				// ignore
			}
		}
	}
	function onDragOver(e: React.DragEvent, overId: string) {
		e.preventDefault();
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

			const [item] = arr.splice(fromIndex, 1);
			// Adjust toIndex when moving downward
			if (fromIndex < toIndex) toIndex = toIndex - 1;
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

	/* ---------- dropdown control ---------- */
	const [openDropdownFor, setOpenDropdownFor] = useState<string | null>(null);

	/* ---------- render ---------- */
	return (
		<Root>
			<Header>
				<div style={{ fontSize: 14 }}>
					Tasks for group <strong>{gname}</strong>
				</div>
				<Note>Edit / reorder / delete only (no create)</Note>
			</Header>

			<TaskList>
				{tasks.length === 0 ? (
					<div style={{ color: "#64748b" }}>No tasks in this group.</div>
				) : (
					tasks
						.slice()
						.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
						.map((t) => {
							const daysLeft = daysDiffFromNow(t.dueDate);
							const isDueSoon =
								daysLeft !== null && daysLeft <= 2 && daysLeft >= 0;
							const isOverdue = daysLeft !== null && daysLeft < 0;
							const priorityLevel = t.priority ?? 3;
							const priorityLabel =
								priorityLevel === 1 ? "P1" : priorityLevel === 2 ? "P2" : "P3";
							const isEditing = editingId === t.id;

							// style for edit panel (copy from Personal)
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
											checked={!!t.done}
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
												<Title done={t.done}>{t.name}</Title>
												<Desc>{t.description}</Desc>
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
														value={editFields.description ?? ""}
														onChange={(e) =>
															setEditFields((p) => ({
																...p,
																description: e.target.value,
															}))
														}
														rows={3}
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

												<div style={{ marginTop: 10, display: "flex", gap: 8 }}>
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

									<ControlsCol>
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
									</ControlsCol>
								</TaskItem>
							);
						})
				)}
			</TaskList>
		</Root>
	);
}
