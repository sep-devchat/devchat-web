import styled from "styled-components";

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(209, 224, 253, 0.6);
	border-radius: 12px;
	overflow: hidden;
	background: #0f172a;
	box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	border-bottom: 1px solid rgba(100, 116, 139, 0.3);
	background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
	flex-shrink: 0;
	position: relative;
	overflow: hidden;
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.625rem;
	position: relative;
	z-index: 1;
`;

export const CodeIcon = styled.div`
	width: 1.125rem;
	height: 1.125rem;
	color: #94a3b8;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Title = styled.span`
	font-size: 0.9375rem;
	font-weight: 600;
	color: #e2e8f0;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export const UnsavedBadge = styled.span`
	font-size: 0.75rem;
	padding: 0.25rem 0.625rem;
	border-radius: 12px;
	background: linear-gradient(
		135deg,
		rgba(251, 146, 60, 0.15) 0%,
		rgba(249, 115, 22, 0.15) 100%
	);
	color: #fb923c;
	border: 1px solid rgba(251, 146, 60, 0.3);
	font-weight: 600;
`;

export const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 0.625rem;
	position: relative;
	z-index: 1;
`;

export const SaveButton = styled.button<{ $disabled: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	background: ${(props) =>
		props.$disabled
			? "linear-gradient(135deg, #475569 0%, #64748b 100%)"
			: "linear-gradient(135deg, #7B9FE8 0%, #A6C2F2 100%)"};
	color: #ffffff;
	font-size: 0.8125rem;
	font-weight: 600;
	border: none;
	cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

	&:active:not(:disabled) {
		transform: translateY(0);
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

export const PlayIcon = styled.div`
	width: 0.875rem;
	height: 0.875rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const CodeTextarea = styled.textarea<{ $readOnly: boolean }>`
	flex: 1;
	width: 100%;
	padding: 1.25rem;
	font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
	font-size: 0.9375rem;
	background: #0f172a;
	color: #e2e8f0;
	resize: none;
	border: none;
	outline: none;
	overflow-y: auto;
	tab-size: 4;
	line-height: 1.6;
	cursor: ${(props) => (props.$readOnly ? "default" : "text")};

	&::selection {
		background: rgba(123, 159, 232, 0.3);
	}

	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-webkit-scrollbar-track {
		background: #1e293b;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(100, 116, 139, 0.6);
		border-radius: 4px;
		transition: background 0.2s;

		&:hover {
			background: rgba(100, 116, 139, 0.8);
		}
	}
`;
