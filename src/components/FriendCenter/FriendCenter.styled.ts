import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	background: #f8f9fa;
	min-height: 100vh;
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

export const Header = styled.div`
	background: white;
	border-bottom: 1px solid #e1e5e9;
	padding: 0;
	background: #e2e8f0;
`;

export const NavTabs = styled.div`
	display: flex;
	align-items: center;
	padding: 12px 20px;
`;

export const NavTabTitle = styled.div`
	display: flex;
	flex-direction: row;
	gap: 6px;
	border: none;
	margin-right: 16px;
	font-size: 16px;
	font-weight: 600;
	color: #1e2a3b;
	align-items: center;
`;

export const NavTab = styled.button<{ active?: boolean }>`
	background: none;
	border: none;
	padding: 4px 20px;
	margin-right: 16px;
	font-size: 14px;
	border: 1px solid #cbd4e1;
	cursor: pointer;
	border-radius: 6px;
	transition: all 0.2s ease;
	font-size: 16px;
	font-weight: 600;
	color: #1e2a3b;
	background: ${(props) => (props.active ? "#ffffff" : "transparent")};
	border: ${(props) =>
		props.active ? "1px solid #ffffff" : "1px solid #CBD4E1"};

	&:focus {
		outline: none;
		box-shadow: none;
	}

	&:hover {
		border: none;
	}
`;

export const Content = styled.div`
	padding: 24px 20px;
`;

export const Title = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
`;

export const Subtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin: 0 0 20px 0;
`;

export const SearchContainer = styled.div`
	display: flex;
	align-items: center;
	background: white;
	border: 1px solid #cbd4e1;
	border-radius: 8px;
	padding: 12px 16px;
	margin-bottom: 16px;
	gap: 12px;
`;

export const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	color: #333;
	background: transparent;

	&::placeholder {
		color: #999;
	}
`;

export const SendButton = styled.button`
	background: #133e87;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover:not(:disabled) {
		background: #1565c0;
	}

	&:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
`;

export const ResultsList = styled.div`
	background: white;
	border-radius: 8px;
	overflow: hidden;
	border: 1px solid #e1e5e9;
	width: 95%;
	margin: 0 auto;
`;

export const ResultItem = styled.div<{ selected?: boolean }>`
	display: flex;
	align-items: center;
	padding: 12px 16px;
	border-bottom: 1px solid #f0f0f0;
	cursor: pointer;
	transition: background-color 0.2s ease;
	background-color: ${(props) => (props.selected ? "#F1F4F9" : "white")};
	border-left: ${(props) =>
		props.selected ? "3px solid #133E87" : "3px solid transparent"};

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: ${(props) => (props.selected ? "#e3f2fd" : "#f8f9fa")};
		border-left: 3px solid #133e87;
	}
`;

export const Avatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 12px;
	background: #e0e0e0;
`;

export const UserInfo = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

export const UserName = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #333;
	margin-bottom: 2px;
`;

export const UserHandle = styled.div`
	font-size: 13px;
	color: #666;
`;

export const MutualFriends = styled.div`
	font-size: 13px;
	color: #999;
`;

export const SectionHeader = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 16px;
`;

export const ActionButton = styled.button<{
	variant?: "accept" | "decline" | "unfriend";
}>`
	background: ${(props) =>
		props.variant === "accept"
			? "#00885D"
			: props.variant === "decline" || props.variant === "unfriend"
				? "#ef4444"
				: "#133E87"};
	color: white;
	border: none;
	padding: 6px 12px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;
	margin-left: 8px;

	&:hover {
		background: ${(props) =>
			props.variant === "accept"
				? "#16a34a"
				: props.variant === "decline" || props.variant === "unfriend"
					? "#dc2626"
					: "#1565c0"};
	}

	&:first-child {
		margin-left: 0;
	}
`;

export const ActionButtons = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const UnfriendButton = styled.button`
	background: none;
	border: none;
	color: #ef4444;
	font-size: 20px;
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #fef2f2;
	}
`;

export const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const ModalContent = styled.div`
	background: white;
	border-radius: 12px;
	padding: 40px 32px;
	text-align: center;
	min-width: 500px;
	margin: 20px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`;

export const ModalTitle = styled.h3`
	font-size: 30px;
	font-weight: 600;
	color: #00885d;
	margin: 0 0 20px 0;
`;

export const SendImg = styled.img`
	width: 120px;
	height: 120px;
	margin: 10px auto;
`;

export const ModalMessage = styled.p`
	font-size: 16px;
	color: #1a1a1a;
	margin: 0 0 32px 0;
	line-height: 1.5;
	font-weight: 300;
`;

export const ModalButton = styled.button`
	background: #00885d;
	color: white;
	border: none;
	padding: 12px 40px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	width: 100%;
	transition: background-color 0.2s ease;

	&:hover {
		background: #16a34a;
	}
`;
