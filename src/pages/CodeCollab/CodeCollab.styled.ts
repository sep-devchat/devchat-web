import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	height: 800px;

	@media (min-width: 1440px) {
		height: 620px;
	}

	@media (min-width: 1920px) {
		height: 800px;
	}

	@media (max-width: 1220px) {
		height: 640px;
	}
`;

export const PanelContainer = styled.div`
	height: 100%;
	border: 1px solid rgba(209, 224, 253, 0.6);
	background: #ffffff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(123, 159, 232, 0.12);

	@media (min-width: 1440px) {
		border: 0.8px solid rgba(209, 224, 253, 0.6);
		border-radius: 9.6px;
		box-shadow: 0 3.2px 9.6px rgba(123, 159, 232, 0.12);
	}

	@media (min-width: 1920px) {
		border: 1px solid rgba(209, 224, 253, 0.6);
		border-radius: 14.4px;
		box-shadow: 0 4.8px 14.4px rgba(123, 159, 232, 0.12);
	}

	@media (max-width: 1220px) {
		border: 0.7px solid rgba(209, 224, 253, 0.6);
		border-radius: 8.4px;
		box-shadow: 0 2.8px 8.4px rgba(123, 159, 232, 0.12);
	}
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

	@media (min-width: 1440px) {
		padding: 0.8rem;
		border-bottom: 0.8px solid rgba(209, 224, 253, 0.5);
	}

	@media (min-width: 1920px) {
		padding: 1.2rem;
		border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	}

	@media (max-width: 1220px) {
		padding: 0.7rem;
		border-bottom: 0.7px solid rgba(209, 224, 253, 0.5);
	}
`;

export const ChannelName = styled.h3`
	font-weight: 500;
	font-size: 1rem;
	line-height: 1rem;
	color: #27364b;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		font-size: 0.8rem;
		line-height: 0.8rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.2rem;
		line-height: 1.2rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.7rem;
		line-height: 0.7rem;
	}
`;

export const ChatContent = styled.div`
	flex: 1;
	overflow: hidden;
`;

export const CodeEditorWrapper = styled.div`
	height: 100%;
	padding: 0.75rem;

	@media (min-width: 1440px) {
		padding: 0.6rem;
	}

	@media (min-width: 1920px) {
		padding: 0.9rem;
	}

	@media (max-width: 1220px) {
		padding: 0.525rem;
	}
`;

export const CodeEditorWrapperBottom = styled.div`
	height: 100%;
	padding: 0.75rem;
	padding-top: 0;

	@media (min-width: 1440px) {
		padding: 0.6rem;
		padding-top: 0;
	}

	@media (min-width: 1920px) {
		padding: 0.9rem;
		padding-top: 0;
	}

	@media (max-width: 1220px) {
		padding: 0.525rem;
		padding-top: 0;
	}
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

	@media (min-width: 1440px) {
		backdrop-filter: blur(6.4px);
	}

	@media (min-width: 1920px) {
		backdrop-filter: blur(9.6px);
	}

	@media (max-width: 1220px) {
		backdrop-filter: blur(5.6px);
	}
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

	@media (min-width: 1440px) {
		width: 352px;
		border-radius: 12.8px;
		box-shadow: 0 16px 32px rgba(123, 159, 232, 0.25);
		border: 0.8px solid rgba(209, 224, 253, 0.6);
		padding: 1.6rem;
	}

	@media (min-width: 1920px) {
		width: 528px;
		border-radius: 19.2px;
		box-shadow: 0 24px 48px rgba(123, 159, 232, 0.25);
		border: 1px solid rgba(209, 224, 253, 0.6);
		padding: 2.4rem;
	}

	@media (max-width: 1220px) {
		width: 308px;
		border-radius: 11.2px;
		box-shadow: 0 14px 28px rgba(123, 159, 232, 0.25);
		border: 0.7px solid rgba(209, 224, 253, 0.6);
		padding: 1.4rem;
	}

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

	@media (min-width: 1440px) {
		@keyframes modalSlideIn {
			from {
				opacity: 0;
				transform: scale(0.95) translateY(-16px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}

	@media (max-width: 1220px) {
		@keyframes modalSlideIn {
			from {
				opacity: 0;
				transform: scale(0.95) translateY(-14px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}
	}

	@media (min-width: 1920px) {
		@keyframes modalSlideIn {
			from {
				opacity: 0;
				transform: scale(0.95) translateY(-24px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
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

	@media (min-width: 1440px) {
		font-size: 1rem;
		margin-bottom: 0.6rem;
		gap: 0.4rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.875rem;
		margin-bottom: 0.525rem;
		gap: 0.35rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.5rem;
		margin-bottom: 0.9rem;
		gap: 0.6rem;
	}

	&::before {
		content: "⚠️";
		font-size: 1.5rem;

		@media (min-width: 1440px) {
			font-size: 1.2rem;
		}

		@media (max-width: 1220px) {
			font-size: 1.05rem;
		}

		@media (min-width: 1920px) {
			font-size: 1.8rem;
		}
	}
`;

export const ModalDescription = styled.p`
	font-size: 0.9375rem;
	line-height: 1.6;
	color: #6b7c93;
	margin-bottom: 1.75rem;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
		line-height: 1.28;
		margin-bottom: 1.4rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.65625rem;
		line-height: 1.12;
		margin-bottom: 1.225rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.125rem;
		line-height: 1.92;
		margin-bottom: 2.1rem;
	}
`;

export const ModalActions = styled.div`
	display: flex;
	gap: 0.875rem;
	justify-content: flex-end;

	@media (min-width: 1440px) {
		gap: 0.7rem;
	}

	@media (max-width: 1220px) {
		gap: 0.6125rem;
	}

	@media (min-width: 1920px) {
		gap: 1.05rem;
	}
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

	@media (min-width: 1440px) {
		padding: 0.6rem 1.2rem;
		border-radius: 8px;
		border: 0.8px solid rgba(209, 224, 253, 0.8);
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		padding: 0.525rem 1.05rem;
		border-radius: 7px;
		border: 0.7px solid rgba(209, 224, 253, 0.8);
		font-size: 0.65625rem;
	}

	@media (min-width: 1920px) {
		padding: 0.9rem 1.8rem;
		border-radius: 12px;
		border: 1px solid rgba(209, 224, 253, 0.8);
		font-size: 1.125rem;
	}

	&:hover {
		background: rgba(209, 224, 253, 0.2);
		border-color: #7b9fe8;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(123, 159, 232, 0.2);

		@media (min-width: 1440px) {
			transform: translateY(-0.8px);
			box-shadow: 0 1.6px 6.4px rgba(123, 159, 232, 0.2);
		}

		@media (max-width: 1220px) {
			transform: translateY(-0.7px);
			box-shadow: 0 1.4px 5.6px rgba(123, 159, 232, 0.2);
		}

		@media (min-width: 1920px) {
			transform: translateY(-1.2px);
			box-shadow: 0 2.4px 9.6px rgba(123, 159, 232, 0.2);
		}
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

	@media (min-width: 1440px) {
		padding: 0.6rem 1.2rem;
		border-radius: 8px;
		font-size: 0.75rem;
		box-shadow: 0 1.6px 6.4px rgba(239, 68, 68, 0.3);
	}

	@media (max-width: 1220px) {
		padding: 0.525rem 1.05rem;
		border-radius: 7px;
		font-size: 0.65625rem;
		box-shadow: 0 1.4px 5.6px rgba(239, 68, 68, 0.3);
	}

	@media (min-width: 1920px) {
		padding: 0.9rem 1.8rem;
		border-radius: 12px;
		font-size: 1.125rem;
		box-shadow: 0 2.4px 9.6px rgba(239, 68, 68, 0.3);
	}

	&:hover {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);

		@media (min-width: 1440px) {
			transform: translateY(-1.6px);
			box-shadow: 0 3.2px 9.6px rgba(239, 68, 68, 0.4);
		}

		@media (max-width: 1220px) {
			transform: translateY(-1.4px);
			box-shadow: 0 2.8px 8.4px rgba(239, 68, 68, 0.4);
		}

		@media (min-width: 1920px) {
			transform: translateY(-2.4px);
			box-shadow: 0 4.8px 14.4px rgba(239, 68, 68, 0.4);
		}
	}

	&:active {
		transform: translateY(0);
	}
`;

export const CloseButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	background: transparent;
	border: none;
	border-radius: 0.5rem;
	color: #94a3b8;
	cursor: pointer;
	transition: all 0.2s;

	@media (min-width: 1440px) {
		padding: 0.4rem;
		border-radius: 0.4rem;
	}

	@media (max-width: 1220px) {
		padding: 0.35rem;
		border-radius: 0.35rem;
	}

	@media (min-width: 1920px) {
		padding: 0.6rem;
		border-radius: 0.6rem;
	}

	&:hover {
		background: #f1f5f9;
		color: #475569;
	}
`;
