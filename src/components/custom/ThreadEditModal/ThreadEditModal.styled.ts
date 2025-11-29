import styled from "styled-components";

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

export const ModalContainer = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	border-radius: 8px;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	z-index: 1000;
	width: 90%;
	max-width: 450px;
	max-height: 90vh;
	overflow: auto;
	animation: slideIn 0.3s ease-out;

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translate(-50%, -48%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	@media (max-width: 1220px) {
		border-radius: 5.6px;
		max-width: 315px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		border-radius: 6.4px;
		max-width: 360px;
	}

	@media (min-width: 1920px) {
		border-radius: 8.8px;
		max-width: 495px;
	}
`;

export const ModalHeader = styled.div`
	padding: 20px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #f9fafb;

	@media (max-width: 1220px) {
		padding: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 16px;
	}

	@media (min-width: 1920px) {
		padding: 22px;
	}
`;

export const ModalTitle = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
	color: #111827;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	transition: color 0.2s;

	&:hover {
		color: #111827;
	}

	&:active {
		color: #374151;
	}

	@media (max-width: 1220px) {
		padding: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
	}
`;

export const ModalContent = styled.div`
	padding: 20px;

	@media (max-width: 1220px) {
		padding: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 16px;
	}

	@media (min-width: 1920px) {
		padding: 22px;
	}
`;

export const FormGroup = styled.div`
	margin-bottom: 16px;

	&:last-of-type {
		margin-bottom: 0;
	}

	@media (max-width: 1220px) {
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 17.6px;
	}
`;

export const Label = styled.label`
	display: block;
	margin-bottom: 6px;
	font-size: 14px;
	font-weight: 500;
	color: #374151;

	@media (max-width: 1220px) {
		margin-bottom: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 6.6px;
		font-size: 16px;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	font-family: inherit;
	box-sizing: border-box;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: #133e87;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	&:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	&::placeholder {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		padding: 5.6px 8.4px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 9.6px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	font-family: inherit;
	box-sizing: border-box;
	resize: vertical;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: #133e87;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	&:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	&::placeholder {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		padding: 5.6px 8.4px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 9.6px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const ErrorMessage = styled.div`
	padding: 10px 12px;
	background-color: #fee2e2;
	border: 1px solid #fecaca;
	border-radius: 6px;
	color: #991b1b;
	font-size: 14px;
	margin-bottom: 16px;
	animation: slideDown 0.2s ease-out;

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1220px) {
		padding: 7px 8.4px;
		border-radius: 4.2px;
		font-size: 12px;
		margin-bottom: 11.2px;

		@keyframes slideDown {
			from {
				transform: translateY(-5.6px);
			}
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 8px 9.6px;
		border-radius: 4.8px;
		font-size: 13px;
		margin-bottom: 12.8px;

		@keyframes slideDown {
			from {
				transform: translateY(-6.4px);
			}
		}
	}

	@media (min-width: 1920px) {
		padding: 11px 13.2px;
		border-radius: 6.6px;
		font-size: 16px;
		margin-bottom: 17.6px;

		@keyframes slideDown {
			from {
				transform: translateY(-8.8px);
			}
		}
	}
`;

export const ModalFooter = styled.div`
	display: flex;
	gap: 10px;
	justify-content: flex-end;
	padding: 16px 20px;
	border-top: 1px solid #e5e7eb;
	background-color: #f9fafb;

	@media (max-width: 1220px) {
		gap: 7px;
		padding: 11.2px 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 8px;
		padding: 12.8px 16px;
	}

	@media (min-width: 1920px) {
		gap: 11px;
		padding: 17.6px 22px;
	}
`;

export const CancelButton = styled.button`
	padding: 8px 16px;
	background-color: #f3f4f6;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	align-items: center;
	justify-content: center;

	&:hover:not(:disabled) {
		background-color: #e5e7eb;
		border-color: #9ca3af;
	}

	&:active:not(:disabled) {
		background-color: #d1d5db;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const SubmitButton = styled.button`
	padding: 8px 16px;
	background-color: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	align-items: center;
	justify-content: center;

	&:hover:not(:disabled) {
		background-color: #2563eb;
		box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
	}

	&:active:not(:disabled) {
		background-color: #1d4ed8;
	}

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;
