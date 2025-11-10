import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	height: 800px;
`;

export const PanelContainer = styled.div`
	height: 100%;
	border: 1px solid rgba(209, 224, 253, 0.6);
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(123, 159, 232, 0.12);
`;

export const ChatPanel = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const ChatHeader = styled.div`
	padding: 1rem;
	border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	flex-shrink: 0;
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
	position: relative;
	overflow: hidden;
`;

export const ChannelName = styled.h3`
	font-weight: 500;
	font-size: 1rem;
	line-height: 1rem;
	color: #27364b;
	position: relative;
	z-index: 1;
`;

export const ChatContent = styled.div`
	flex: 1;
	overflow: hidden;
`;

export const CodeEditorWrapper = styled.div`
	height: 100%;
	padding: 0.75rem;
`;

export const CodeEditorWrapperBottom = styled.div`
	height: 100%;
	padding: 0.75rem;
	padding-top: 0;
`;

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
	width: 440px;
	background: linear-gradient(to bottom, #ffffff, #f7f9fc);
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(123, 159, 232, 0.25);
	border: 1px solid rgba(209, 224, 253, 0.6);
	padding: 2rem;
	animation: modalSlideIn 0.3s ease-out;

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
`;

export const ModalTitle = styled.h3`
	font-size: 1.25rem;
	font-weight: 700;
	margin-bottom: 0.75rem;
	color: #2c3e50;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	&::before {
		content: "⚠️";
		font-size: 1.5rem;
	}
`;

export const ModalDescription = styled.p`
	font-size: 0.9375rem;
	line-height: 1.6;
	color: #6b7c93;
	margin-bottom: 1.75rem;
`;

export const ModalActions = styled.div`
	display: flex;
	gap: 0.875rem;
	justify-content: flex-end;
`;

export const CancelButton = styled.button`
	padding: 0.75rem 1.5rem;
	border-radius: 10px;
	border: 1px solid rgba(209, 224, 253, 0.8);
	background: #ffffff;
	color: #2c3e50;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		background: rgba(209, 224, 253, 0.2);
		border-color: #7b9fe8;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(123, 159, 232, 0.2);
	}

	&:active {
		transform: translateY(0);
	}
`;

export const DiscardButton = styled.button`
	padding: 0.75rem 1.5rem;
	border-radius: 10px;
	border: none;
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	color: #ffffff;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

	&:hover {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
	}

	&:active {
		transform: translateY(0);
	}
`;
