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

export const EmptyState = styled.div`
	padding: 48px 24px;
	text-align: center;
	color: #64748b;
	font-size: 15px;
`;

export const LoadingState = styled(EmptyState)`
	color: #0f172a;
`;

export const ErrorState = styled(EmptyState)`
	color: #b91c1c;
`;
