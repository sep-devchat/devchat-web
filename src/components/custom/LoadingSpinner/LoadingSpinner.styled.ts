import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	gap: 16px;
`;

export const IconWrapper = styled.div`
	animation: ${spin} 1s linear infinite;
	color: #3b82f6;
`;

export const Message = styled.p`
	margin: 0;
	font-size: 15px;
	color: #64748b;
	font-weight: 500;
`;
