import styled from "styled-components";

export const SettingInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 12px;
	flex: 1;
`;

export const SettingIcon = styled.div`
	width: 24px;
	height: 24px;
	align-items: center;
	justify-content: center;
	color: #1a1a1a;
	margin-top: 2px;
`;

export const SettingText = styled.div`
	flex: 1;
`;

export const SettingTitle = styled.h3`
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 4px;
`;

export const SettingDescription = styled.p`
	color: #666666;
	font-size: 14px;
	line-height: 1.5;
`;

export const Switch = styled.div<{ $checked: boolean }>`
	width: 48px;
	height: 24px;
	background: ${({ $checked }) => ($checked ? "#133E87" : "#d1d5db")};
	border-radius: 12px;
	position: relative;
	cursor: pointer;
	transition: all 0.2s ease;
	align-self: center;

	&::after {
		content: "";
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: ${({ $checked }) => ($checked ? "26px" : "2px")};
		transition: all 0.2s ease;
	}
`;

export const RadioGroup = styled.div`
	margin-top: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-left: 36px;
`;

export const RadioItem = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
`;

export const RadioInput = styled.input`
	width: 16px;
	height: 16px;
	accent-color: #608bc1;
`;

export const RadioLabel = styled.span`
	font-size: 14px;
	color: #1a1a1a;
`;

export const SelectContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const Select = styled.select`
	width: 200px;
	padding: 8px 12px;
	border: 1px solid #666;
	border-bottom: 2px solid #666;
	border-radius: 6px;
	background: white;
	font-size: 14px;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;

	appearance: none;
	background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 12px center;
	background-size: 14px;
	padding-right: 36px;

	&:focus {
		outline: none;
	}
`;

export const InfoButton = styled.button`
	padding: 6px;
	background: transparent;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	color: #6b7280;
	transition: all 0.2s ease;

	&:hover {
		background: #f3f4f6;
	}
	&:focus {
		outline: none;
	}
`;

export const SettingItemNoBorder = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 16px;
	padding: 16px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const ThemeContainer = styled.div`
	display: flex;
	gap: 10px;
`;

export const ThemeOption = styled.div<{
	$color: string;
	$selected: boolean;
	$id: string;
}>`
	width: 46px;
	height: 46px;
	border-radius: 50%;
	background-color: ${({ $color }) => $color};
	cursor: pointer;
	box-sizing: border-box;
	transition: all 0.2s ease;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	border: ${({ $selected, $id }) => {
		if ($id === "light") {
			return $selected ? "5px solid #608BC1" : "2px solid #d1d5db";
		}
		return $selected ? "5px solid #E2E2B6" : "2px solid transparent";
	}};

	&:hover {
		transform: scale(1.05);
	}

	&::after {
		content: "✓";
		font-size: 14px;
		font-weight: bold;
		opacity: ${({ $selected }) => ($selected ? 1 : 0)};
		transition: opacity 0.2s ease;
		color: ${({ $selected, $id, $color }) => {
			if (!$selected) return "transparent";
			if ($id === "light") return "#608BC1";
			if ($color === "#ffffff") return "#E2E2B6";
			return "#E2E2B6";
		}};
	}
`;

export const ChatPreviewContainer = styled.div`
	margin-top: 12px;
`;

export const ChatMessage = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 12px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const UserAvatar = styled.div`
	width: 32px;
	height: 32px;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	font-weight: 500;
`;

export const MessageContent = styled.div`
	flex: 1;

	> span,
	> div > span {
		font-weight: 500;
		font-size: 14px;
		color: #1a1a1a;
	}
`;

export const MessageTime = styled.span`
	font-size: 12px;
	color: #666666;
	font-weight: 300;
	margin-left: 10px;
`;

export const MessageBubble = styled.div`
	background-color: #f3f3e0;
	color: rgba(26, 26, 26, 0.8);
	padding: 8px 12px;
	border-radius: 8px;
	font-size: 14px;
	display: inline-block;
	max-width: 100%;
	word-wrap: break-word;
`;

export const MessageText = styled.div`
	font-size: 14px;
	color: #374151;
	margin-top: 2px;
`;

export const MessageStyleContainer = styled.div`
	display: flex;
	gap: 16px;
	margin-top: 12px;
`;

export const MessageStyleOption = styled.div<{ $selected: boolean }>`
	flex: 1;
	padding: 12px;
	border: ${({ $selected }) =>
		$selected ? "2px solid #133E87" : "1px solid #d1d5db"};
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;

	&:hover {
		border-color: #133e87;
	}
`;

export const MessageStyleTitle = styled.div`
	font-weight: 500;
	font-size: 14px;
	color: #1a1a1a;
	margin-bottom: 8px;
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const CheckIcon = styled.div<{ $visible: boolean }>`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background-color: #133e87;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ $visible }) => ($visible ? 1 : 0)};
	transition: opacity 0.2s ease;

	&::after {
		content: "✓";
		color: white;
		font-size: 10px;
		font-weight: bold;
	}
`;

export const MessageStyleDescription = styled.div`
	font-size: 12px;
	color: #6b7280;
	margin-bottom: 8px;
`;

export const MiniChatPreview = styled.div`
	background-color: #f8fafc;
	border-radius: 6px;
	padding: 8px;
`;

export const MiniChatMessage = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	margin-bottom: 6px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const MiniUserAvatar = styled.div`
	width: 20px;
	height: 20px;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 10px;
	font-weight: 500;
`;

export const MiniMessageContent = styled.div`
	flex: 1;
`;

export const MiniMessageBubble = styled.div`
	background-color: #133e87;
	color: white;
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 11px;
	display: inline-block;
	max-width: 100%;
	word-wrap: break-word;
`;

export const MiniMessageText = styled.div`
	font-size: 11px;
	color: #374151;
`;

export const SettingItem = styled.div<{ $noBorder?: boolean }>`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 16px;
	border: ${({ $noBorder }) => ($noBorder ? "none" : "1px solid #AAAAAA")};
	border-radius: 8px;
	padding: 16px;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const MessageDisplayOptions = styled.div`
	margin-top: 12px;
	margin-bottom: 16px;
`;

export const MessageDisplayOption = styled.div<{ $selected: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 12px;
	border: 2px solid ${({ $selected }) => ($selected ? "#133E87" : "#e5e7eb")};
	border-radius: 8px;
	cursor: pointer;
	margin-bottom: 8px;
	transition: all 0.2s ease;

	&:last-child {
		margin-bottom: 0;
	}

	&:hover {
		border-color: ${({ $selected }) => ($selected ? "#133E87" : "#d1d5db")};
	}

	> span {
		font-size: 14px;
		color: #374151;
		line-height: 1.4;
	}
`;

export const MessageDisplayRadio = styled.div<{ $selected: boolean }>`
	width: 20px;
	height: 20px;
	border: 2px solid ${({ $selected }) => ($selected ? "#133E87" : "#d1d5db")};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 2px;
	background-color: ${({ $selected }) =>
		$selected ? "#133E87" : "transparent"};

	> span {
		color: white;
		font-size: 12px;
		font-weight: bold;
	}
`;

export const ClickableChatPreview = styled.div<{ $selected: boolean }>`
	position: relative;
	margin-bottom: 10px;
	padding: 12px;
	background-color: #fff;
	border-radius: 8px;
	border: ${({ $selected }) =>
		$selected ? "2px solid #608BC1" : "1px solid #e5e7eb"};
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		border-color: #608bc1;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const SelectionTick = styled.div<{ $visible: boolean }>`
	position: absolute;
	top: 8px;
	right: 8px;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: #608bc1;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ $visible }) => ($visible ? 1 : 0)};
	transition: opacity 0.2s ease;

	&::after {
		content: "✓";
		color: white;
		font-size: 12px;
		font-weight: bold;
	}
`;

//Account Form
export const FormContainer = styled.div`
	background: white;
	border-radius: 8px;
	overflow: hidden;
	margin: 0 auto;
	border: 1px solid #aaaaaa;
	margin-bottom: 16px;
`;

export const ProfileHeader = styled.div`
	background: linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%);
	padding: 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

export const Avatar = styled.div`
	width: 64px;
	height: 64px;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 24px;
	font-weight: 600;
`;

export const ProfileDetails = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ProfileName = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
`;

export const ProfileEmail = styled.p`
	font-size: 14px;
	color: #666666;
	margin: 0;
`;

export const EditButton = styled.button`
	background-color: #133e87;
	color: white;
	padding: 8px 16px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(32, 102, 223, 0.25);
		color: #133e87;
	}

	&:focus {
		outline: none;
	}
`;

export const FormContent = styled.div`
	padding: 24px;
`;

export const FormRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 20px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 6px;
`;

export const Input = styled.input`
	padding: 10px 12px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	background: white;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;

	&:focus {
		outline: none;
		border-color: #133e87;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const EmailSection = styled.div`
	margin-top: 24px;
	padding-top: 20px;
	border-top: 1px solid #e5e7eb;
`;

export const EmailSectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 16px 0;
`;

export const EmailItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const EmailIcon = styled.div`
	width: 44px;
	height: 44px;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 16px;
`;

export const EmailDetails = styled.div`
	flex: 1;
`;

export const EmailAddress = styled.div`
	font-size: 14px;
	color: #666666;
	font-weight: 500;
`;

export const EmailTime = styled.div`
	font-size: 12px;
	color: #666666;
`;

export const AddEmailButton = styled.button`
	background: #cbdceb;
	border: none;
	color: #133e87;
	font-size: 14px;
	cursor: pointer;
	padding: 10px 20px;
	transition: color 0.2s ease;
	margin-left: 56px;

	&:hover {
		color: #1a1a1a;
	}

	&::before {
		content: "+ ";
		font-weight: 600;
	}
`;

export const SelectAccount = styled.select`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background: white;
	font-size: 14px;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;

	appearance: none;
	background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 12px center;
	background-size: 14px;
	padding-right: 36px;

	&:focus {
		outline: none;
	}
`;
