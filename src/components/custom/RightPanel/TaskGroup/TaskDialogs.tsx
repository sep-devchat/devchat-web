import React from "react";
import { Trash } from "lucide-react";
import CustomSelect from "../../CustomSelect/CustomSelect";
import CustomDateTimePicker from "../../CustomDateTimePicker/CustomDateTimePicker";
import * as S from "./TaskGroup.styled";
import {
	TaskFormData,
	SelectOption,
	EditPermissions,
	TaskFormErrors,
} from "./TaskGroup.types";
import { formatDate } from "./TaskGroup.helpers";

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

export type CreateTaskDialogProps = {
	isOpen: boolean;
	formData: TaskFormData;
	formErrors: TaskFormErrors;
	onClose: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	priorityOptions: SelectOption[];
	assigneeOptions: SelectOption[];
	membersLoading: boolean;
	onFormFieldChange: (field: keyof TaskFormData, value: string) => void;
	onStartDateChange: (value: string) => void;
	onDueDateChange: (value: string) => void;
};

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
	isOpen,
	formData,
	onClose,
	onSubmit,
	isSubmitting,
	priorityOptions,
	assigneeOptions,
	membersLoading,
	onFormFieldChange,
	onStartDateChange,
	onDueDateChange,
	formErrors,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
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
							onChange={(e) => onFormFieldChange("name", e.target.value)}
							placeholder="Enter task name"
							aria-invalid={Boolean(formErrors.name)}
						/>
						{formErrors.name && (
							<S.FieldError role="alert">{formErrors.name}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Description</S.Label>
						<S.TextArea
							value={formData.description}
							onChange={(e) => onFormFieldChange("description", e.target.value)}
							placeholder="Enter task description"
							aria-invalid={Boolean(formErrors.description)}
						/>
						{formErrors.description && (
							<S.FieldError role="alert">{formErrors.description}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormRow>
						<S.FormColumn>
							<S.FormGroup>
								<S.Label>
									Priority <span style={{ color: "#D83232" }}>*</span>
								</S.Label>
								<CustomSelect
									value={formData.priority}
									onChange={(value) => onFormFieldChange("priority", value)}
									options={priorityOptions}
								/>
								{formErrors.priority && (
									<S.FieldError role="alert">
										{formErrors.priority}
									</S.FieldError>
								)}
							</S.FormGroup>
						</S.FormColumn>
					</S.FormRow>

					<S.FormGroup>
						<S.Label>Start Date & Time</S.Label>
						<CustomDateTimePicker
							value={formData.startDate}
							onChange={onStartDateChange}
							allowClear
							showTime
						/>
						{formErrors.startDate && (
							<S.FieldError role="alert">{formErrors.startDate}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Due Date & Time</S.Label>
						<CustomDateTimePicker
							value={formData.dueDate}
							onChange={onDueDateChange}
							allowClear
							showTime
						/>
						{formErrors.dueDate && (
							<S.FieldError role="alert">{formErrors.dueDate}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Assign To</S.Label>
						<CustomSelect
							value={formData.assignedTo}
							onChange={(value) => onFormFieldChange("assignedTo", value)}
							options={assigneeOptions}
							placeholder={
								membersLoading ? "Loading members..." : "Select assignee..."
							}
							disabled={membersLoading}
						/>
						{formErrors.assignedTo && (
							<S.FieldError role="alert">{formErrors.assignedTo}</S.FieldError>
						)}
					</S.FormGroup>
				</S.DialogBody>

				<S.DialogFooter>
					<S.Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</S.Button>
					<S.Button
						variant="primary"
						onClick={onSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Creating..." : "Create Task"}
					</S.Button>
				</S.DialogFooter>
			</S.DialogContent>
		</Dialog>
	);
};

export type UpdateTaskDialogProps = {
	isOpen: boolean;
	formData: TaskFormData;
	formErrors: TaskFormErrors;
	onClose: () => void;
	onSubmit: () => void;
	isProcessing: boolean;
	hasChanges: boolean;
	membersLoading: boolean;
	assigneeOptions: SelectOption[];
	priorityOptions: SelectOption[];
	statusOptions: SelectOption[];
	editPermissions: EditPermissions;
	isLockedTask?: boolean;
	lockedAt?: string;
	lockMessage?: string;
	onFormFieldChange: (field: keyof TaskFormData, value: string) => void;
	onStartDateChange: (value: string) => void;
	onDueDateChange: (value: string) => void;
};

export const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
	isOpen,
	formData,
	onClose,
	onSubmit,
	isProcessing,
	hasChanges,
	membersLoading,
	assigneeOptions,
	priorityOptions,
	statusOptions,
	editPermissions,
	isLockedTask,
	lockedAt,
	lockMessage,
	onFormFieldChange,
	onStartDateChange,
	onDueDateChange,
	formErrors,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
			<S.DialogContent maxWidth="42rem">
				<S.DialogHeader>
					<S.DialogTitle>
						{editPermissions.canEdit ? "Update Task" : "View Task"}
					</S.DialogTitle>
				</S.DialogHeader>

				<S.DialogBody>
					{isLockedTask && (
						<S.WarningBox>
							{lockMessage || "This task is locked and cannot be updated."}
							{lockedAt && (
								<>
									<br />
									Completed on {formatDate(lockedAt)}.
								</>
							)}
						</S.WarningBox>
					)}
					<S.FormGroup>
						<S.Label>
							Task Name <span style={{ color: "#D83232" }}>*</span>
						</S.Label>
						<S.Input
							value={formData.name}
							onChange={(e) => onFormFieldChange("name", e.target.value)}
							placeholder="Enter task name"
							disabled={!editPermissions.fullAccess}
							style={{
								cursor: editPermissions.fullAccess ? "text" : "not-allowed",
								opacity: editPermissions.fullAccess ? 1 : 0.6,
								background: editPermissions.fullAccess ? "white" : "#f3f4f6",
							}}
						/>
						{formErrors.name && (
							<S.FieldError role="alert">{formErrors.name}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Description</S.Label>
						<S.TextArea
							value={formData.description}
							onChange={(e) => onFormFieldChange("description", e.target.value)}
							placeholder="Enter task description"
							disabled={!editPermissions.fullAccess}
							style={{
								cursor: editPermissions.fullAccess ? "text" : "not-allowed",
								opacity: editPermissions.fullAccess ? 1 : 0.6,
								background: editPermissions.fullAccess ? "white" : "#f3f4f6",
							}}
						/>
						{formErrors.description && (
							<S.FieldError role="alert">{formErrors.description}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormRow>
						<S.FormColumn>
							<S.FormGroup>
								<S.Label>Status</S.Label>
								<CustomSelect
									value={formData.status}
									onChange={(value) => onFormFieldChange("status", value)}
									options={statusOptions}
									disabled={!editPermissions.canEdit}
								/>
								{formErrors.status && (
									<S.FieldError role="alert">{formErrors.status}</S.FieldError>
								)}
							</S.FormGroup>
						</S.FormColumn>

						<S.FormColumn>
							<S.FormGroup>
								<S.Label>
									Priority <span style={{ color: "#D83232" }}>*</span>
								</S.Label>
								<CustomSelect
									value={formData.priority}
									onChange={(value) => onFormFieldChange("priority", value)}
									options={priorityOptions}
									disabled={!editPermissions.fullAccess}
								/>
								{formErrors.priority && (
									<S.FieldError role="alert">
										{formErrors.priority}
									</S.FieldError>
								)}
							</S.FormGroup>
						</S.FormColumn>
					</S.FormRow>

					<S.FormGroup>
						<S.Label>Start Date & Time</S.Label>
						<CustomDateTimePicker
							value={formData.startDate}
							onChange={onStartDateChange}
							allowClear
							disabled={!editPermissions.fullAccess}
							showTime
						/>
						{formErrors.startDate && (
							<S.FieldError role="alert">{formErrors.startDate}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Due Date & Time</S.Label>
						<CustomDateTimePicker
							value={formData.dueDate}
							onChange={onDueDateChange}
							disabled={!editPermissions.fullAccess}
							allowClear
							showTime
						/>
						{formErrors.dueDate && (
							<S.FieldError role="alert">{formErrors.dueDate}</S.FieldError>
						)}
					</S.FormGroup>

					<S.FormGroup>
						<S.Label>Assign To</S.Label>
						<CustomSelect
							value={formData.assignedTo}
							onChange={(value) => onFormFieldChange("assignedTo", value)}
							options={assigneeOptions}
							placeholder={
								membersLoading ? "Loading members..." : "Select assignee..."
							}
							disabled={!editPermissions.fullAccess || membersLoading}
						/>
						{formErrors.assignedTo && (
							<S.FieldError role="alert">{formErrors.assignedTo}</S.FieldError>
						)}
					</S.FormGroup>
				</S.DialogBody>

				<S.DialogFooter>
					<S.Button variant="ghost" onClick={onClose} disabled={isProcessing}>
						{editPermissions.canEdit ? "Cancel" : "Close"}
					</S.Button>
					{editPermissions.canEdit && (
						<S.Button
							variant="primary"
							onClick={onSubmit}
							disabled={isProcessing || !hasChanges}
							style={{
								opacity: hasChanges ? 1 : 0.5,
								cursor: hasChanges ? "pointer" : "not-allowed",
							}}
						>
							{isProcessing ? "Updating..." : "Update Task"}
						</S.Button>
					)}
				</S.DialogFooter>
			</S.DialogContent>
		</Dialog>
	);
};

export type DeleteTaskDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isDeleting: boolean;
	taskName?: string;
};

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isDeleting,
	taskName,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
			<S.DialogContent maxWidth="28rem">
				<S.DialogHeader>
					<S.DialogTitle>Delete Task</S.DialogTitle>
				</S.DialogHeader>

				<S.DialogBody>
					<S.WarningBox>
						Are you sure you want to delete{" "}
						<strong>{taskName || "this task"}</strong>?<br />
						This action cannot be undone.
					</S.WarningBox>
				</S.DialogBody>

				<S.DialogFooter>
					<S.Button variant="ghost" onClick={onClose} disabled={isDeleting}>
						Cancel
					</S.Button>
					<S.Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						<Trash size={16} /> {isDeleting ? "Deleting..." : "Delete Task"}
					</S.Button>
				</S.DialogFooter>
			</S.DialogContent>
		</Dialog>
	);
};
