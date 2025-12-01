import styled from "styled-components";

export const SettingInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 0.75rem;
	flex: 1;
`;

export const SettingIcon = styled.div`
	width: 1.5rem;
	height: 1.5rem;
	align-items: center;
	justify-content: center;
	color: #1a1a1a;
	margin-top: 0.125rem;

	@media (max-width: 1220px) {
		width: 18px;
		height: 18px;
		margin-top: 0.0875rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 18px;
		height: 18px;
		margin-top: 0.1rem;
	}

	@media (min-width: 1920px) {
		width: 22px;
		height: 22px;
		margin-top: 0.1rem;
	}
`;

export const SettingText = styled.div`
	flex: 1;
`;

export const SettingTitle = styled.h3`
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 0.25rem;
	@media (max-width: 1220px) {
		font-size: 14.5px;
		margin-bottom: 3px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15.5px;
		margin-bottom: 3px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
		margin-bottom: 8px;
	}
`;

export const SettingDescription = styled.p`
	color: #666666;
	font-size: 0.875rem;
	line-height: 1.5;

	@media (max-width: 1220px) {
		font-size: 11.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12.5px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const Switch = styled.div<{ $checked: boolean }>`
	width: 3rem;
	height: 1.5rem;
	background: ${({ $checked }) => ($checked ? "#133E87" : "#d1d5db")};
	border-radius: 0.75rem;
	position: relative;
	cursor: pointer;
	transition: all 0.2s ease;
	align-self: center;

	@media (min-width: 1440px) {
		width: 2.4rem;
		height: 1.2rem;
		border-radius: 0.6rem;
	}

	@media (max-width: 1220px) {
		width: 2.1rem;
		height: 1.05rem;
		border-radius: 0.525rem;
	}

	&::after {
		content: "";
		width: 1.25rem;
		height: 1.25rem;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 0.125rem;
		left: ${({ $checked }) => ($checked ? "1.625rem" : "0.125rem")};
		transition: all 0.2s ease;

		@media (min-width: 1440px) {
			width: 1rem;
			height: 1rem;
			top: 0.1rem;
			left: ${({ $checked }) => ($checked ? "1.3rem" : "0.1rem")};
		}

		@media (max-width: 1220px) {
			width: 0.875rem;
			height: 0.875rem;
			top: 0.0875rem;
			left: ${({ $checked }) => ($checked ? "1.1375rem" : "0.0875rem")};
		}
	}
`;

export const RadioGroup = styled.div`
	margin-top: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-left: 2.25rem;

	@media (min-width: 1440px) {
		margin-top: 0.6rem;
		gap: 0.4rem;
		margin-left: 1.8rem;
	}

	@media (max-width: 1220px) {
		margin-top: 0.525rem;
		gap: 0.35rem;
		margin-left: 1.575rem;
	}
`;

export const RadioItem = styled.label`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;

	@media (min-width: 1440px) {
		gap: 0.4rem;
	}

	@media (max-width: 1220px) {
		gap: 0.35rem;
	}
`;

export const RadioInput = styled.input`
	width: 1rem;
	height: 1rem;
	accent-color: #608bc1;

	@media (min-width: 1440px) {
		width: 0.8rem;
		height: 0.8rem;
	}

	@media (max-width: 1220px) {
		width: 0.875rem;
		height: 0.875rem;
	}
`;

export const RadioLabel = styled.span`
	font-size: 0.875rem;
	color: #1a1a1a;

	@media (max-width: 1220px) {
		font-size: 11.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12.5px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}
`;

export const SelectContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	@media (min-width: 1440px) {
		gap: 0.4rem;
	}

	@media (max-width: 1220px) {
		gap: 0.35rem;
	}
`;

export const Select = styled.select`
	width: 12.5rem;
	padding: 0.5rem 0.75rem;
	border: 1px solid #666;
	border-bottom: 2px solid #666;
	border-radius: 0.375rem;
	background: white;
	font-size: 0.875rem;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s ease;

	appearance: none;
	background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 0.75rem center;
	background-size: 0.875rem;
	padding-right: 2.25rem;

	@media (min-width: 1440px) {
		width: 10rem;
		padding: 0.4rem 0.6rem;
		border-radius: 0.3rem;
		font-size: 12.5;
		background-position: right 0.6rem center;
		background-size: 0.875rem;
		padding-right: 1.8rem;
	}

	@media (max-width: 1220px) {
		width: 8.75rem;
		padding: 0.35rem 0.525rem;
		border-radius: 0.2625rem;
		font-size: 11.5px;
		background-position: right 0.525rem center;
		background-size: 0.75rem;
		padding-right: 1.575rem;
	}

	@media (min-width: 1440px) {
		width: 10rem;
		padding: 0.4rem 0.6rem;
		border-radius: 0.3rem;
		font-size: 14;
		background-position: right 0.6rem center;
		background-size: 0.875rem;
		padding-right: 1.8rem;
	}

	&:focus {
		outline: none;
	}
`;

export const InfoButton = styled.button`
	padding: 0.375rem;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	color: #6b7280;
	transition: all 0.2s ease;

	@media (max-width: 1220px) {
		font-size: 12.5px;
		padding: 0.4375rem 0.875rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
		padding: 0.5rem 1rem;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 0.4375rem 0.875rem;
	}

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
	margin-bottom: 1rem;
	padding: 1rem;

	@media (min-width: 1440px) {
		margin-bottom: 0.8rem;
		padding: 0.8rem;
	}

	@media (max-width: 1220px) {
		margin-bottom: 0.875rem;
		padding: 0.875rem;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const ThemeContainer = styled.div`
	display: flex;
	gap: 0.625rem;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		gap: 0.4375rem;
	}
`;

export const ThemeOption = styled.div<{
	$color: string;
	$selected: boolean;
	$id: string;
}>`
	width: 2.875rem;
	height: 2.875rem;
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

	@media (min-width: 1440px) {
		width: 2.3rem;
		height: 2.3rem;
		border: ${({ $selected, $id }) => {
			if ($id === "light") {
				return $selected ? "4px solid #608BC1" : "1.6px solid #d1d5db";
			}
			return $selected ? "4px solid #E2E2B6" : "1.6px solid transparent";
		}};
	}

	@media (max-width: 1220px) {
		width: 2.0125rem;
		height: 2.0125rem;
		border: ${({ $selected, $id }) => {
			if ($id === "light") {
				return $selected ? "3.5px solid #608BC1" : "1.4px solid #d1d5db";
			}
			return $selected ? "3.5px solid #E2E2B6" : "1.4px solid transparent";
		}};
	}

	&:hover {
		transform: scale(1.05);
	}

	&::after {
		content: "✓";
		font-size: 0.875rem;
		font-weight: bold;
		opacity: ${({ $selected }) => ($selected ? 1 : 0)};
		transition: opacity 0.2s ease;
		color: ${({ $selected, $id, $color }) => {
			if (!$selected) return "transparent";
			if ($id === "light") return "#608BC1";
			if ($color === "#ffffff") return "#E2E2B6";
			return "#E2E2B6";
		}};

		@media (min-width: 1440px) {
			font-size: 12.5;
		}

		@media (max-width: 1220px) {
			font-size: 11.5;
		}

		@media (min-width: 1920px) {
			font-size: 14px;
		}
	}
`;

export const ChatPreviewContainer = styled.div`
	margin-top: 0.75rem;

	@media (min-width: 1440px) {
		margin-top: 0.6rem;
	}

	@media (max-width: 1220px) {
		margin-top: 0.525rem;
	}
`;

export const ChatMessage = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	margin-bottom: 0.75rem;

	@media (min-width: 1440px) {
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	@media (max-width: 1220px) {
		gap: 0.525rem;
		margin-bottom: 0.525rem;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const UserAvatar = styled.div`
	width: 2rem;
	height: 2rem;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 0.875rem;
	font-weight: 500;

	@media (min-width: 1440px) {
		width: 1.6rem;
		height: 1.6rem;
		font-size: 13.5;
	}

	@media (max-width: 1220px) {
		width: 1.4rem;
		height: 1.4rem;
		font-size: 12.5;
	}

	@media (min-width: 1920px) {
		width: 1.6rem;
		height: 1.6rem;
		font-size: 16px;
	}
`;

export const MessageContent = styled.div`
	flex: 1;

	> span,
	> div > span {
		font-weight: 500;
		font-size: 0.875rem;
		color: #1a1a1a;

		@media (min-width: 1440px) {
			font-size: 0.875rem;
		}

		@media (max-width: 1220px) {
			font-size: 0.75rem;
		}
	}
`;

export const MessageTime = styled.span`
	font-size: 0.75rem;
	color: #666666;
	font-weight: 300;
	margin-left: 0.625rem;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
		margin-left: 0.5rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
		margin-left: 0.4375rem;
	}
`;

export const MessageBubble = styled.div`
	background-color: #f3f3e0;
	color: rgba(26, 26, 26, 0.8);
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	display: inline-block;
	max-width: 100%;
	word-wrap: break-word;

	@media (min-width: 1440px) {
		padding: 0.4rem 0.6rem;
		border-radius: 0.4rem;
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 0.35rem 0.525rem;
		border-radius: 0.35rem;
		font-size: 0.75rem;
	}
`;

export const MessageText = styled.div`
	font-size: 0.875rem;
	color: #374151;
	margin-top: 0.125rem;

	@media (min-width: 1440px) {
		font-size: 0.875rem;
		margin-top: 0.1rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
		margin-top: 0.0875rem;
	}
`;

export const MessageStyleContainer = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 0.75rem;

	@media (min-width: 1440px) {
		gap: 0.8rem;
		margin-top: 0.6rem;
	}

	@media (max-width: 1220px) {
		gap: 0.875rem;
		margin-top: 0.525rem;
	}
`;

export const MessageStyleOption = styled.div<{ $selected: boolean }>`
	flex: 1;
	padding: 0.75rem;
	border: ${({ $selected }) =>
		$selected ? "2px solid #133E87" : "1px solid #d1d5db"};
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;

	@media (min-width: 1440px) {
		padding: 0.6rem;
		border-radius: 0.4rem;
	}

	@media (max-width: 1220px) {
		padding: 0.525rem;
		border-radius: 0.35rem;
	}

	&:hover {
		border-color: #133e87;
	}
`;

export const MessageStyleTitle = styled.div`
	font-weight: 500;
	font-size: 0.875rem;
	color: #1a1a1a;
	margin-bottom: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	@media (min-width: 1440px) {
		font-size: 0.875rem;
		margin-bottom: 0.4rem;
		gap: 0.4rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
		margin-bottom: 0.35rem;
		gap: 0.35rem;
	}
`;

export const CheckIcon = styled.div<{ $visible: boolean }>`
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	background-color: #133e87;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ $visible }) => ($visible ? 1 : 0)};
	transition: opacity 0.2s ease;

	@media (min-width: 1440px) {
		width: 0.8rem;
		height: 0.8rem;
	}

	@media (max-width: 1220px) {
		width: 0.875rem;
		height: 0.875rem;
	}

	&::after {
		content: "✓";
		color: white;
		font-size: 0.625rem;
		font-weight: bold;

		@media (min-width: 1440px) {
			font-size: 0.5rem;
		}

		@media (max-width: 1220px) {
			font-size: 0.4375rem;
		}
	}
`;

export const MessageStyleDescription = styled.div`
	font-size: 0.75rem;
	color: #6b7280;
	margin-bottom: 0.5rem;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
		margin-bottom: 0.4rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
		margin-bottom: 0.35rem;
	}
`;

export const MiniChatPreview = styled.div`
	background-color: #f8fafc;
	border-radius: 0.375rem;
	padding: 0.5rem;

	@media (min-width: 1440px) {
		border-radius: 0.3rem;
		padding: 0.4rem;
	}

	@media (max-width: 1220px) {
		border-radius: 0.2625rem;
		padding: 0.35rem;
	}
`;

export const MiniChatMessage = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	margin-bottom: 0.375rem;

	@media (min-width: 1440px) {
		gap: 0.4rem;
		margin-bottom: 0.3rem;
	}

	@media (max-width: 1220px) {
		gap: 0.35rem;
		margin-bottom: 0.2625rem;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const MiniUserAvatar = styled.div`
	width: 1.25rem;
	height: 1.25rem;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 0.625rem;
	font-weight: 500;

	@media (min-width: 1440px) {
		width: 1rem;
		height: 1rem;
		font-size: 0.5rem;
	}

	@media (max-width: 1220px) {
		width: 0.875rem;
		height: 0.875rem;
		font-size: 0.4375rem;
	}
`;

export const MiniMessageContent = styled.div`
	flex: 1;
`;

export const MiniMessageBubble = styled.div`
	background-color: #133e87;
	color: white;
	padding: 0.25rem 0.5rem;
	border-radius: 0.75rem;
	font-size: 0.6875rem;
	display: inline-block;
	max-width: 100%;
	word-wrap: break-word;

	@media (min-width: 1440px) {
		padding: 0.2rem 0.4rem;
		border-radius: 0.6rem;
		font-size: 0.55rem;
	}

	@media (max-width: 1220px) {
		padding: 0.175rem 0.35rem;
		border-radius: 0.525rem;
		font-size: 0.48125rem;
	}
`;

export const MiniMessageText = styled.div`
	font-size: 0.6875rem;
	color: #374151;

	@media (min-width: 1440px) {
		font-size: 0.55rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.48125rem;
	}
`;

export const SettingItem = styled.div<{ $noBorder?: boolean }>`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	border: ${({ $noBorder }) => ($noBorder ? "none" : "1px solid #AAAAAA")};
	border-radius: 0.5rem;
	padding: 1rem;

	@media (min-width: 1440px) {
		border-radius: 0.4rem;
		padding: 0.8rem;
	}

	@media (max-width: 1220px) {
		border-radius: 0.35rem;
		padding: 0.875rem;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const MessageDisplayOptions = styled.div`
	margin-top: 0.75rem;
	margin-bottom: 1rem;

	@media (min-width: 1440px) {
		margin-top: 0.6rem;
		margin-bottom: 0.8rem;
	}

	@media (max-width: 1220px) {
		margin-top: 0.525rem;
		margin-bottom: 0.875rem;
	}
`;

export const MessageDisplayOption = styled.div<{ $selected: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	padding: 0.75rem;
	border: 2px solid ${({ $selected }) => ($selected ? "#133E87" : "#e5e7eb")};
	border-radius: 0.5rem;
	cursor: pointer;
	margin-bottom: 0.5rem;
	transition: all 0.2s ease;

	@media (min-width: 1440px) {
		gap: 0.6rem;
		padding: 0.6rem;
		border-radius: 0.4rem;
		margin-bottom: 0.4rem;
	}

	@media (max-width: 1220px) {
		gap: 0.525rem;
		padding: 0.525rem;
		border-radius: 0.35rem;
		margin-bottom: 0.35rem;
	}

	&:last-child {
		margin-bottom: 0;
	}

	&:hover {
		border-color: ${({ $selected }) => ($selected ? "#133E87" : "#d1d5db")};
	}

	> span {
		font-size: 0.875rem;
		color: #374151;
		line-height: 1.4;

		@media (min-width: 1440px) {
			font-size: 0.875rem;
		}

		@media (max-width: 1220px) {
			font-size: 0.75rem;
		}
	}
`;

export const MessageDisplayRadio = styled.div<{ $selected: boolean }>`
	width: 1.25rem;
	height: 1.25rem;
	border: 2px solid ${({ $selected }) => ($selected ? "#133E87" : "#d1d5db")};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 0.125rem;
	background-color: ${({ $selected }) =>
		$selected ? "#133E87" : "transparent"};

	@media (min-width: 1440px) {
		width: 1rem;
		height: 1rem;
		margin-top: 0.1rem;
	}

	@media (max-width: 1220px) {
		width: 0.875rem;
		height: 0.875rem;
		margin-top: 0.0875rem;
	}

	> span {
		color: white;
		font-size: 0.75rem;
		font-weight: bold;

		@media (min-width: 1440px) {
			font-size: 0.6rem;
		}

		@media (max-width: 1220px) {
			font-size: 0.525rem;
		}
	}
`;

export const ClickableChatPreview = styled.div<{ $selected: boolean }>`
	position: relative;
	margin-bottom: 0.625rem;
	padding: 0.75rem;
	background-color: #fff;
	border-radius: 0.5rem;
	border: ${({ $selected }) =>
		$selected ? "2px solid #608BC1" : "1px solid #e5e7eb"};
	cursor: pointer;
	transition: all 0.2s ease;

	@media (min-width: 1440px) {
		margin-bottom: 0.5rem;
		padding: 0.6rem;
		border-radius: 0.4rem;
	}

	@media (max-width: 1220px) {
		margin-bottom: 0.4375rem;
		padding: 0.525rem;
		border-radius: 0.35rem;
	}

	&:hover {
		border-color: #608bc1;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const SelectionTick = styled.div<{ $visible: boolean }>`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	background-color: #608bc1;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ $visible }) => ($visible ? 1 : 0)};
	transition: opacity 0.2s ease;

	@media (min-width: 1440px) {
		top: 0.4rem;
		right: 0.4rem;
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 1220px) {
		top: 0.35rem;
		right: 0.35rem;
		width: 0.875rem;
		height: 0.875rem;
	}

	&::after {
		content: "✓";
		color: white;
		font-size: 0.75rem;
		font-weight: bold;

		@media (min-width: 1440px) {
			font-size: 0.6rem;
		}

		@media (max-width: 1220px) {
			font-size: 0.525rem;
		}
	}
`;

//Account Form
export const FormContainer = styled.div`
	background: white;
	border-radius: 0.5rem;
	overflow: hidden;
	border: 1px solid #aaaaaa;

	@media (min-width: 1440px) {
		border-radius: 0.4rem;
	}

	@media (max-width: 1220px) {
		border-radius: 0.35rem;
	}
`;

export const ProfileHeader = styled.div`
	background: linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%);
	padding: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media (min-width: 1440px) {
		padding: 1.2rem;
	}

	@media (max-width: 1220px) {
		padding: 1.05rem;
	}
`;

export const ProfileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;

	@media (min-width: 1440px) {
		gap: 0.8rem;
	}

	@media (max-width: 1220px) {
		gap: 0.875rem;
	}
`;

export const Avatar = styled.div`
	width: 4rem;
	height: 4rem;
	background-color: #133e87;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.5rem;
	font-weight: 600;
	position: relative;
	cursor: pointer;
	overflow: hidden;

	@media (max-width: 1220px) {
		width: 2.8rem;
		height: 2.8rem;
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 3rem;
		height: 3rem;
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		width: 3.2rem;
		height: 3.2rem;
		font-size: 18px;
	}
`;

export const AvatarOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.2s ease;
	color: white;
	font-size: 10px;
	font-weight: 500;
	gap: 2px;

	${Avatar}:hover & {
		opacity: 1;
	}

	@media (max-width: 1220px) {
		font-size: 8px;
		gap: 1px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 9px;
		gap: 1.5px;
	}

	@media (min-width: 1920px) {
		font-size: 11px;
		gap: 2px;
	}
`;

export const AvatarUploadInput = styled.input`
	display: none;
`;

export const ProfileDetails = styled.div`
	display: flex;
	flex-direction: column;
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const ProfileName = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const ProfileEmail = styled.p`
	font-size: 14px;
	color: #666666;
	margin: 0;
	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		font-size: 12.5px;
		padding: 0.4375rem 0.875rem;
		margin-left: 2.45rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
		padding: 0.5rem 1rem;
		margin-left: 2.8rem;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 0.4375rem 0.875rem;
		margin-left: 2.45rem;
	}

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
	@media (min-width: 1440px) {
		padding: 1.2rem;
	}

	@media (max-width: 1220px) {
		padding: 1.05rem;
	}
`;

export const FormRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 20px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}

	@media (min-width: 1440px) {
		gap: 0.8rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 1220px) {
		gap: 0.875rem;
		margin-bottom: 0.875rem;
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;

	@media (min-width: 1440px) {
		font-size: 0.875rem;
		margin-bottom: 0.3rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
		margin-bottom: 0.2625rem;
	}
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
	margin-bottom: 6px;

	@media (max-width: 1220px) {
		font-size: 12.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
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

	@media (max-width: 1220px) {
		font-size: 11.5px;
		padding: 8px 10px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12.5px;
		padding: 8px 12px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
	}

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

	@media (min-width: 1440px) {
		margin-top: 1.2rem;
		padding-top: 1rem;
	}

	@media (max-width: 1220px) {
		margin-top: 1.05rem;
		padding-top: 0.875rem;
	}
`;

export const EmailSectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 16px 0;

	@media (min-width: 1440px) {
		font-size: 0.8rem;
		margin: 0 0 0.8rem 0;
	}

	@media (max-width: 1220px) {
		font-size: 0.875rem;
		margin: 0 0 0.7rem 0;
	}
`;

export const EmailItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;

	@media (min-width: 1440px) {
		gap: 0.6rem;
	}

	@media (max-width: 1220px) {
		gap: 0.525rem;
	}
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

	@media (min-width: 1440px) {
		width: 2.2rem;
		height: 2.2rem;
		font-size: 0.8rem;
	}

	@media (max-width: 1220px) {
		width: 1.925rem;
		height: 1.925rem;
		font-size: 0.875rem;
	}
`;

export const EmailDetails = styled.div`
	flex: 1;
	@media (min-width: 1440px) {
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}
`;

export const EmailAddress = styled.div`
	font-size: 14px;
	color: #666666;
	font-weight: 500;
	@media (min-width: 1440px) {
		font-size: 0.875rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}
`;

export const EmailTime = styled.div`
	font-size: 12px;
	color: #666666;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
	}
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

	@media (max-width: 1220px) {
		font-size: 12.5px;
		padding: 0.4375rem 0.875rem;
		margin-left: 2.45rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
		padding: 0.5rem 1rem;
		margin-left: 2.8rem;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		padding: 0.4375rem 0.875rem;
		margin-left: 2.45rem;
	}

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
	padding: 10px 12px;
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
	background-position: right 0.75rem center;
	background-size: 0.875rem;
	padding-right: 2.25rem;

	@media (min-width: 1440px) {
		padding: 0.5rem 0.6rem;
		border-radius: 0.3rem;
		font-size: 0.875rem;
		background-position: right 0.6rem center;
		background-size: 0.875rem;
		padding-right: 1.8rem;
	}

	@media (max-width: 1220px) {
		padding: 0.4375rem 0.525rem;
		border-radius: 0.2625rem;
		font-size: 0.75rem;
		background-position: right 0.525rem center;
		background-size: 0.75rem;
		padding-right: 1.575rem;
	}

	&:focus {
		outline: none;
	}
`;
