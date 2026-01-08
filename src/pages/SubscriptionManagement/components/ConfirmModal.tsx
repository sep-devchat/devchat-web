import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import * as S from "../SubscriptionManagement.styled";

export type ConfirmModalVariant = "default" | "danger";

export interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	confirmText: string;
	cancelText?: string;
	confirmVariant?: ConfirmModalVariant;
	isConfirming?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	title,
	description,
	confirmText,
	cancelText = "Cancel",
	confirmVariant = "default",
	isConfirming = false,
	onConfirm,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<S.ModalOverlay>
			<S.ModalCard>
				<div>
					<S.ModalTitle>{title}</S.ModalTitle>
					<p style={{ margin: 0, color: "#64748b" }}>{description}</p>
				</div>
				<S.ModalActions>
					<Button
						variant="outline"
						type="button"
						onClick={onClose}
						disabled={isConfirming}
					>
						{cancelText}
					</Button>
					<Button
						type="button"
						variant={confirmVariant === "danger" ? "destructive" : "default"}
						onClick={onConfirm}
						disabled={isConfirming}
					>
						{isConfirming && <Spinner className="mr-2" />}
						{confirmText}
					</Button>
				</S.ModalActions>
			</S.ModalCard>
		</S.ModalOverlay>
	);
};

export default ConfirmModal;
