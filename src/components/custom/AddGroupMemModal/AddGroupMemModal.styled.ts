// AddGroupModal.styled.ts
import styled from "styled-components";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { Textarea } from "../../ui/textarea";

/* Overlay + Content (giữ giống như trước) */
export const StyledDialogOverlay = styled(DialogOverlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.35);
	z-index: 50;
`;

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

/* existing styles (Form, AvatarRow, ...) keep same as before */
export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

/* --- Friend list UI --- */
export const SearchBox = styled(Input)`
	width: 100%;
	padding: 12px 14px;
	border-radius: 10px;
	box-sizing: border-box;
	margin-top: 10px;
	margin-bottom: 6px;
`;

export const CountText = styled.div`
	font-size: 13px;
	color: var(--muted-foreground, #6b7280);
	margin-bottom: 8px;
`;

export const FriendList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 12px;
	height: 450px;
	overflow-y: auto;
`;

export const FriendItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #f8fafc;
	padding: 10px 12px;
	border-radius: 8px;
	gap: 12px;
`;

export const Left = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const AvatarCircle = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;
`;

export const NameContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export const NameText = styled.div`
	font-weight: 600;
	font-size: 14px;
`;

export const EmailText = styled.div`
	font-size: 12px;
	color: var(--muted-foreground, #6b7280);
`;

/* Add / Added button */
export const AddButton = styled.button<{ $added?: boolean }>`
	background: ${(p) => (p.$added ? "#e6ffed" : "#0b5cff")};
	color: ${(p) => (p.$added ? "#05652a" : "#fff")};
	border: none;
	padding: 8px 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	min-width: 72px;
`;

/* Invite link box */
export const InviteBox = styled.div`
	margin-top: 14px;
	display: flex;
	gap: 12px;
	align-items: center;
`;

export const InviteInput = styled.input`
	flex: 1;
	padding: 10px 12px;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	font-size: 14px;
	box-sizing: border-box;
`;

export const CopyButton = styled.button`
	background: #0b5cff;
	color: white;
	border: none;
	padding: 8px 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
`;

/* reuse and keep previous styled components */
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

export const AvatarControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

export const FileInputWrapper = styled.div`
	input[type="file"] {
		font-size: 14px;
	}
`;

export const Note = styled.div`
	font-size: 12px;
	color: var(--muted-foreground, #6b7280);
`;

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

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const StyledInput = styled(Input)`
	width: 100%;
	box-sizing: border-box;
`;

export const StyledTextarea = styled(Textarea)`
	width: 100%;
	min-height: 96px;
	resize: vertical;
`;

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

export const Footer = styled.div`
	display: flex;
	gap: 12px;
	justify-content: flex-start;
	align-items: center;
	margin-top: 6px;
`;

export const CancelButton = styled(Button)``;
export const SubmitButton = styled(Button)``;

export const ErrorText = styled.div`
	color: #dc2626;
	font-size: 13px;
	margin-top: 4px;
`;
