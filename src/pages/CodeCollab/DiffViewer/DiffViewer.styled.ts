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

	@media (min-width: 1440px) {
		backdrop-filter: blur(6.4px);
	}

	@media (max-width: 1220px) {
		backdrop-filter: blur(5.6px);
	}

	@media (min-width: 1920px) {
		backdrop-filter: blur(8.8px);
	}
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

	@media (min-width: 1440px) {
		border-radius: 12.8px;
		box-shadow: 0 16px 32px rgba(123, 159, 232, 0.25);
		border: 0.8px solid rgba(209, 224, 253, 0.6);
	}

	@media (max-width: 1220px) {
		border-radius: 11.2px;
		box-shadow: 0 14px 28px rgba(123, 159, 232, 0.25);
		border: 0.7px solid rgba(209, 224, 253, 0.6);
	}

	@media (min-width: 1920px) {
		border-radius: 17.6px;
		box-shadow: 0 22px 44px rgba(123, 159, 232, 0.25);
		border: 1px solid rgba(209, 224, 253, 0.6);
	}
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

	@media (min-width: 1440px) {
		padding: 1rem 1.2rem;
		border-bottom: 0.8px solid rgba(209, 224, 253, 0.5);
		border-top-left-radius: 9.6px;
		border-top-right-radius: 9.6px;
	}

	@media (max-width: 1220px) {
		padding: 0.875rem 1.05rem;
		border-bottom: 0.7px solid rgba(209, 224, 253, 0.5);
		border-top-left-radius: 8.4px;
		border-top-right-radius: 8.4px;
	}

	@media (min-width: 1920px) {
		padding: 1.375rem 1.65rem;
		border-bottom: 1px solid rgba(209, 224, 253, 0.5);
		border-top-left-radius: 13.2px;
		border-top-right-radius: 13.2px;
	}
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.875rem;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		gap: 0.7rem;
	}

	@media (max-width: 1220px) {
		gap: 0.6125rem;
	}

	@media (min-width: 1920px) {
		gap: 0.9625rem;
	}
`;

export const CompareIcon = styled.div`
	width: 1.375rem;
	height: 1.375rem;
	color: #27364b;
	display: flex;
	align-items: center;
	justify-content: center;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

	@media (min-width: 1440px) {
		width: 1.1rem;
		height: 1.1rem;
		filter: drop-shadow(0 1.6px 3.2px rgba(0, 0, 0, 0.2));
	}

	@media (max-width: 1220px) {
		width: 0.9625rem;
		height: 0.9625rem;
		filter: drop-shadow(0 1.4px 2.8px rgba(0, 0, 0, 0.2));
	}

	@media (min-width: 1920px) {
		width: 1.5125rem;
		height: 1.5125rem;
		filter: drop-shadow(0 2.2px 4.4px rgba(0, 0, 0, 0.2));
	}
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

	@media (min-width: 1440px) {
		font-size: 1rem;
		text-shadow: 0 1.6px 3.2px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 1220px) {
		font-size: 0.875rem;
		text-shadow: 0 1.4px 2.8px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 1920px) {
		font-size: 1.375rem;
		text-shadow: 0 2.2px 4.4px rgba(0, 0, 0, 0.1);
	}
`;

export const HeaderSubtitle = styled.p`
	font-size: 0.8rem;
	color: #27364b;
	font-weight: 300;
	margin-top: 0.125rem;

	@media (min-width: 1440px) {
		font-size: 0.64rem;
		margin-top: 0.1rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.56rem;
		margin-top: 0.0875rem;
	}

	@media (min-width: 1920px) {
		font-size: 0.88rem;
		margin-top: 0.1375rem;
	}
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

	@media (min-width: 1440px) {
		padding: 0.4rem;
		border-radius: 6.4px;
		border: 0.8px solid #27364b;
	}

	@media (max-width: 1220px) {
		padding: 0.35rem;
		border-radius: 5.6px;
		border: 0.7px solid #27364b;
	}

	@media (min-width: 1920px) {
		padding: 0.55rem;
		border-radius: 8.8px;
		border: 1px solid #27364b;
	}

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

	@media (min-width: 1440px) {
		gap: 0.3rem;
		padding: 0.4rem 0.8rem;
		border-radius: 6.4px;
		font-size: 0.65rem;
	}

	@media (max-width: 1220px) {
		gap: 0.2625rem;
		padding: 0.35rem 0.7rem;
		border-radius: 5.6px;
		font-size: 0.56875rem;
	}

	@media (min-width: 1920px) {
		gap: 0.4125rem;
		padding: 0.55rem 1.1rem;
		border-radius: 8.8px;
		font-size: 0.89375rem;
	}

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

	@media (min-width: 1440px) {
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		gap: 0.35rem;
		padding: 0.4375rem 0.875rem;
		border-radius: 7px;
		font-size: 0.65625rem;
	}

	@media (min-width: 1920px) {
		gap: 0.55rem;
		padding: 0.6875rem 1.375rem;
		border-radius: 11px;
		font-size: 1.03125rem;
	}

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

	@media (min-width: 1440px) {
		padding: 0.8rem;
		border-top: 0.8px solid rgba(209, 224, 253, 0.5);
		box-shadow: 0 -1.6px 8px rgba(123, 159, 232, 0.08);
		border-bottom-left-radius: 9.6px;
		border-bottom-right-radius: 9.6px;
	}

	@media (max-width: 1220px) {
		padding: 0.7rem;
		border-top: 0.7px solid rgba(209, 224, 253, 0.5);
		box-shadow: 0 -1.4px 7px rgba(123, 159, 232, 0.08);
		border-bottom-left-radius: 8.4px;
		border-bottom-right-radius: 8.4px;
	}

	@media (min-width: 1920px) {
		padding: 1.1rem;
		border-top: 1px solid rgba(209, 224, 253, 0.5);
		box-shadow: 0 -2.2px 11px rgba(123, 159, 232, 0.08);
		border-bottom-left-radius: 13.2px;
		border-bottom-right-radius: 13.2px;
	}
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

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.65625rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.03125rem;
	}

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

	@media (min-width: 1440px) {
		padding: 1rem;
		font-size: 0.75rem;
		line-height: 1.28;
	}

	@media (max-width: 1220px) {
		padding: 0.875rem;
		font-size: 0.65625rem;
		line-height: 1.12;
	}

	@media (min-width: 1920px) {
		padding: 1.375rem;
		font-size: 1.03125rem;
		line-height: 1.76;
	}
`;
