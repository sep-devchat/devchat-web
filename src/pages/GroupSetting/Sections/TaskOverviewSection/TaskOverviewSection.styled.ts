import styled from "styled-components";
import { theme } from "@/themes";

export const SectionWrapper = styled.div`
	width: 100%;
	padding: 0.7rem 1.3rem;
	box-sizing: border-box;

	@media (min-width: 1440px) {
		padding: 0.75rem 1.5rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 1rem;
	}
`;

export const TitleSection = styled.h1`
	font-weight: 700;
	font-size: 1.25rem;
	color: #666666;
	margin-bottom: 1rem;

	@media (max-width: 1220px) {
		font-size: 15px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15.5px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const StatisticsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1rem;
	margin-bottom: 1.5rem;
	margin-top: 2rem;

	@media (min-width: 1440px) {
		gap: 1.25rem;
		margin-bottom: 1.75rem;
	}

	@media (max-width: 1220px) {
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	@media (max-width: 1024px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

export const StatCard = styled.div<{ $color?: string }>`
	background: ${(props) => props.$color || "rgba(255, 255, 255, 0.9)"};
	border-radius: 0.75rem;
	padding: 1.25rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
	}

	@media (min-width: 1440px) {
		padding: 1.5rem;
		border-radius: 0.875rem;
	}

	@media (max-width: 1220px) {
		padding: 1rem;
		border-radius: 0.625rem;
	}
`;

export const StatLabel = styled.div`
	font-size: 0.75rem;
	font-weight: 500;
	color: ${theme.color.grey600};
	margin-bottom: 0.5rem;
	text-transform: uppercase;
	letter-spacing: 0.5px;

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}
`;

export const StatValue = styled.div`
	font-size: 2rem;
	font-weight: 700;
	color: ${theme.color.grey900};

	@media (min-width: 1440px) {
		font-size: 2.25rem;
	}

	@media (max-width: 1220px) {
		font-size: 1.75rem;
	}
`;

export const DetailSection = styled.div`
	background: rgba(255, 255, 255, 0.9);
	border-radius: 0.75rem;
	padding: 1.25rem;
	margin-bottom: 1.25rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

	@media (min-width: 1440px) {
		padding: 1.5rem;
		border-radius: 0.875rem;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 1220px) {
		padding: 1rem;
		border-radius: 0.625rem;
		margin-bottom: 1rem;
	}
`;

export const DetailTitle = styled.h3`
	font-size: 1rem;
	font-weight: 600;
	color: ${theme.color.grey500};
	margin-bottom: 0.875rem;

	@media (min-width: 1440px) {
		font-size: 1.125rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.9375rem;
		margin-bottom: 0.75rem;
	}
`;

export const DetailGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;

	@media (min-width: 1440px) {
		gap: 1.25rem;
	}

	@media (max-width: 1220px) {
		gap: 0.75rem;
	}

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 480px) {
		grid-template-columns: 1fr;
	}
`;

export const DetailItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

export const DetailLabel = styled.span`
	font-size: 0.75rem;
	color: ${theme.color.grey600};
	font-weight: 500;

	@media (min-width: 1440px) {
		font-size: 0.8125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.6875rem;
	}
`;

export const DetailValue = styled.span<{ $color?: string }>`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.$color || theme.color.grey900};

	@media (min-width: 1440px) {
		font-size: 1.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 1.25rem;
	}
`;

export const LoadingContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	font-size: 1rem;
	color: ${theme.color.grey600};

	@media (min-width: 1440px) {
		font-size: 1.125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.9375rem;
	}
`;

export const ErrorContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	font-size: 1rem;
	color: ${theme.color.error};
	text-align: center;
	padding: 2rem;

	@media (min-width: 1440px) {
		font-size: 1.125rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.9375rem;
		padding: 1.5rem;
	}
`;

export const HeaderWithFilter = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 2rem;
	margin-top: 2.6rem;
	gap: 1rem;

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const DateRangeDropdown = styled.div`
	position: relative;
	display: inline-block;
`;

export const DropdownTrigger = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: white;
	color: #374151;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	min-width: 140px;
	justify-content: space-between;

	&:hover {
		border-color: #9ca3af;
		background: #f9fafb;
	}

	&:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	svg {
		flex-shrink: 0;
	}

	@media (min-width: 1440px) {
		padding: 0.5625rem 1.125rem;
		font-size: 0.9375rem;
	}

	@media (max-width: 1220px) {
		padding: 0.4375rem 0.875rem;
		font-size: 0.8125rem;
		min-width: 120px;
	}
`;

export const DropdownMenu = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 0.5rem;
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	min-width: 420px;
	overflow: hidden;
`;

export const DropdownOption = styled.div<{ $isSelected?: boolean }>`
	padding: 0.625rem 1rem;
	cursor: pointer;
	font-size: 0.875rem;
	color: ${(props) => (props.$isSelected ? "#3b82f6" : "#374151")};
	background: ${(props) => (props.$isSelected ? "#eff6ff" : "white")};
	font-weight: ${(props) => (props.$isSelected ? "600" : "500")};
	border-left: 3px solid
		${(props) => (props.$isSelected ? "#3b82f6" : "transparent")};
	transition: all 0.15s ease;

	&:hover {
		background: #f3f4f6;
	}

	@media (min-width: 1440px) {
		padding: 0.75rem 1.125rem;
		font-size: 0.9375rem;
	}

	@media (max-width: 1220px) {
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
	}
`;

export const FilterTag = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.875rem;
	background: #eff6ff;
	border: 1px solid #bfdbfe;
	border-radius: 0.5rem;
	color: #1e40af;
	font-size: 0.875rem;
	font-weight: 500;

	@media (min-width: 1440px) {
		padding: 0.5625rem 1rem;
		font-size: 0.9375rem;
	}

	@media (max-width: 1220px) {
		padding: 0.4375rem 0.75rem;
		font-size: 0.8125rem;
	}
`;

export const FilterTagClose = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	color: #1e40af;
	padding: 0;
	margin: 0;
	transition: color 0.15s ease;

	&:hover {
		color: #1e3a8a;
	}

	svg {
		width: 14px;
		height: 14px;
	}
`;

export const CustomRangeContainer = styled.div`
	padding: 1.5rem;
	border-top: 1px solid #e5e7eb;
	background: #f9fafb;
`;

export const CustomRangeInputs = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.75rem;
	width: 100%;
`;

export const DateInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	flex: 1;
	min-width: 250px;

	label {
		font-size: 0.7rem;
		font-weight: 600;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		line-height: 1;
	}

	@media (min-width: 1440px) {
		label {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 1220px) {
		label {
			font-size: 0.65rem;
		}
	}
`;
