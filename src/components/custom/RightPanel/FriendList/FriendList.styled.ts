import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 350px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey30};
	border-radius: 0px 10px 10px 0px;
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-right-radius: 10px;
`;

export const MemberContent = styled.div`
	flex: 1;
	padding: 16px;
	overflow: visible;
`;

export const MemberSection = styled.div`
	margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
`;

export const SectionTitle = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: ${theme.color.grey90 || "#374151"};
	letter-spacing: 0.5px;
`;

export const MemberCount = styled.span`
	background: ${theme.color.grey90 || "#9CA3AF"};
	color: white;
	border-radius: 12px;
	padding: 2px 8px;
	font-size: 12px;
	font-weight: 500;
	min-width: 20px;
	text-align: center;
`;

export const MembersList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-right-radius: 10px;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const CPHash = styled.div`
	width: 36px;
	height: 36px;
	border-radius: 8px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: ${theme.color.grey90 || "#1f2937"};
	letter-spacing: -0.3px;
`;

export const CPHeaderIcon = styled.button`
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background: transparent;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${theme.color.grey40 || "rgba(0,0,0,0.05)"};
		color: ${theme.color.grey90 || "#374151"};
	}

	&:active {
		transform: scale(0.95);
	}

	&:focus {
		outline: none;
	}
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
`;

export const SearchIconWrapper = styled.div`
	position: absolute;
	left: -3px;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	pointer-events: none;
	display: flex;
	align-items: center;
`;

export const Input = styled.input<{ error?: boolean }>`
	width: 100%;
	padding: 12px 14px;
	border: 1px solid ${(props) => (props.error ? "#D83232" : "#e5e7eb")};
	border-radius: 8px;
	font-size: 14px;
	color: #374151;
	transition: all 0.2s;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.error ? "#D83232" : "#133e87")};
		box-shadow: 0 0 0 3px
			${(props) =>
				props.error ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const SearchInput = styled(Input)<{ prefix?: React.ReactNode }>`
	width: 280px;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	border: 1px solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
	font-size: 0.875rem;
	color: #1f2937;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: rgba(25, 82, 179, 0.4);
		background: rgba(32, 102, 223, 0.12);
		box-shadow: 0 0 0 3px rgba(32, 102, 223, 0.1);
	}

	&::placeholder {
		color: #9ca3af;
		font-size: 0.875rem;
	}

	&:hover:not(:focus) {
		border-color: rgba(25, 82, 179, 0.3);
	}
`;
