import styled from "styled-components";

export const ItemContainer = styled.div`
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	padding: 1rem;
	border-top: none;
`;

export const UserInfoHeader = styled.div`
	display: flex;
	align-items: start;
	gap: 0.75rem;
	margin-bottom: 0.75rem;
`;

export const ItemCheckbox = styled.input`
	width: 1rem;
	height: 1rem;
	margin-top: 0.25rem;
	border-radius: 0.25rem;
	border: 1px solid #d1d5db;
	color: #133e87;
	cursor: pointer;

	&:focus {
		ring: 2px;
		ring-color: #3b82f6;
	}
`;

export const Avatar = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
`;

export const UserInfoContainer = styled.div`
	flex: 1;
`;

export const UserInfoRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const UserDetails = styled.div``;

export const Username = styled.p`
	font-weight: 600;
	color: #27364b;
`;

export const GroupName = styled.p`
	font-size: 0.875rem;
	color: #666666;
`;

export const Time = styled.p`
	font-size: 0.75rem;
	color: #666666;
`;

export const TagsContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

interface TagProps {
	$color: "red" | "blue" | "green" | "yellow" | "purple" | "pink" | "orange";
}

export const Tag = styled.span<TagProps>`
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;

	${({ $color }) => {
		const colors = {
			red: "background-color: #D8323233; color: #D83232;",
			blue: "background-color: #608BC133; color: #608BC1;",
			green: "background-color: #1CCA9333; color: #1CCA93;",
			yellow: "background-color: #EFB00833; color: #EFB008;",
			purple: "background-color: #B54BB333; color: #B54BB3;",
			pink: "background-color: #fce7f3; color: #9f1239;",
			orange: "background-color: #ffedd5; color: #9a3412;",
		};
		return colors[$color];
	}}
`;

export const ReportType = styled.span`
	font-size: 0.875rem;
	color: #6b7280;
`;

export const ContentSection = styled.div`
	margin-left: 4rem;
	background-color: #f6f8fc;
	padding: 10px;
	border-left: 4px solid #d83232;
	border-radius: 8px;
	margin-bottom: 10px;
`;

export const ContentBorder = styled.div``;

export const Message = styled.p`
	color: #1a1a1a;
	font-weight: 200;
`;

export const CodeBlock = styled.div`
	background-color: #1f2937;
	color: #f3f4f6;
	padding: 0.75rem;
	border-radius: 0.25rem;
	font-family: monospace;
	font-size: 0.875rem;
	overflow-x: auto;
`;

interface AdminAnswerBoxProps {
	$type?: "deleted" | "approved" | "warning" | "escalated";
}

export const AdminAnswerBox = styled.div<AdminAnswerBoxProps>`
	margin-left: 4rem;
	margin-bottom: 0.75rem;
	padding: 0.75rem;
	border-radius: 0.25rem;
	${({ $type }) => {
		if ($type === "deleted")
			return "background-color: #D8323233; border-left: 4px solid #D83232;";
		if ($type === "approved")
			return "background-color: #1CCA9333; border-left: 4px solid #1CCA93;";
		if ($type === "warning")
			return "background-color: #EFB00833; border-left: 4px solid #EFB008;";
		if ($type === "escalated")
			return "background-color: #B54BB333; border-left: 4px solid #B54BB3;";
		return "background-color: #f9fafb; border-left: 4px solid #e5e7eb;";
	}}
`;

export const AdminAnswerContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

export const AdminAnswerText = styled.div`
	flex: 1;
`;

export const AdminTitle = styled.div<AdminAnswerBoxProps>`
	font-weight: 600;
	margin-bottom: 0.25rem;
	${({ $type }) => {
		if ($type === "deleted") return "color: #D83232;";
		if ($type === "approved") return "color: #1CCA93;";
		if ($type === "warning") return "color: #EFB008;";
		if ($type === "escalated") return "color: #B54BB3;";
		return "color: #374151;";
	}}
`;

export const AdminDetails = styled.div<AdminAnswerBoxProps>`
	font-size: 0.875rem;
	${({ $type }) => {
		if ($type === "deleted") return "color: #D83232;";
		if ($type === "approved") return "color: #1CCA93;";
		if ($type === "warning") return "color: #EFB008;";
		if ($type === "escalated") return "color: #B54BB3;";
		return "color: #6b7280;";
	}}

	span {
		font-weight: 500;
	}
`;

export const ShowFullWarningLink = styled.a`
	color: #2563eb;
	text-decoration: none;
	font-size: 0.875rem;
	margin-top: 0.5rem;
	display: inline-block;

	&:hover {
		text-decoration: underline;
	}
`;

export const ReasonSection = styled.div`
	margin-left: 4rem;
	margin-bottom: 0.75rem;
`;

export const ReasonText = styled.p`
	font-size: 0.875rem;
	color: #4b5563;

	& > span {
		font-weight: 500;
	}
`;

export const ActionsRow = styled.div`
	margin-left: 4rem;
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
`;

interface ActionButtonStyledProps {
	$variant: "primary" | "danger" | "warning" | "info" | "success" | "other";
}

export const ActionButton = styled.button<ActionButtonStyledProps>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-radius: 0.25rem;
	border: 1px solid;
	font-weight: 500;
	font-size: 0.875rem;
	transition: all 0.2s;
	cursor: pointer;

	${({ $variant }) => {
		const variants = {
			primary: `
         background-color: #ffffff;
        color: #133E87;
        border-color: #133E87;
        &:hover { background-color: #133E87; color: white; border-color: #133E87; };
        &:focus { outline: none; }
      `,
			danger: `
        background-color: #D8323233;
        color: #D83232;
        border-color: #D83232;
        &:hover { background-color: #D83232; color: white; border-color: #D83232; };
        &:focus { outline: none; }
      `,
			warning: `
        background-color: #EFB00833;
        color: #EFB008;
        border-color: #EFB008;
        &:hover { background-color: #EFB008; color: white; border-color: #EFB008; };
        &:focus { outline: none; }
      `,
			info: `
       background-color: #608BC133;
        color: #608BC1;
        border-color: #608BC1;
        &:hover { background-color: #608BC1; color: white; border-color: #608BC1; };
        &:focus { outline: none; }
      `,
			success: `
        background-color: #1CCA9333;
        color: #1CCA93;
        border-color: #1CCA93;
        &:hover { background-color: #1CCA93; color: white; border-color: #1CCA93; };
        &:focus { outline: none; }
      `,
			other: `
        background-color: #0C5A411A;
        color: #0C5A41;
        border-color: #0C5A41;
        &:hover { background-color: #0C5A41; color: white; border-color: #0C5A41; };
        &:focus { outline: none; }
      `,
		};
		return variants[$variant];
	}}
`;
