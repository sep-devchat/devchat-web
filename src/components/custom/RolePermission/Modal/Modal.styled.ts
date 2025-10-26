import styled, { keyframes } from "styled-components";

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

	::-webkit-scrollbar {
		width: 2px;
	}
`;

export const ModalContainer = styled.div`
	background-color: white;
	border-radius: 12px;
	width: 90%;
	max-width: 500px;
	max-height: 90vh;
	overflow: auto;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
	padding: 20px 24px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const ModalTitle = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	color: #666;
	display: flex;
	align-items: center;
	transition: color 0.2s;

	&:hover {
		color: #333;
	}
`;

export const ModalBody = styled.div`
	padding: 24px;
`;

export const FormGroup = styled.div`
	margin-bottom: 20px;
`;

export const Label = styled.label`
	display: block;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: 500;
	color: #333;
`;

export const Input = styled.input`
	width: 100%;
	padding: 10px 12px;
	font-size: 14px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	outline: none;
	transition: border-color 0.2s;
	box-sizing: border-box;

	&:focus {
		border-color: #133e87;
	}
`;

export const Textarea = styled.textarea`
	width: 100%;
	padding: 10px 12px;
	font-size: 14px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	outline: none;
	transition: border-color 0.2s;
	box-sizing: border-box;
	min-height: 80px;
	resize: vertical;

	&:focus {
		border-color: #133e87;
	}
`;

export const ColorGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 12px;
	margin-top: 8px;
`;

export const ColorOption = styled.button<{
	color: string;
	isSelected: boolean;
}>`
	width: 100%;
	aspect-ratio: 1;
	border-radius: 8px;
	background-color: ${(props) => props.color};
	border: ${(props) =>
		props.isSelected ? "3px solid #133e87" : "2px solid transparent"};
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: ${(props) =>
		props.isSelected ? "0 0 0 2px white, 0 0 0 4px #133e87" : "none"};

	&:hover {
		transform: scale(1.05);
	}
`;

export const IconGrid = styled.div`
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
`;

export const IconButton = styled.button<{ isSelected: boolean }>`
	padding: 10px;
	border: ${(props) =>
		props.isSelected ? "2px solid #133e87" : "1px solid #d1d5db"};
	border-radius: 6px;
	background: ${(props) => (props.isSelected ? "#eff6ff" : "white")};
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: all 0.2s;

	&:hover {
		background: #f9fafb;
	}
`;

export const PermissionItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 12px;
	background-color: #f8f9fb;
	border-radius: 6px;
	margin-bottom: 8px;
`;

export const PermissionText = styled.span`
	font-size: 14px;
	color: #333;
`;

export const RemoveButton = styled.button`
	background: none;
	border: none;
	color: #d83232;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: color 0.2s;

	&:hover {
		color: #991b1b;
	}

	&:focus {
		outline: none;
	}
`;

export const PermissionInputWrapper = styled.div`
	display: flex;
	gap: 8px;
	margin-top: 12px;
`;

export const ModalFooter = styled.div`
	padding: 16px 24px;
	border-top: 1px solid #e5e7eb;
	display: flex;
	justify-content: flex-end;
	gap: 12px;
`;

export const Button = styled.button<{
	variant?: "primary" | "secondary" | "danger";
}>`
	padding: 10px 20px;
	font-size: 14px;
	font-weight: 500;
	border-radius: 6px;
	border: none;
	cursor: pointer;
	transition: all 0.2s;
	white-space: nowrap;
	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	${(props) => {
		switch (props.variant) {
			case "danger":
				return `
                    background-color: #D83232;
                    color: white;
                    &:hover {
                        background-color: #991b1b;
                    }
                `;
			case "secondary":
				return `
                    background-color: transparent;
                    color: #666;
                    border: 1px solid #d1d5db;
                    &:hover {
                        background-color: #f9fafb;
                    }
                `;
			default:
				return `
                    background-color: #133e87;
                    color: white;
                    &:hover {
                        background-color: #1952b3;
                    }
                `;
		}
	}}
`;

export const DeleteModalContainer = styled(ModalContainer)`
	max-width: 400px;
`;

export const DeleteMessage = styled.p`
	font-size: 14px;
	color: #666;
	line-height: 1.6;
	margin: 0;
`;

export const WarningMessage = styled.p`
	font-size: 14px;
	color: #d83232;
	margin-top: 12px;
	font-weight: 500;
	margin-bottom: 0;
`;

export const SelectWrapper = styled.div`
	position: relative;
	width: 100%;
`;

export const CustomSelect = styled.div<{ $isOpen: boolean }>`
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: 1.5px solid ${(props) => (props.$isOpen ? "#3b82f6" : "#e5e7eb")};
	border-radius: 10px;
	font-size: 14px;
	color: #1f2937;
	background: ${(props) =>
		props.$isOpen ? "white" : "linear-gradient(to bottom, #ffffff, #f9fafb)"};
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: ${(props) =>
		props.$isOpen
			? "0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(0, 0, 0, 0.07)"
			: "0 1px 3px rgba(0, 0, 0, 0.05)"};
	user-select: none;

	&:hover {
		border-color: #3b82f6;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
	}
`;

const slideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const OptionsDropdown = styled.div`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	right: 0;
	background: white;
	border: 1.5px solid #e5e7eb;
	border-radius: 12px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	overflow: hidden;
	animation: ${slideDown} 0.2s ease-out;
`;

export const Option = styled.div<{ $isSelected: boolean; $isFirst?: boolean }>`
	padding: 12px 16px;
	font-size: 14px;
	color: #1f2937;
	font-weight: ${(props) => (props.$isSelected ? "600" : "500")};
	background: ${(props) =>
		props.$isSelected ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "white"};
	color: ${(props) => (props.$isSelected ? "white" : "#1f2937")};
	cursor: pointer;
	transition: all 0.2s ease;
	margin: 6px 8px;
	border-radius: 8px;
	min-height: 42px;
	display: flex;
	align-items: center;

	&:hover {
		background: ${(props) =>
			props.$isSelected
				? "linear-gradient(135deg, #3b82f6, #2563eb)"
				: "linear-gradient(to right, #dbeafe, #eff6ff)"};
		color: ${(props) => (props.$isSelected ? "white" : "#1e40af")};
		transform: translateX(4px);
	}

	&:active {
		transform: translateX(4px) scale(0.98);
	}
`;

export const SelectIcon = styled.div<{ $isOpen: boolean }>`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%)
		rotate(${(props) => (props.$isOpen ? "180deg" : "0deg")});
	color: #6b7280;
	pointer-events: none;
	transition: transform 0.3s ease;
`;
