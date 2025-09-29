import { theme } from "@/themes";
import styled from "styled-components";

export const CenterPanelRoot = styled.div`
	width: 100%;
	height: 100%;
	font-family:
		Inter,
		system-ui,
		-apple-system,
		"Segoe UI",
		Roboto,
		"Helvetica Neue",
		Arial;
	color: #1f2937;
	padding-bottom: 16px;
	display: flex;
	flex-direction: column;
`;

export const CPContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-bottom: 0.5px solid ${theme.color.grey50};
`;

export const CPHeaderIcon = styled.div`
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPHeaderTitle = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPChatArea = styled.div`
	height: calc(100vh - 120px);
	// height: 100%;
	display: flex;
	flex-direction: column;
	background: ${theme.color.grey10};
	padding: 20px;
`;

export const CPHash = styled.div`
	width: 68px;
	height: 68px;
	border-radius: 999px;
	background: ${theme.color.grey50};
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: ${theme.color.white};
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 32px;
	font-weight: 600;
`;

export const CPAvatarChannel = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
`;

export const CPChannel = styled.span`
	color: ${theme.color.primary};
`;

export const CPDateArea = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
`;

export const CPDateDivider = styled.div`
	width: 100%;
	height: max-content;
	border-block-start: 1px solid ${theme.color.grey40};
`;

export const CPDate = styled.div`
	color: ${theme.color.grey90};
	font-size: 13px;
	width: max-content;
	text-align: center;
`;

export const CPMessages = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 16px;
	overflow-y: auto;
	height: 100%;

	.cp-msg-row {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.cp-msg-row.left {
		justify-content: flex-start;
	}
	.cp-msg-row.right {
		justify-content: flex-end;
	}
`;

export const CPAvatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	margin-top: 27.5px;
`;

export const CPMsgCol = styled.div`
	max-width: 74%;
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 640px) {
		max-width: 82%;
	}

	.cp-bubble {
		position: relative;
		padding: 10px 12px;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
	}

	.cp-bubble.them {
		background: #eff2f5;
	}

	.cp-bubble.me {
		background: ${theme.color.primary20};
		align-self: flex-end;
	}
`;

export const CPBubbleTop = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
`;

export const CPAuthorName = styled.div`
	font-weight: 600;
	font-size: 13px;
`;

export const CPTimeSmall = styled.div`
	font-size: 12px;
	color: #9aa3b2;
`;

export const CPBubbleContent = styled.div`
	margin-top: 6px;
	white-space: pre-line;
`;

export const CPReactions = styled.div`
	display: flex;
	gap: 6px;
	margin-top: 8px;
`;

export const CPReactionPill = styled.div`
	padding: 4px 8px;
	border-radius: 999px;
	background: #f1f5f9;
	display: flex;
	gap: 6px;
	align-items: center;
	font-size: 13px;
`;

export const CPReactionCount = styled.span`
	font-size: 12px;
	color: #374151;
`;

export const CPHoverActions = styled.div`
	position: absolute;
	top: 6px;
	right: 6px;
	display: flex;
	gap: 8px;
	align-items: center;
`;

export const CPEmojiPicker = styled.div`
	display: flex;
	gap: 6px;
`;

export const CPEmoji = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;
	font-size: 14px;
`;

export const CPRepBtn = styled.button`
	display: flex;
	gap: 6px;
`;

export const CPThreadPreviewRow = styled.div`
	margin-top: 6px;
`;

export const CPThreadPreview = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
	cursor: pointer;
	color: #374151;
`;

export const CPThreadIcon = styled.div`
	background: #f3f4f6;
	padding: 6px;
	border-radius: 6px;
`;

export const CPThreadText = styled.div`
	color: #000;
`;

export const CPThreadExpanded = styled.div`
	margin-top: 8px;
	border-left: 3px solid #eef2ff;
	padding-left: 12px;
`;

export const CPThreadList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 8px;

	.cp-reply-row {
		padding: 8px;
		border-radius: 8px;
		background: #fafafa;
	}
	.cp-reply-me {
		background: #eef2ff;
		align-self: flex-end;
	}
`;

export const CPReplyAuthor = styled.div`
	font-weight: 600;
	font-size: 13px;
`;

export const CPReplyContent = styled.div`
	margin-top: 4px;
`;

export const CPThreadComposer = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	input {
		flex: 1;
		padding: 8px;
		border-radius: 8px;
		border: 1px solid #e6e9ef;
	}
	button {
		padding: 8px 12px;
		border-radius: 8px;
		background: #4f46e5;
		color: white;
		border: none;
	}
`;

export const CPComposerRoot = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
`;

export const CPInput = styled.input`
	width: 100%;
	min-height: 54px;
	padding: 10px;
	border-radius: 8px;
	border: 1px solid #e6e9ef;
	resize: vertical;
`;

export const CPComposerActions = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const CPCounter = styled.div`
	color: #9aa3b2;
	font-size: 13px;
`;

export const CPSendBtn = styled.button`
	padding: 8px 12px;
	background: #4f46e5;
	color: white;
	border: none;
	border-radius: 8px;
`;

export const IconBtn = styled.button`
	background: transparent;
	border: none;
	padding: 6px;
	border-radius: 6px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: inherit;
	position: relative;
	transition: background 0.15s ease;

	&:hover {
		background: #f3f4f6;
	}

	&:focus {
		outline: 2px solid rgba(79, 70, 229, 0.15);
		outline-offset: 2px;
	}
`;

export const Tooltip = styled.span<{ visible?: boolean }>`
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	transform: translateX(-50%);
	background: #111827;
	color: white;
	padding: 6px 8px;
	border-radius: 6px;
	font-size: 12px;
	white-space: nowrap;
	pointer-events: none;
	opacity: ${(p) => (p.visible ? 1 : 0)};
	visibility: ${(p) => (p.visible ? "visible" : "hidden")};
	transition:
		opacity 0.12s ease,
		visibility 0.12s ease;
	z-index: 30;
`;
