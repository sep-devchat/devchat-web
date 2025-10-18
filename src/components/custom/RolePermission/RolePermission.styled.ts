import styled from "styled-components";
import { darken } from "polished";

export const Wrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 0;
	background-color: #f8f9fb;
	border-radius: 12px;
	margin: 0 auto;
	width: 100%;
`;

export const HeaderWrapper = styled.div`
	padding: 24px 24px 0 24px;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	height: 55px;
`;

export const Title = styled.h1`
	font-size: 20px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
`;

export const Subtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin: 0;
`;

export const AddButton = styled.button`
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	padding: 10px 16px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: background 0.2s;
	&:hover {
		background: #1952b3;
	}
	&:active {
		background: #1e40af;
	}
`;

export const ScrollArea = styled.div`
	flex: 1;
	overflow-y: scroll;
	padding: 0 24px 24px 24px;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const RoleSection = styled.div`
	background-color: white;
	border-radius: 12px;
	margin-bottom: 20px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	transition: box-shadow 0.2s ease;
	&:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
	}
`;

export const RoleCard = styled.div<{ backgroundColor: string }>`
	background-color: ${(props) => props.backgroundColor};
	padding: 16px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const RoleHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

export const RoleContent = styled.div`
	flex: 1;
	cursor: pointer;
	display: flex;
	flex-direction: column;
`;

export const RoleNameRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const Arrow = styled.span<{ expanded: boolean }>`
	font-size: 12px;
	transition: transform 0.2s;
	display: inline-block;
	transform: ${({ expanded }) => (expanded ? "rotate(90deg)" : "rotate(0deg)")};
	color: #666;
	margin-left: 8px;
	margin-top: 4px;
	align-self: flex-start;
`;

export const RoleName = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const RoleDescription = styled.div`
	font-size: 14px;
	color: #666;
	margin-top: 4px;
`;

export const ActionButtons = styled.div`
	display: flex;
	gap: 8px;
	margin-left: 12px;
`;

export const EditButton = styled.button`
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	color: #3b82f6;
	transition: background-color 0.2s ease;
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
`;

export const DeleteButton = styled.button`
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	color: #d83232;
	transition: background-color 0.2s ease;
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
`;

export const PermissionsContainer = styled.div`
	padding: 20px;
	animation: slideDown 0.2s ease-out;

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

export const PermissionsTitle = styled.div`
	margin-bottom: 12px;
	font-weight: 600;
	color: #333;
`;

export const PermissionsList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const PermissionItem = styled.li`
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #333;
`;

export const PermissionDot = styled.span`
	color: #5b62c9;
	margin-right: 8px;
`;

export const PermissionText = styled.span`
	color: #5b62c9;
	font-weight: 500;
`;

export const IconWrapper = styled.div<{ color: string }>`
	width: 36px;
	height: 36px;
	border-radius: 8px;
	background-color: ${({ color }) => darken(0.1, color)};
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	flex-shrink: 0;
`;

export const RoleNameText = styled.span`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`;
