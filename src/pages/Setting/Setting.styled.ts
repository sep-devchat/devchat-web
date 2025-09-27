import styled from "styled-components";

export const Card = styled.div`
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	overflow: hidden;
	min-height: 100vh;
`;

export const CardHeader = styled.div`
	padding: 24px;
	border-bottom: 1px solid #f3f4f6;
`;

export const CardTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 8px;
`;

export const CardDescription = styled.p`
	color: #666666;
	font-size: 14px;
`;

export const CardContent = styled.div`
	padding: 24px;
`;
