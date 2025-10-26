import styled from "styled-components";

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const ModalContainer = styled.div`
	background: white;
	border-radius: 12px;
	width: 90%;
	max-width: 600px;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	animation: slideUp 0.3s ease-out;

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24px;
	border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const CloseButton = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	transition: all 0.2s;

	&:hover {
		background: #f3f4f6;
		color: #374151;
	}
`;

export const ModalBody = styled.div`
	padding: 24px;
	overflow-y: auto;
	flex: 1;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: #f3f4f6;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 4px;

		&:hover {
			background: #9ca3af;
		}
	}
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	display: flex;
	align-items: center;
	gap: 4px;
`;

export const Required = styled.span`
	color: #d83232;
	font-size: 14px;
`;

export const Input = styled.input<{ error?: boolean }>`
	width: 100%;
	padding: 12px 14px;
	border: 1px solid ${(props) => (props.error ? "#D83232" : "#e5e7eb")};
	border-radius: 8px;
	font-size: 14px;
	color: #374151;
	transition: all 0.2s;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.error ? "#D83232" : "#133e87")};
		box-shadow: 0 0 0 3px
			${(props) =>
				props.error ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const Select = styled.select<{ error?: boolean }>`
	width: 100%;
	padding: 12px 14px;
	border: 1px solid ${(props) => (props.error ? "#D83232" : "#e5e7eb")};
	border-radius: 8px;
	font-size: 14px;
	color: #374151;
	background: white;
	cursor: pointer;
	transition: all 0.2s;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.error ? "#D83232" : "#133e87")};
		box-shadow: 0 0 0 3px
			${(props) =>
				props.error ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
	}
`;

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 0;
`;

export const Checkbox = styled.input`
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: #133e87;
`;

export const CheckboxLabel = styled.span`
	font-size: 14px;
	color: #374151;
	user-select: none;
`;

export const ErrorText = styled.span`
	font-size: 13px;
	color: #d83232;
	margin-top: 4px;
`;

export const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	padding-top: 24px;
	border-top: 1px solid #e5e7eb;
	margin-top: 8px;
`;

export const CancelButton = styled.button`
	padding: 10px 20px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background: white;
	color: #374151;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #f9fafb;
		border-color: #d1d5db;
	}
`;

export const SubmitButton = styled.button`
	padding: 10px 20px;
	border: none;
	border-radius: 8px;
	background: #133e87;
	color: white;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #1952b3;
	}

	&:active {
		transform: scale(0.98);
	}
`;
