import { theme } from "@/themes";
import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 0;
	margin-left: 24px;
	height: 100%;
	overflow-y: auto;

	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	flex-shrink: 0;
`;

export const ContentArea = styled.div`
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	min-height: 400px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const ContentTitle = styled.h2`
	font-size: 20px;
	font-weight: 700;
	color: #1f2937;
	margin-bottom: 20px;
`;

export const ContentPlaceholder = styled.div`
	padding: 40px;
	text-align: center;
	color: #6b7280;
	font-size: 15px;
	background: #f9fafb;
	border-radius: 8px;
	border: 2px dashed #e5e7eb;
`;

export const ContentHeader = styled.div`
	font-size: 24px;
	color: #27364b;
	font-weight: 600;
`;

export const Divider = styled.div`
	width: 100%;
	border: 1px solid ${theme.color.grey30};
`;

export const BanButton = styled.button`
	width: max-content;
	background: ${theme.color.cancelBackground};
	color: ${theme.color.cancel};
	display: inline-flex;
	place-items: center;
	gap: 2px;
	padding: 6px 12px;

	&:focus {
		outline-style: none;
	}

	&.ban {
		background: ${theme.color.cancelBackground};
		color: ${theme.color.cancel};
	}

	&.unban {
		background: ${theme.color.successBackground};
		color: ${theme.color.success};
	}
`;
