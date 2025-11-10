import styled from "styled-components";

export const ModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const ModalBackdrop = styled.div`
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(8px);
`;

export const ModalContent = styled.div`
	position: relative;
	z-index: 10;
	width: 90vw;
	height: 85vh;
	background: linear-gradient(to bottom, #ffffff, #f7f9fc);
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(123, 159, 232, 0.25);
	border: 1px solid rgba(209, 224, 253, 0.6);
	display: flex;
	flex-direction: column;
	border-radius: 12px;
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
	flex-shrink: 0;
	position: relative;
	overflow: hidden;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.875rem;
	position: relative;
	z-index: 1;
`;

export const CompareIcon = styled.div`
	width: 1.375rem;
	height: 1.375rem;
	color: #27364b;
	display: flex;
	align-items: center;
	justify-content: center;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

export const HeaderInfo = styled.div`
	display: flex;
	flex-direction: column;
`;

export const HeaderTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 500;
	color: #27364b;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const HeaderSubtitle = styled.p`
	font-size: 0.8rem;
	color: #27364b;
	font-weight: 300;
	margin-top: 0.125rem;
`;

export const CloseButton = styled.button`
	padding: 0.5rem;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid #27364b;
	color: #27364b;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 1;

	&:active {
		transform: scale(0.95);
	}

	&:focus {
		outline: none;
	}
`;

export const RunButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	color: #ffffff;
	font-size: 0.8125rem;
	font-weight: 600;
	border: none;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:active {
		transform: translateY(0);
	}

	&:focus {
		outline: none;
	}
`;

export const LoadButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 1.25rem;
	border-radius: 10px;
	background: linear-gradient(135deg, #7b9fe8 0%, #a6c2f2 100%);
	color: #ffffff;
	font-size: 0.9375rem;
	font-weight: 600;
	border: none;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:active {
		transform: translateY(0);
	}

	&:focus {
		outline: none;
	}
`;

export const Footer = styled.div`
	padding: 1rem;
	border-top: 1px solid rgba(209, 224, 253, 0.5);
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
	flex-shrink: 0;
	box-shadow: 0 -2px 10px rgba(123, 159, 232, 0.08);
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
`;

export const FooterContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const DiffInfo = styled.div`
	font-size: 0.9375rem;
	color: #6b7c93;
	font-weight: 500;

	span {
		font-weight: 700;
		color: #2c3e50;
	}
`;

export const CodePre = styled.pre`
	padding: 1.25rem;
	font-size: 0.9375rem;
	font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
	color: #e2e8f0;
	line-height: 1.6;
`;
