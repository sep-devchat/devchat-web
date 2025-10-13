import React from "react";
import { AlertTriangle } from "lucide-react";
import {
	Button,
	ButtonGroup,
	Header,
	IconWrapper,
	Message,
	Modal,
	Overlay,
	Title,
} from "./ConfirmModal.styled";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
	isLoading = false,
}) => {
	if (!isOpen) return null;

	return (
		<Overlay onClick={onCancel}>
			<Modal onClick={(e) => e.stopPropagation()}>
				<Header>
					<IconWrapper>
						<AlertTriangle size={24} />
					</IconWrapper>
					<Title>{title}</Title>
				</Header>
				<Message>{message}</Message>
				<ButtonGroup>
					<Button variant="secondary" onClick={onCancel} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button variant="primary" onClick={onConfirm} disabled={isLoading}>
						{isLoading ? "Processing..." : confirmText}
					</Button>
				</ButtonGroup>
			</Modal>
		</Overlay>
	);
};

export default ConfirmModal;
