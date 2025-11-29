import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
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
	gap: 1.25rem;
	margin-bottom: 1rem;
`;

export const IconCell = styled.div`
	font-size: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const CodeText = styled.span`
	font-family: "Courier New", monospace;
	font-size: 0.875rem;
	color: #4f46e5;
	background-color: #eef2ff;
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
`;

export const VersionText = styled.span`
	font-size: 0.875rem;
	color: #6b7280;
	background-color: #f3f4f6;
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-weight: 500;
`;

export const StatusBadge = styled.span<{ $isEnabled: boolean }>`
	font-size: 0.875rem;
	color: ${(props) => (props.$isEnabled ? "#10b981" : "#ef4444")};
	background-color: ${(props) => (props.$isEnabled ? "#d1fae5" : "#fee2e2")};
	padding: 0.25rem 0.75rem;
	border-radius: 0.375rem;
	font-weight: 500;
	display: inline-block;
`;

//Filter
export const FiltersContainer = styled.div`
	display: flex;
	gap: 16px;
	align-items: flex-end;
	padding: 20px;
	background: #ffffff;
	border-radius: 12px;
	margin-bottom: 20px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	min-width: 200px;
`;

export const FilterLabel = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #374151;
`;

export const FilterInput = styled.input`
	padding: 10px 14px;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const ClearFiltersButton = styled.button`
	padding: 10px 20px;
	background: #f3f4f6;
	color: #374151;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	white-space: nowrap;

	&:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
	}

	&:active {
		transform: scale(0.98);
	}
`;
