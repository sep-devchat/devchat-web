import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 600px;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 18px;
	background: ${theme.color.grey30};
	border-radius: 10px;
	margin-right: 18px;
	margin-left: 12px;

	@media (max-width: 1220px) {
		width: 100%;
		margin: 0;
		border-radius: 0px 10px 10px 0px;
	}
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	padding: 14px 12px;
	background: ${theme.color.grey30};
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;

export const CPHeaderIcon = styled.div`
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
`;

export const CPHash = styled.div`
	width: 44px;
	height: 44px;
	border-radius: 999px;
	background: #eef2ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #4338ca;
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 18px;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #888;
	transition: color 0.2s;

	&:hover {
		color: #fff;
	}

	&:focus {
		outline: none;
	}
`;
