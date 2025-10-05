import styled from "styled-components";

export const HeaderContainer = styled.div<{ $backgroundColor?: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	background-color: ${(props) => props.$backgroundColor || "#ffffff"};
	border-bottom: 1px solid #e5e7eb;
	border-radius: 16px 16px 0 0;
	transition: background-color 0.2s ease;
`;

export const LeftSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

export const RightSection = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	color: #666;
`;

export const CheckboxWrapper = styled.label`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	user-select: none;
	font-size: 0.875rem;
	color: #6b7280;
	font-weight: 500;
`;

export const Checkbox = styled.input`
	width: 1rem;
	height: 1rem;
	border-radius: 0.25rem;
	border: 1px solid #d1d5db;
	color: #133e87;
	cursor: pointer;

	&:focus {
		ring: 2px;
		ring-color: #5c95f1ff;
	}
`;

export const Title = styled.h2<{ $titleColor?: string }>`
	font-size: 1.25rem;
	font-weight: 600;
	color: ${(props) => props.$titleColor || "#27364B"};
	transition: color 0.2s ease;
`;

export const ActionsSection = styled.div`
	display: flex;
	gap: 0.5rem;
`;
