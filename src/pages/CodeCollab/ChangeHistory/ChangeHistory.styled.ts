// ChangeHistory.styled.ts
import styled from "styled-components";

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
	border-radius: 0;
	overflow: hidden;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.08),
		0 2px 4px -1px rgba(0, 0, 0, 0.04);
`;

export const Header = styled.div`
	padding: 1rem;
	border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	flex-shrink: 0;
	background: #eff4fc;
	position: relative;
	overflow: hidden;
`;

export const HeaderTitle = styled.h3`
	font-weight: 500;
	font-size: 1rem;
	line-height: 1rem;
	color: #27364b;
	position: relative;
	z-index: 1;
`;

export const HeaderSubtitle = styled.p`
	font-size: 0.75rem;
	margin-top: 0.375rem;
	color: #666;
	position: relative;
	z-index: 1;
	font-weight: 100;
`;

export const ListContainer = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	padding: 1rem;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: rgba(209, 224, 253, 0.3);
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(166, 194, 242, 0.5);
		border-radius: 4px;
		transition: background 0.2s;

		&:hover {
			background: rgba(166, 194, 242, 0.7);
		}
	}
`;

export const ChangeButton = styled.button`
	width: 100%;
	text-align: left;
	padding: 1rem;
	border-radius: 10px;
	border: 1px solid rgba(209, 224, 253, 0.6);
	background: #ffffff;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 1px 3px rgba(123, 159, 232, 0.08);
	position: relative;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(166, 194, 242, 0.12),
			transparent
		);
		transition: left 0.5s;
	}

	&:hover {
		background: linear-gradient(
			135deg,
			rgba(209, 224, 253, 0.3) 0%,
			rgba(166, 194, 242, 0.2) 100%
		);
		border-color: rgba(123, 159, 232, 0.4);
		box-shadow: 0 4px 12px rgba(123, 159, 232, 0.2);
		transform: translateY(-2px);

		&::before {
			left: 100%;
		}
	}

	&:active {
		transform: translateY(0);
	}

	&:focus {
		outline: none;
	}
`;

export const ChangeContent = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.875rem;
	position: relative;
	z-index: 1;
`;

export const UserIconContainer = styled.div`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	background: linear-gradient(135deg, #7b9fe8 0%, #a6c2f2 50%, #f5e6d3 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 8px rgba(123, 159, 232, 0.35);
	color: #ffffff;

	${ChangeButton}:hover & {
		background: linear-gradient(135deg, #8baee8 0%, #b5d0f5 50%, #ffe8c7 100%);
	}
`;

export const UserInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

export const UserName = styled.p`
	font-weight: 600;
	font-size: 0.9375rem;
	line-height: 1.375rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #2c3e50;
	transition: color 0.2s;

	${ChangeButton}:hover & {
		color: #5a7fb8;
	}
`;

export const TimeInfo = styled.div`
	display: flex;
	font-weight: 400;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.375rem;
	font-size: 0.8125rem;
	line-height: 1.125rem;
	color: #6b7c93;

	svg {
		color: #8ba3c7;
	}
`;

export const CompareIcon = styled.div`
	width: 1.125rem;
	height: 1.125rem;
	color: #7b9fe8;
	opacity: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	transform: translateX(-8px);

	${ChangeButton}:hover & {
		opacity: 1;
		transform: translateX(0);
	}
`;
