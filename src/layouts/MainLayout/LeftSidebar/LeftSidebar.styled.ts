import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styled from "styled-components";

export const LeftSidebarContainer = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 10px 0 0 10px;
	background: rgba(255, 255, 255, 0.3);
`;

export const ActionButton = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
`;

export const SearchInput = styled(Input)`
	border-radius: 5px;
	border: 1px solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
`;

export const IconButton = styled(Button)`
	box-shadow: none;
	border: none;
	font-size: 1.25rem;
	padding: 0;
	height: max-content;

	&:hover {
		color: hsl(var(--ring));
	}

	&:focus,
	&:focus-visible {
		outline: none;
	}
`;

// Friend list styles
export const FriendList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0 8px 8px;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const Avatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 9999px;
	display: grid;
	place-items: center;
	background: hsl(var(--primary));
	color: hsl(var(--primary-foreground));
	font-weight: 600;
	font-size: 0.85rem;
	letter-spacing: 0.3px;
	flex: 0 0 auto;
`;

export const FriendName = styled.span`
	flex: 1;
	min-width: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: hsl(var(--foreground));
	font-size: 0.95rem;
`;

export const ChannelIcon = styled(Avatar)`
	background: hsl(var(--muted));
	color: hsl(var(--foreground));
	font-weight: 700;
`;

export const RemoveButton = styled(Button)`
	position: absolute;
	right: 8px;
	top: 50%;
	transform: translateY(-50%);
	opacity: 0;
	pointer-events: none;
	transition:
		opacity 140ms ease,
		background-color 120ms ease,
		color 120ms ease;
	width: 28px;
	height: 28px;
	padding: 0;
	min-width: 0;
	border-radius: 6px;
	box-shadow: none;

	&:hover {
		border: none;
	}

	&:focus,
	&:focus-visible {
		outline: none;
	}
`;

export const FriendItem = styled.li`
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 36px 6px 8px; /* leave room for the remove button */
	border-radius: 8px;
	cursor: pointer;

	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	&:hover ${RemoveButton}, &:focus-within ${RemoveButton} {
		opacity: 1;
		pointer-events: auto;
	}
`;
