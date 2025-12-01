import styled, { css } from "styled-components";
import { MessageReportType } from "@/services/reportAPI";

const proseReset = css`
	.prose {
		margin: 0;
		max-width: none;
	}

	.prose > :last-child {
		margin-bottom: 0;
	}

	.prose p {
		margin: 0 0 6px;
	}
`;

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
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;

export const TitleBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const Title = styled.h1`
	margin: 0;
	font-size: 30px;
	font-weight: 700;
	color: #0f172a;
`;

export const Subtitle = styled.p`
	margin: 0;
	font-size: 15px;
	color: #475569;
`;

export const ActionGroup = styled.div`
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: flex-end;
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "ghost" }>`
	background: ${(props) =>
		props.$variant === "ghost" ? "transparent" : "#1952B3"};
	color: ${(props) => (props.$variant === "ghost" ? "#1952B3" : "#ffffff")};
	transition: opacity 0.2s ease;

	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.15s ease;
	border: 1px solid transparent;
	white-space: nowrap;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 36px;
	border: 1px solid #1952b3;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const FiltersGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const FilterField = styled.label`
	display: flex;
	flex-direction: column;
	gap: 12px;
	font-size: 14px;
	color: #475569;
`;

export const CategoryButton = styled.button`
	width: 100%;
	border-radius: 12px;
	border: 2px solid
		${(props) =>
			props.className?.includes("has-selection") ? "#3b82f6" : "#e2e8f0"};
	background: ${(props) =>
		props.className?.includes("has-selection")
			? "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)"
			: "#ffffff"};
	padding: 12px 16px;
	font-size: 14px;
	color: #0f172a;
	display: flex;
	align-items: center;
	gap: 12px;
	justify-content: flex-start;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: ${(props) =>
		props.className?.includes("has-selection")
			? "0 2px 8px rgba(59, 130, 246, 0.12)"
			: "0 1px 3px rgba(0, 0, 0, 0.06)"};
	font-weight: 500;
	position: relative;
	overflow: hidden;

	&:hover {
		border-color: ${(props) =>
			props.className?.includes("has-selection") ? "#2563eb" : "#3b82f6"};
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.18);
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}

	> svg {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		color: ${(props) =>
			props.className?.includes("has-selection") ? "#3b82f6" : "#64748b"};
		transition: all 0.2s ease;
	}

	> div {
		flex: 1;
		text-align: left;

		> div:first-child {
			font-weight: 600;
			font-size: 14px;
			color: ${(props) =>
				props.className?.includes("has-selection") ? "#1e40af" : "#0f172a"};
			margin-bottom: 2px;
			line-height: 1.4;
		}
	}

	&:focus {
		outline: none;
	}
`;

export const CategoryStatus = styled.span<{ $selected?: boolean }>`
	font-size: 12px;
	color: ${(props) => (props.$selected ? "#3b82f6" : "#64748b")};
	font-weight: 400;
	line-height: 1.3;
`;

export const FilterTags = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 4px;
	animation: fadeIn 0.3s ease-in-out;

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

export const FilterTag = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	border-radius: 6px;
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	color: #ffffff;
	padding: 4px 10px;
	font-size: 12px;
	font-weight: 500;
	box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
	transition: all 0.2s ease;
	line-height: 1.5;

	&:hover {
		box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
		transform: translateY(-1px);
	}
`;

export const ReporterFilterNotice = styled.div`
	padding: 14px 18px;
	margin-top: -8px;
	border-radius: 16px;
	background: rgba(37, 99, 235, 0.08);
	color: #1d4ed8;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	font-size: 13px;
`;

export const ReporterFilterButton = styled.button`
	border: none;
	background: rgba(255, 255, 255, 0.4);
	color: #1d4ed8;
	font-weight: 600;
	padding: 6px 14px;
	border-radius: 999px;
	cursor: pointer;

	&:focus {
		outline: none;
	}
`;

export const ReporterFilterCode = styled.code`
	background: rgba(15, 23, 42, 0.08);
	padding: 2px 6px;
	border-radius: 6px;
	font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
	font-size: 12px;
	color: #0f172a;
`;

export const RowsControl = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #475569;
`;

export const Select = styled.select`
	border-radius: 12px;
	border: 1px solid #dbeafe;
	background: rgba(248, 250, 252, 0.95);
	padding: 8px 14px;
	font-size: 14px;
	color: #0f172a;
`;

export const TableCard = styled(Panel)`
	padding: 0;
	border-radius: 12px;
	overflow: hidden;
`;

export const TableHeader = styled.div`
	padding: 24px;
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
	background: white;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const TableHeaderRow = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
`;

export const TableTitle = styled.h2`
	font-size: 24px;
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
`;

export const TableHead = styled.thead`
	text-transform: uppercase;
	font-size: 11px;
	letter-spacing: 0.08em;
	color: #94a3b8;
	background: rgba(15, 23, 42, 0.02);
`;

export const Th = styled.th<{ $align?: "left" | "center" | "right" }>`
	text-align: ${(props) => props.$align ?? "left"};
	padding: 14px 24px;
	font-weight: 600;
`;

export const Row = styled.tr`
	&:not(:last-child) td {
		border-bottom: 1px solid rgba(15, 23, 42, 0.06);
	}
`;

export const Td = styled.td<{ $align?: "left" | "center" | "right" }>`
	padding: 20px 24px;
	vertical-align: top;
	text-align: ${(props) => props.$align ?? "left"};
`;

export const ContentCell = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const MetaRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
	color: #475569;
	font-size: 13px;
`;

export const IdTag = styled.span`
	font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
	font-size: 12px;
	color: #94a3b8;
`;

const typeStyles: Record<MessageReportType, { bg: string; color: string }> = {
	[MessageReportType.CHANNEL_MESSAGE]: {
		bg: "rgba(59, 130, 246, 0.16)",
		color: "#1d4ed8",
	},
	[MessageReportType.DIRECT_MESSAGE]: {
		bg: "rgba(16, 185, 129, 0.18)",
		color: "#047857",
	},
	[MessageReportType.THREAD_MESSAGE]: {
		bg: "rgba(147, 51, 234, 0.18)",
		color: "#6d28d9",
	},
};

const fallbackTypeStyle = {
	bg: "rgba(15, 23, 42, 0.08)",
	color: "#0f172a",
};

const resolveTypeStyle = (variant?: MessageReportType) => {
	if (!variant) return fallbackTypeStyle;
	return typeStyles[variant] ?? fallbackTypeStyle;
};

export const TypeBadge = styled.span<{ $variant?: MessageReportType }>`
	padding: 4px 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	background: ${(props) => resolveTypeStyle(props.$variant).bg};
	color: ${(props) => resolveTypeStyle(props.$variant).color};
`;

export const ContentText = styled.div`
	font-size: 15px;
	color: #0f172a;
	font-weight: 600;

	${proseReset};

	.prose {
		font-size: inherit;
		color: inherit;
		font-weight: inherit;
	}
`;

export const LocationText = styled.p`
	margin: 0;
	font-size: 13px;
	color: #64748b;
`;

export const ReporterNote = styled.div`
	font-size: 13px;
	color: #c2410c;
	display: flex;
	flex-direction: column;
	gap: 4px;

	span {
		font-weight: 600;
	}

	${proseReset};

	.prose {
		font-size: inherit;
		color: inherit;
	}
`;

export const CategoriesCell = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
`;

export const CategoryBadge = styled.span`
	padding: 4px 10px;
	border-radius: 10px;
	background: rgba(15, 23, 42, 0.06);
	font-size: 12px;
	color: #0f172a;
`;

export const ReporterName = styled.div`
	font-weight: 600;
	color: #0f172a;
`;

export const ReporterMeta = styled.div`
	font-size: 12px;
	color: #94a3b8;
`;

export const ReporterInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ReporterDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const ReporterAvatar = styled.img<{ $size?: number }>`
	width: ${(props) => props.$size ?? 40}px;
	height: ${(props) => props.$size ?? 40}px;
	border-radius: 50%;
	object-fit: cover;
	border: 1px solid rgba(15, 23, 42, 0.08);
	background: #e2e8f0;
	flex-shrink: 0;
`;

export const DateText = styled.div`
	font-weight: 600;
	color: #0f172a;
`;

export const DateMeta = styled.div`
	font-size: 12px;
	color: #94a3b8;
`;

export const ViewButton = styled.button`
	border: 1px solid rgba(15, 23, 42, 0.15);
	border-radius: 12px;
	background: rgba(248, 250, 252, 0.95);
	color: #0f172a;
	padding: 8px 14px;
	font-size: 13px;
	font-weight: 600;
	display: inline-flex;
	gap: 6px;
	align-items: center;
	cursor: pointer;

	&:focus {
		outline: none;
	}
`;

export const StateMessage = styled.div`
	padding: 48px 24px;
	text-align: center;
	font-size: 15px;
	color: #475569;
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
	justify-content: center;
`;

export const ErrorState = styled(StateMessage)`
	color: #b91c1c;
`;

export const PaginationBar = styled.div`
	padding: 18px 24px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	border-top: 1px solid rgba(15, 23, 42, 0.08);
	background: rgba(248, 250, 252, 0.95);
`;

export const PaginationInfo = styled.span`
	font-size: 13px;
	color: #475569;
`;

export const PaginationControls = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px;
	border-radius: 999px;
	background: rgba(15, 23, 42, 0.04);
`;

export const PaginationButton = styled.button`
	border: none;
	border-radius: 999px;
	background: transparent;
	color: #0f172a;
	padding: 6px 14px;
	font-size: 13px;
	font-weight: 600;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease;

	&:not(:disabled):hover {
		background: rgba(255, 255, 255, 0.8);
		color: #1d4ed8;
	}

	&:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}
`;

export const PaginationCurrent = styled.span`
	padding: 0 10px;
	font-weight: 600;
	color: #0f172a;
`;

export const DetailSection = styled.section`
	border: 1px solid rgba(15, 23, 42, 0.08);
	border-radius: 16px;
	padding: 18px;
	background: rgba(248, 250, 252, 0.7);
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const DetailCard = styled.div`
	background: rgba(255, 255, 255, 0.98);
	border-radius: 24px;
	padding: 24px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const DetailHeading = styled.h3`
	margin: 0;
	font-size: 15px;
	font-weight: 600;
	color: #475569;
`;

export const DetailText = styled.div`
	font-size: 14px;
	color: #0f172a;

	${proseReset};

	.prose {
		font-size: inherit;
		color: inherit;
	}
`;

export const DetailMeta = styled.div`
	font-size: 13px;
	color: #64748b;
`;

export const DetailList = styled.dl`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 12px;
	margin: 0;
`;

export const DetailItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const DetailLabel = styled.dt`
	font-size: 13px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const DetailValue = styled.dd`
	margin: 0;
	font-size: 14px;
	color: #0f172a;
	font-weight: 600;
`;

export const DetailNote = styled.div`
	font-size: 14px;
	color: #0f172a;

	${proseReset};

	.prose {
		font-size: inherit;
		color: inherit;
	}
`;

export const DetailStack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const DetailActions = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 8px;
`;

export const DetailActionButton = styled.button`
	border: 1px solid rgba(37, 99, 235, 0.2);
	border-radius: 12px;
	background: rgba(37, 99, 235, 0.08);
	color: #1d4ed8;
	font-weight: 600;
	font-size: 13px;
	padding: 10px 16px;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;

	&:focus {
		outline: none;
	}
`;
