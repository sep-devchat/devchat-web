import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	padding: 24px;
`;

export const Content = styled.div`
	width: 100%;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32px;
	gap: 24px;
	height: 55px;
`;

export const Title = styled.h1`
	font-size: 20px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 4px 0;
`;

export const Subtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin: 0;
`;

export const AddButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 8px 16px;
	background-color: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	white-space: nowrap;

	&:hover {
		background-color: #1952b3;
	}
`;

export const EnvironmentList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const Card = styled.div`
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	overflow: hidden;
`;

export const CardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #f3f4f6;
`;

export const CardHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const IconContainer = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 6px;
	background-color: #e0f2fe;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #0284c7;
	flex-shrink: 0;
`;

export const LanguageName = styled.div`
	font-size: 15px;
	font-weight: 600;
	color: #1a1a1a;
`;

export const StatusText = styled.div`
	font-size: 12px;
	color: #16a34a;
`;

export const Actions = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ToggleLabel = styled.label`
	position: relative;
	width: 44px;
	height: 24px;
	display: inline-block;
	cursor: pointer;
`;

export const ToggleInput = styled.input<{ $enabled: boolean }>`
	position: absolute;
	appearance: none;
	width: 100%;
	height: 100%;
	background-color: ${(props) => (props.$enabled ? "#1CCA93" : "#d1d5db")};
	border-radius: 12px;
	cursor: pointer;
	transition: background-color 0.3s;
	border: none;
	outline: none;
	margin: 0;
	padding: 0;
`;

export const ToggleSlider = styled.div<{ $enabled: boolean }>`
	position: absolute;
	top: 2px;
	left: ${(props) => (props.$enabled ? "22px" : "2px")};
	width: 20px;
	height: 20px;
	background-color: white;
	border-radius: 50%;
	transition: left 0.3s;
	pointer-events: none;
`;

export const ActionButton = styled.button`
	width: 36px;
	height: 36px;
	border: none;
	background-color: #f3f4f6;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;

	&:hover {
		background-color: #e5e7eb;
	}
`;

export const DeleteButton = styled(ActionButton)`
	color: #d83232;

	&:hover {
		background-color: #fee2e2;
	}
`;

export const CardDetails = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	padding: 16px;
	background-color: #fafafa;
`;

export const DetailLabel = styled.span`
	font-size: 12px;
	color: #6b7280;
	font-weight: 500;
`;

export const DetailValue = styled.div`
	font-size: 14px;
	color: #1a1a1a;
	font-weight: 500;
	margin-top: 4px;
`;

export const DetailStatus = styled.div<{ $enabled: boolean }>`
	font-size: 14px;
	color: ${(props) => (props.$enabled ? "#1CCA93" : "#6b7280")};
	font-weight: 500;
	margin-top: 4px;
`;

// Modal Styles
export const ModalOverlay = styled.div`
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

export const Modal = styled.div`
	background-color: white;
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	font-size: 24px;
	color: #6b7280;
	cursor: pointer;
	padding: 0;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		color: #1a1a1a;
	}
`;

export const ModalContent = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Label = styled.label`
	font-size: 14px;
	font-weight: 500;
	color: #1a1a1a;
`;

export const Required = styled.span`
	color: #d83232;
`;

export const Input = styled.input`
	margin-top: 8px;
	padding: 10px 12px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	color: #1a1a1a;
	width: 100%;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: #133e87;
	}
`;

export const FormRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
`;

export const CheckboxLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;
	font-size: 14px;
	color: #1a1a1a;
	user-select: none;
`;

export const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	padding: 16px 20px;
	border-top: 1px solid #e5e7eb;
	background-color: #fafafa;
`;

export const CancelButton = styled.button`
	padding: 8px 16px;
	border: 1px solid #d1d5db;
	background-color: white;
	color: #1a1a1a;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;

	&:hover {
		background-color: #f9fafb;
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

	&:hover {
		background-color: #1952b3;
	}
`;
