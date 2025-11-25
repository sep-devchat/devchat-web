import styled from "styled-components";

export const PageContainer = styled.div`
	padding: 32px;
	display: flex;
	flex-direction: column;
	gap: 24px;
	min-height: 100vh;
`;

export const Panel = styled.div`
	background: rgba(255, 255, 255, 0.9);
	border-radius: 24px;
	padding: 24px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
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
	font-size: 28px;
	font-weight: 700;
	color: #0f172a;
`;

export const Subtitle = styled.p`
	margin: 0;
	font-size: 15px;
	color: #475569;
`;

export const Toolbar = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	align-items: center;
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

export const Select = styled.select`
	padding: 10px 14px;
	border-radius: 10px;
	border: 1px solid #dbeafe;
	background: rgba(248, 250, 252, 0.95);
	font-size: 14px;
	color: #0f172a;
	appearance: none;
`;

export const RefreshButton = styled.button`
	border: none;
	background: rgba(15, 23, 42, 0.06);
	border-radius: 10px;
	padding: 10px 12px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #0f172a;
`;

export const TableCard = styled(Panel)`
	padding: 0;
	overflow: hidden;
`;

export const TableHeader = styled.div`
	padding: 20px 24px;
	border-bottom: 1px solid rgba(15, 23, 42, 0.06);
	background: rgba(248, 250, 252, 0.9);
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const TableTitle = styled.h2`
	margin: 0;
	font-size: 20px;
	color: #0f172a;
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
	background: transparent;
`;

export const TableHead = styled.thead`
	background: rgba(15, 23, 42, 0.02);
	text-transform: uppercase;
	font-size: 12px;
	color: #64748b;
`;

export const Th = styled.th<{ $align?: "left" | "center" | "right" }>`
	text-align: ${(props) => props.$align ?? "left"};
	padding: 14px 24px;
	font-weight: 600;
	letter-spacing: 0.04em;
	border-bottom: 1px solid rgba(15, 23, 42, 0.05);
`;

export const Tr = styled.tr`
	&:not(:last-child) td {
		border-bottom: 1px solid rgba(15, 23, 42, 0.05);
	}
`;

export const Td = styled.td<{ $align?: "left" | "center" | "right" }>`
	padding: 18px 24px;
	font-size: 14px;
	color: #0f172a;
	vertical-align: top;
	text-align: ${(props) => props.$align ?? "left"};
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

export const StatusBadge = styled.span<{ $variant: "active" | "removed" }>`
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

export const Actions = styled.div`
	display: flex;
	gap: 8px;
`;

export const IconButton = styled.button<{ $variant?: "ghost" | "danger" }>`
	border: none;
	background: ${(props) =>
		props.$variant === "danger"
			? "rgba(239, 68, 68, 0.12)"
			: "rgba(15, 23, 42, 0.08)"};
	color: ${(props) => (props.$variant === "danger" ? "#b91c1c" : "#0f172a")};
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

export const PaginationBar = styled.div`
	padding: 16px 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 12px;
	background: rgba(248, 250, 252, 0.9);
	border-top: 1px solid rgba(15, 23, 42, 0.06);
`;

export const PaginationInfo = styled.span`
	font-size: 13px;
	color: #475569;
`;

export const PaginationControls = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const PaginationButton = styled.button`
	border: none;
	background: rgba(15, 23, 42, 0.08);
	color: #0f172a;
	border-radius: 999px;
	padding: 6px 16px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
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
	max-width: 520px;
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

export const TextArea = styled.textarea`
	border-radius: 12px;
	border: 1px solid #dbeafe;
	padding: 12px 14px;
	font-size: 14px;
	background: rgba(248, 250, 252, 0.95);
	min-height: 120px;
	resize: vertical;
`;

export const ModalActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
`;

export const ErrorText = styled.span`
	font-size: 12px;
	color: #dc2626;
`;
