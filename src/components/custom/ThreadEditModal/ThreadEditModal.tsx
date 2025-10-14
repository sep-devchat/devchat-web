import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
	ModalOverlay,
	ModalContainer,
	ModalHeader,
	ModalTitle,
	CloseButton,
	ModalContent,
	FormGroup,
	Label,
	Input,
	TextArea,
	ErrorMessage,
	ModalFooter,
	CancelButton,
	SubmitButton,
} from "./ThreadEditModal.styled";

interface ThreadEditModalProps {
	isOpen: boolean;
	threadId: string;
	groupId: string;
	channelId: string;
	initialName: string;
	initialDescription: string;
	onClose: () => void;
	onSubmit: (updatedThread: {
		name: string;
		description: string;
	}) => Promise<void>;
}

const ThreadEditModal: React.FC<ThreadEditModalProps> = ({
	isOpen,
	initialName,
	initialDescription,
	onClose,
	onSubmit,
}) => {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			setName(initialName);
			setDescription(initialDescription);
			setError("");
		}
	}, [isOpen, initialName, initialDescription]);

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Thread name cannot be empty");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await onSubmit({
				name: name.trim(),
				description: description.trim(),
			});
			onClose();
		} catch (err: any) {
			setError(err?.message || "Failed to update thread");
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<ModalOverlay onClick={onClose} />
			<ModalContainer>
				<ModalHeader>
					<ModalTitle>Edit Thread</ModalTitle>
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				</ModalHeader>

				<ModalContent>
					<FormGroup>
						<Label>Thread Name *</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter thread name"
							disabled={isLoading}
						/>
					</FormGroup>

					<FormGroup>
						<Label>Description</Label>
						<TextArea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Enter thread description"
							rows={4}
							disabled={isLoading}
						/>
					</FormGroup>

					{error && <ErrorMessage>{error}</ErrorMessage>}
				</ModalContent>

				<ModalFooter>
					<CancelButton onClick={onClose} disabled={isLoading}>
						Cancel
					</CancelButton>
					<SubmitButton onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Updating..." : "Update"}
					</SubmitButton>
				</ModalFooter>
			</ModalContainer>
		</>
	);
};

export default ThreadEditModal;
