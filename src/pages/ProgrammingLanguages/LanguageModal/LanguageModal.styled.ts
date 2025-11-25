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
	padding: 1rem;
`;

export const ModalContainer = styled.div`
	background: white;
	border-radius: 0.75rem;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	width: 100%;
	max-width: 500px;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 600;
	color: #1f2937;
	margin: 0;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	color: #6b7280;
	cursor: pointer;
	padding: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;

	&:hover {
		color: #374151;
	}

	&:focus {
		outline: none;
	}
`;

export const ModalBody = styled.div`
	padding: 1.5rem;
	overflow-y: auto;
	flex: 1;
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export const Label = styled.label`
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
	display: flex;
	align-items: center;
	gap: 0.25rem;
`;

export const Required = styled.span`
	color: #dc2626;
	font-weight: 600;
`;

export const Input = styled.input<{ error?: boolean }>`
	width: 100%;
	padding: 0.625rem 0.875rem;
	border: 1px solid ${(props) => (props.error ? "#dc2626" : "#d1d5db")};
	border-radius: 0.5rem;
	font-size: 0.875rem;
	color: #1f2937;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.error ? "#dc2626" : "#3b82f6")};
		box-shadow: 0 0 0 3px
			${(props) =>
				props.error ? "rgba(220, 38, 38, 0.1)" : "rgba(59, 130, 246, 0.1)"};
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const Select = styled.select`
	width: 100%;
	padding: 0.625rem 0.875rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	color: #1f2937;
	background-color: white;
	cursor: pointer;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
`;

export const ErrorText = styled.span`
	font-size: 0.75rem;
	color: #dc2626;
	margin-top: -0.25rem;
`;

export const ModalFooter = styled.div`
	display: flex;
	gap: 0.75rem;
	padding-top: 1rem;
	border-top: 1px solid #e5e7eb;
	margin-top: 0.5rem;
`;

export const CancelButton = styled.button`
	flex: 1;
	padding: 0.625rem 1rem;
	border: 1px solid #d1d5db;
	background-color: white;
	color: #374151;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background-color: #f9fafb;
		border-color: #9ca3af;
	}

	&:focus {
		outline: none;
	}
`;

export const SubmitButton = styled.button`
	flex: 1;
	padding: 0.625rem 1rem;
	border: none;
	background-color: #1e3a8a;
	color: white;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background-color: #1e40af;
	}

	&:active {
		transform: translateY(1px);
	}

	&:focus {
		outline: none;
	}
`;
export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const Checkbox = styled.input`
	width: 18px;
	height: 18px;
	cursor: pointer;
`;

export const CheckboxLabel = styled.label`
	cursor: pointer;
	font-size: 14px;
`;

export const IconUploadContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const UploadButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px;
	border: 2px dashed #ddd;
	border-radius: 8px;
	background: #f9f9f9;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		border-color: #999;
		background: #f0f0f0;
	}

	&:focus {
		outline: none;
	}
`;

export const HiddenFileInput = styled.input`
	display: none;
`;

export const IconPreviewContainer = styled.div`
	position: relative;
	width: fit-content;
`;

export const IconPreview = styled.img`
	width: 80px;
	height: 80px;
	object-fit: contain;
	border: 1px solid #ddd;
	border-radius: 8px;
	padding: 8px;
`;

export const RemoveIconButton = styled.button`
	position: absolute;
	top: -8px;
	right: -8px;
	background: #ff4444;
	color: white;
	border: none;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:hover {
		background: #cc0000;
	}

	&:focus {
		outline: none;
	}
`;

export const UploadHint = styled.p`
	font-size: 12px;
	color: #666;
	margin: 0;
`;
