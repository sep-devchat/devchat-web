// AddGroupModal.styled.ts
import styled from "styled-components";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { Textarea } from "../../ui/textarea";

/* Overlay (nền mờ) */
export const StyledDialogOverlay = styled(DialogOverlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.35);
	z-index: 50;
`;

/* Dialog content (chính) */
export const DialogContentWrapper = styled(DialogContent)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(720px, 95vw);
	max-height: calc(100vh - 48px);
	overflow: auto;
	background: var(--card-bg, #fff);
	border-radius: 12px;
	padding: 20px;
	z-index: 60;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
	box-sizing: border-box;
`;

/* Form layout */
export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

/* Avatar row */
export const AvatarRow = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
`;

export const AvatarPreviewBox = styled.div`
	width: 96px;
	height: 96px;
	border-radius: 50%;
	background: var(--muted, #f3f4f6);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

export const AvatarImg = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const NoAvatar = styled.div`
	text-align: center;
	color: var(--muted-foreground, #6b7280);
`;

/* Controls next to avatar */
export const AvatarControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

/* File input wrapper to keep native input but styled container */
export const FileInputWrapper = styled.div`
	input[type="file"] {
		font-size: 14px;
	}
`;

export const Note = styled.div`
	font-size: 12px;
	color: var(--muted-foreground, #6b7280);
`;

/* small link/button */
export const SmallButton = styled.button`
	background: transparent;
	border: none;
	color: #2563eb;
	padding: 0;
	font-size: 13px;
	cursor: pointer;
	text-decoration: underline;
	width: fit-content;
`;

/* Form fields */
export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

/* Use the existing Input/Textarea components but wrap to set width and spacing */
export const StyledInput = styled(Input)`
	width: 100%;
	box-sizing: border-box;
`;

export const StyledTextarea = styled(Textarea)`
	width: 100%;
	min-height: 96px;
	resize: vertical;
`;

/* Two column layout */
export const TwoColumn = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 12px;

	@media (min-width: 600px) {
		grid-template-columns: 1fr 1fr;
	}
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const Select = styled.select`
	padding: 10px 12px;
	border-radius: 6px;
	border: 1px solid #d1d5db;
	background: #fff;
	font-size: 14px;
	width: 100%;
	box-sizing: border-box;
`;

/* Footer actions */
export const Footer = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-start;
	align-items: center;
	margin-top: 6px;
`;

/* Buttons: keep using Button component, but we wrap to set size if needed */
export const CancelButton = styled(Button)``;
export const SubmitButton = styled(Button)``;

/* Error text */
export const ErrorText = styled.div`
	color: #dc2626;
	font-size: 13px;
	margin-top: 4px;
`;
