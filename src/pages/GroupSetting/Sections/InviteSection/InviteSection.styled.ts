import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { theme } from "@/themes";

export const SectionWrapper = styled.div`
	overflow: auto;
	background: var(--card-bg, #fff);
	border-radius: 0.75rem;
	padding: 1rem;

	@media (min-width: 1440px) {
		border-radius: 0.875rem;
		padding: 1.25rem;
	}

	@media (max-width: 1220px) {
		border-radius: 0.625rem;
		padding: 0.875rem;
	}
`;

export const TitleArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.3125rem;
	margin-bottom: 1.5rem;

	@media (min-width: 1440px) {
		gap: 0.375rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 1220px) {
		gap: 0.25rem;
		margin-bottom: 1.25rem;
	}
`;

export const TitleSection = styled.h2`
	font-weight: 700;
	font-size: 1.125rem;
	color: ${theme.color.black};

	@media (min-width: 1440px) {
		font-size: 1.25rem;
	}

	@media (max-width: 1220px) {
		font-size: 1rem;
	}
`;

export const DescripSection = styled.p`
	font-size: 0.8125rem;
	color: ${theme.color.grey90};

	@media (min-width: 1440px) {
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}
`;

/* existing styles (Form, AvatarRow, ...) keep same as before */
export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	@media (min-width: 1440px) {
		gap: 1.75rem;
	}

	@media (max-width: 1220px) {
		gap: 1.25rem;
	}
`;

/* --- Friend list UI --- */
export const SearchBox = styled(Input)`
	width: 100%;
	padding: 0.625rem 0.75rem;
	box-sizing: border-box;
	margin-top: 0.5rem;
	margin-bottom: 0.375rem;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
	font-size: 0.8125rem;
	box-shadow: none;

	@media (min-width: 1440px) {
		padding: 0.75rem 0.875rem;
		margin-top: 0.625rem;
		margin-bottom: 0.4375rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 0.625rem;
		margin-top: 0.375rem;
		margin-bottom: 0.3125rem;
		font-size: 0.75rem;
	}
`;

export const CountText = styled.div`
	font-size: 0.75rem;
	color: var(--muted-foreground, #6b7280);
	margin-bottom: 0.5rem;

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
		margin-bottom: 0.5625rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
		margin-bottom: 0.4375rem;
	}
`;

export const FriendList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	margin-bottom: 0.75rem;
	height: 24rem;
	overflow-y: auto;

	@media (min-width: 1440px) {
		gap: 0.75rem;
		margin-bottom: 0.875rem;
		height: 26rem;
	}

	@media (max-width: 1220px) {
		gap: 0.5rem;
		margin-bottom: 0.625rem;
		height: 20rem;
	}
`;

export const FriendItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #f8fafc;
	padding: 0.625rem 0.75rem;
	border-radius: 0.5rem;
	gap: 0.75rem;

	@media (min-width: 1440px) {
		padding: 0.75rem 0.875rem;
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 0.625rem;
		gap: 0.625rem;
	}
`;

export const Left = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;

	@media (min-width: 1440px) {
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}
`;

export const AvatarCircle = styled.img`
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
	}

	@media (max-width: 1220px) {
		width: 2rem;
		height: 2rem;
	}
`;

export const NameContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export const NameText = styled.div`
	font-weight: 600;
	font-size: 0.8125rem;

	@media (min-width: 1440px) {
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}
`;

export const EmailText = styled.div`
	font-size: 0.6875rem;
	color: var(--muted-foreground, #6b7280);

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.625rem;
	}
`;

/* Add / Added button */
export const AddButton = styled.button<{ $added?: boolean }>`
	background: ${(p) =>
		p.$added ? `${theme.color.successBackground}` : `${theme.color.primary}`};
	color: ${(p) => (p.$added ? `${theme.color.success}` : "#fff")};
	border: none;
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	cursor: pointer;
	font-weight: 600;
	min-width: 4rem;
	font-size: 0.8125rem;

	@media (min-width: 1440px) {
		padding: 0.5625rem 0.875rem;
		min-width: 4.5rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.4375rem 0.625rem;
		min-width: 3.5rem;
		font-size: 0.75rem;
	}
`;

/* Invite link box */
export const InviteBox = styled.div`
	margin-top: 0.75rem;
	display: flex;
	gap: 0.75rem;
	align-items: center;

	@media (min-width: 1440px) {
		margin-top: 0.875rem;
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		margin-top: 0.625rem;
		gap: 0.625rem;
	}
`;

export const InviteInput = styled.input`
	flex: 1;
	padding: 0.625rem 0.75rem;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
	font-size: 0.8125rem;
	box-sizing: border-box;

	@media (min-width: 1440px) {
		padding: 0.75rem 0.875rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 0.625rem;
		font-size: 0.75rem;
	}
`;

export const CopyButton = styled.button`
	background: ${theme.color.primary};
	color: white;
	border: none;
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.8125rem;

	@media (min-width: 1440px) {
		padding: 0.5625rem 0.875rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.4375rem 0.625rem;
		font-size: 0.75rem;
	}
`;

/* reuse and keep previous styled components */
export const AvatarRow = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;

	@media (min-width: 1440px) {
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}
`;

export const AvatarPreviewBox = styled.div`
	width: 4.5rem;
	height: 4.5rem;
	border-radius: 50%;
	background: var(--muted, #f3f4f6);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		width: 5rem;
		height: 5rem;
	}

	@media (max-width: 1220px) {
		width: 4rem;
		height: 4rem;
	}
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
	font-size: 0.75rem;

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}
`;

export const AvatarControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4375rem;
	flex: 1;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		gap: 0.3125rem;
	}
`;

export const FileInputWrapper = styled.div`
	input[type="file"] {
		font-size: 0.75rem;
	}

	@media (min-width: 1440px) {
		input[type="file"] {
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 1220px) {
		input[type="file"] {
			font-size: 0.6875rem;
		}
	}
`;

export const Note = styled.div`
	font-size: 0.625rem;
	color: var(--muted-foreground, #6b7280);

	@media (min-width: 1440px) {
		font-size: 0.6875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.5625rem;
	}
`;

export const SmallButton = styled.button`
	background: transparent;
	border: none;
	color: #2563eb;
	padding: 0;
	font-size: 0.6875rem;
	cursor: pointer;
	text-decoration: underline;
	width: fit-content;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.625rem;
	}
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	@media (min-width: 1440px) {
		gap: 0.3125rem;
	}

	@media (max-width: 1220px) {
		gap: 0.1875rem;
	}
`;

export const StyledInput = styled(Input)`
	width: 100%;
	box-sizing: border-box;
`;

export const StyledTextarea = styled(Textarea)`
	width: 100%;
	min-height: 4.5rem;
	resize: vertical;

	@media (min-width: 1440px) {
		min-height: 5rem;
	}

	@media (max-width: 1220px) {
		min-height: 4rem;
	}
`;

export const TwoColumn = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.75rem;

	@media (min-width: 600px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1440px) {
		gap: 0.875rem;
	}

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	@media (min-width: 1440px) {
		gap: 0.3125rem;
	}

	@media (max-width: 1220px) {
		gap: 0.1875rem;
	}
`;

export const Select = styled.select`
	padding: 0.625rem 0.75rem;
	border-radius: 0.375rem;
	border: 1px solid #d1d5db;
	background: #fff;
	font-size: 0.8125rem;
	width: 100%;
	box-sizing: border-box;

	@media (min-width: 1440px) {
		padding: 0.75rem 0.875rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 0.625rem;
		font-size: 0.75rem;
	}
`;

export const Footer = styled.div`
	display: flex;
	gap: 0.5rem;
	justify-content: flex-start;
	align-items: center;
	margin-top: 0.25rem;

	@media (min-width: 1440px) {
		gap: 0.625rem;
		margin-top: 0.3125rem;
	}

	@media (max-width: 1220px) {
		gap: 0.375rem;
		margin-top: 0.1875rem;
	}
`;

export const CancelButton = styled(Button)``;
export const SubmitButton = styled(Button)``;

export const ErrorText = styled.div`
	color: #dc2626;
	font-size: 0.6875rem;
	margin-top: 0.1875rem;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.625rem;
		margin-top: 0.125rem;
	}
`;

export const Divider = styled.div`
	color: ${theme.color.grey40};
	width: 100%;
	height: 1px;
	background-color: ${theme.color.grey40};
`;

export const ContentArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	@media (min-width: 1440px) {
		gap: 1.75rem;
	}

	@media (max-width: 1220px) {
		gap: 1.25rem;
	}
`;
