import styled from "styled-components";

export const GroupSidebarContainer = styled.div`
	position: relative;
	width: 65px;
	background: rgba(255, 255, 255, 0.45);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px 0;
	border-radius: 10px;
`;

export const GroupList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	align-items: center;
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const GroupItem = styled.li`
	width: 100%;
	display: flex;
	justify-content: center;
`;

export const GroupButton = styled.button<{
	$color?: string;
	$active?: boolean;
}>`
	position: relative;
	width: 40px;
	height: 40px;
	border-radius: 200px;
	display: grid;
	place-items: center;
	border: 1px solid rgba(0, 0, 0, 0.06);
	background-color: ${({ $color }) => $color ?? "hsl(var(--muted, 0 0% 96%))"};
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.4px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	cursor: pointer;
	transition:
		transform 120ms ease,
		box-shadow 160ms ease,
		border-color 160ms ease,
		border-radius 200ms ease,
		background-color 160ms ease,
		color 160ms ease;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
		border-color: rgba(0, 0, 0, 0.12);
		border-radius: 12px; /* morph circle -> rounded square */
	}

	&[aria-selected="true"] {
		outline: 2px solid rgba(59, 130, 246, 0.6);
		outline-offset: 2px;
	}
`;

export const UnreadBadge = styled.span`
	position: absolute;
	top: -2px;
	right: -2px;
	min-width: 18px;
	height: 18px;
	padding: 0 5px;
	border-radius: 9999px;
	background: hsl(var(--destructive, 0 84% 60%));
	color: white;
	font-size: 11px;
	font-weight: 700;
	line-height: 18px;
	text-align: center;
	box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
`;

// A variant of GroupButton used for the "Create group" action
export const CreateGroupButton = styled(GroupButton)`
	background-color: hsl(var(--secondary));
	color: hsl(var(--foreground));
	border-style: dashed;
	border-color: hsl(var(--border));
	box-shadow: none;
	transition:
		transform 120ms ease,
		box-shadow 160ms ease,
		border-color 160ms ease,
		border-radius 200ms ease,
		background-color 160ms ease,
		color 160ms ease;

	&:hover {
		background-color: hsl(var(--secondary));
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
	}
`;
