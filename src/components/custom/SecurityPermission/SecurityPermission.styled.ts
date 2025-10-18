import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 0;
	height: 100%;
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const Section = styled.div`
	background: white;
	border-radius: 8px;
	padding: 24px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const SectionTitle = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 24px;
`;

export const SettingItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 0;
	border-bottom: 1px solid #e0e0e0;

	&:last-child {
		border-bottom: none;
	}
`;

export const SettingLabel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const SettingTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const SettingDescription = styled.div`
	font-size: 13px;
	color: #666;
`;

export const ToggleContainer = styled.label`
	display: inline-flex;
	align-items: center;
	cursor: pointer;
`;

export const ToggleSwitch = styled.input`
	appearance: none;
	width: 50px;
	height: 28px;
	background: #ccc;
	border-radius: 14px;
	cursor: pointer;
	position: relative;
	transition: background-color 0.3s ease;
	border: none;
	outline: none;

	&:checked {
		background-color: #1cca93;
	}

	&:before {
		content: "";
		position: absolute;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: white;
		top: 2px;
		left: 2px;
		transition: left 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	&:checked:before {
		left: 24px;
	}
`;

export const InputField = styled.input`
	width: 80px;
	padding: 8px 12px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	text-align: center;
	background: white;

	&:focus {
		outline: none;
		border-color: #133e87;
		box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
	}
`;

export const SectionFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 24px;
`;

export const WhitelistLabel = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 12px;
`;

export const WhitelistDescription = styled.div`
	font-size: 13px;
	color: #666;
	margin-bottom: 16px;
`;

export const IPInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
`;

export const IPInputWrapper = styled.div`
	display: flex;
	gap: 8px;
`;

export const IPInputField = styled.input<{ isError?: boolean }>`
	flex: 1;
	padding: 10px 12px;
	border: 1px solid ${(props) => (props.isError ? "#f44336" : "#e0e0e0")};
	border-radius: 6px;
	font-size: 14px;
	background: white;
	transition: border-color 0.2s;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.isError ? "#f44336" : "#133e87")};
		box-shadow: 0 0 0 2px
			${(props) =>
				props.isError ? "rgba(244, 67, 54, 0.1)" : "rgba(33, 150, 243, 0.1)"};
	}
`;

export const ErrorMessage = styled.div`
	font-size: 12px;
	color: #f44336;
	margin-top: 4px;
`;

export const AddButton = styled.button`
	padding: 10px 16px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: background-color 0.2s;
	height: fit-content;

	&:hover {
		background-color: #1952b3;
	}
`;

export const IPList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const IPItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px;
	background: #f5f5f5;
	border-radius: 6px;
	font-size: 14px;
	color: #1a1a1a;
`;

export const DeleteButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #f44336;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;

	&:hover {
		color: #d32f2f;
	}
`;

export const SaveButton = styled.button`
	padding: 10px 16px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover:not(:disabled) {
		background-color: #1952b3;
	}

	&:disabled {
		background-color: #ccc;
		cursor: not-allowed;
		opacity: 0.6;
	}
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

export const Modal = styled.div`
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 90%;
	max-width: 400px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 16px;
`;

export const ModalMessage = styled.p`
	font-size: 14px;
	color: #666;
	margin-bottom: 20px;
`;

export const ModalButtons = styled.div`
	display: flex;
	gap: 8px;
	justify-content: flex-end;
`;

export const CancelButton = styled.button`
	padding: 10px 16px;
	background: #e0e0e0;
	color: #333;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #d0d0d0;
	}
`;

export const ConfirmButton = styled.button`
	padding: 10px 16px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #1952b3;
	}
`;

export const DeleteConfirmButton = styled(ConfirmButton)`
	background: #f44336;

	&:hover {
		background-color: #d32f2f;
	}
`;
