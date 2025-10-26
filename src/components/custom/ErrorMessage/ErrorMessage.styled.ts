import styled from "styled-components";

export const ErrorContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	gap: 16px;
`;

export const IconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background-color: #fee2e2;
	color: #d83232;
`;

export const TextWrapper = styled.div`
	text-align: center;
	max-width: 400px;
`;

export const Title = styled.h3`
	margin: 0 0 8px 0;
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const ErrorMessageText = styled.p`
	margin: 0;
	font-size: 14px;
	color: #64748b;
	line-height: 1.5;
`;

export const RetryButton = styled.button`
	margin-top: 8px;
	padding: 10px 20px;
	font-size: 14px;
	font-weight: 500;
	color: #608bc1;
	background-color: transparent;
	border: 1px solid #608bc1;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s;
	outline: none;

	&:hover {
		background-color: #608bc133;
	}

	&:focus {
		outline: none;
	}
`;
