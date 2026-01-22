import styled from "styled-components";

export const PageContainer = styled.div`
	padding: 0 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
	min-height: 100vh;
`;

export const Panel = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
`;

export const TitleBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const Title = styled.h1`
	margin: 0;
	font-size: 26px;
	font-weight: 700;
	color: #0f172a;
`;

export const Subtitle = styled.p`
	margin: 0;
	font-size: 14px;
	color: #475569;
`;

export const TableCard = styled(Panel)`
	padding: 0;
	overflow: hidden;
	border-radius: 12px;
`;

export const SearchGroup = styled.div`
	flex: 1;
	min-width: 220px;
	position: relative;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 12px 14px 12px 40px;
	border: 1px solid #dbeafe;
	border-radius: 12px;
	background: rgba(248, 250, 252, 0.8);
	font-size: 14px;
	color: #0f172a;

	&::placeholder {
		color: #94a3b8;
	}
`;

export const SearchIcon = styled.span`
	position: absolute;
	top: 50%;
	left: 14px;
	transform: translateY(-50%);
	color: #94a3b8;
	display: flex;
`;

export const TableHeader = styled.div`
	padding: 24px;
	border-bottom: 1px solid rgba(15, 23, 42, 0.06);
	background: white;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const TableTitle = styled.h2`
	font-size: 22px;
	color: #27364b;
	font-weight: 600;
`;

export const TableSubtitle = styled.p`
	margin: 0;
	font-size: 13px;
	color: #475569;
`;

export const TableWrapper = styled.div`
	overflow-x: auto;
`;

export const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
`;

export const TableHead = styled.thead`
	background: #f8fafc;
	border-bottom: 2px solid #e2e8f0;
`;

export const Th = styled.th`
	text-align: center;
	padding: 12px 16px;
	font-size: 12px;
	font-weight: 600;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.5px;

	&:last-child {
		text-align: center;
		width: 200px;
	}
`;

export const Tr = styled.tr`
	border-bottom: 1px solid #e2e8f0;
	transition: background-color 0.15s ease;
	text-align: center;

	&:hover {
		background-color: #f8fafc;
	}
`;

export const Td = styled.td`
	padding: 16px;
	vertical-align: middle;
	text-align: center;

	&:last-child {
		text-align: right;
	}
`;

export const Actions = styled.div`
	display: inline-flex;
	gap: 8px;
	align-items: center;
	justify-content: flex-end;
`;

export const IconButton = styled.button<{
	$variant?: "ghost" | "danger" | "success";
}>`
	border: none;
	background: ${(props) =>
		props.$variant === "danger"
			? "rgba(239, 68, 68, 0.12)"
			: props.$variant === "success"
				? "rgba(34, 197, 94, 0.12)"
				: "rgba(15, 23, 42, 0.08)"};
	color: ${(props) =>
		props.$variant === "danger"
			? "#b91c1c"
			: props.$variant === "success"
				? "#166534"
				: "#0f172a"};
	border-radius: 10px;
	padding: 8px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: opacity 0.2s ease;

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
`;

export const EmptyState = styled.div`
	padding: 48px 24px;
	text-align: center;
	color: #64748b;
	font-size: 15px;
`;

export const ErrorState = styled(EmptyState)`
	color: #b91c1c;
`;

export const LoadingState = styled(EmptyState)`
	color: #0f172a;
`;

export const StatusBadge = styled.span<{ $variant: "active" | "inactive" }>`
	padding: 4px 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	color: ${(props) => (props.$variant === "active" ? "#166534" : "#9ca3af")};
	background: ${(props) =>
		props.$variant === "active"
			? "rgba(34, 197, 94, 0.15)"
			: "rgba(148, 163, 184, 0.2)"};
`;

export const NameCell = styled.div`
	font-weight: 600;
	color: #0f172a;
	margin-bottom: 6px;
`;

export const DescriptionText = styled.p`
	margin: 6px 0 0;
	color: #475569;
	font-size: 13px;
	line-height: 1.5;
	max-width: 720px;
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(15, 23, 42, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 24px;
`;

export const ModalCard = styled.div`
	width: 100%;
	max-width: 540px;
	background: #fff;
	border-radius: 20px;
	padding: 24px;
	box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const ModalTitle = styled.h3`
	margin: 0;
	font-size: 22px;
	color: #0f172a;
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const FieldsRow = styled.div`
	display: flex;
	gap: 12px;
	flex-wrap: wrap;

	${Field} {
		flex: 1;
		min-width: 160px;
	}
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 600;
	color: #0f172a;
`;

export const Input = styled.input`
	border-radius: 12px;
	border: 1px solid #dbeafe;
	padding: 12px 14px;
	font-size: 14px;
	background: rgba(248, 250, 252, 0.95);
`;

export const CheckboxRow = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 2px;
`;

export const CheckboxLabel = styled.label`
	font-size: 14px;
	font-weight: 600;
	color: #0f172a;
	cursor: pointer;
`;

export const ModalActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
`;
