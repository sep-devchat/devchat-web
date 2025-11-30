import styled from "styled-components";

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(15, 23, 42, 0.12);
	border-radius: 12px;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);

	@media (min-width: 1440px) {
		border: 0.8px solid rgba(15, 23, 42, 0.12);
		border-radius: 9.6px;
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
	}

	@media (min-width: 1920px) {
		border: 1px solid rgba(15, 23, 42, 0.12);
		border-radius: 12px;
		box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
	}

	@media (max-width: 1220px) {
		border: 0.7px solid rgba(15, 23, 42, 0.12);
		border-radius: 8.4px;
		box-shadow: 0 10.5px 24.5px rgba(15, 23, 42, 0.12);
	}

	@media (min-width: 1920px) {
		padding: 0.9rem 1.2rem;
		border-bottom: 1px solid rgba(15, 23, 42, 0.08);
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
	background: linear-gradient(135deg, #f8fafc 0%, #e8edf7 100%);
	flex-shrink: 0;
	position: relative;
	overflow: hidden;

	@media (min-width: 1440px) {
		padding: 0.6rem 0.8rem;
		border-bottom: 0.8px solid rgba(15, 23, 42, 0.08);
	}

	@media (max-width: 1220px) {
		padding: 0.525rem 0.7rem;
		border-bottom: 0.7px solid rgba(15, 23, 42, 0.08);
	}

	@media (min-width: 1920px) {
		padding: 0.6rem 0.8rem;
		border-bottom: 0.8px solid rgba(15, 23, 42, 0.08);
	}
`;

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.625rem;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		flex-wrap: wrap;
		gap: 0.4375rem;
	}
	@media (min-width: 1920px) {
		gap: 0.75rem;
	}
`;

export const CodeIcon = styled.div`
	width: 1.125rem;
	height: 1.125rem;
	color: #475569;
	display: flex;
	align-items: center;
	justify-content: center;

	@media (min-width: 1440px) {
		width: 0.9rem;
		height: 0.9rem;
	}

	@media (max-width: 1220px) {
		width: 0.7875rem;
		height: 0.7875rem;
	}

	@media (min-width: 1920px) {
		width: 1.35rem;
		height: 1.35rem;
	}
`;

export const Title = styled.span`
	font-size: 0.9375rem;
	font-weight: 600;
	color: #0f172a;
	text-shadow: none;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.65625rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.1rem;
	}
`;

export const UnsavedBadge = styled.span`
	font-size: 0.75rem;
	padding: 0.25rem 0.625rem;
	border-radius: 4px;
	background: rgba(251, 146, 60, 0.12);
	color: #b45309;
	border: 1px solid rgba(251, 146, 60, 0.24);
	font-weight: 600;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
		padding: 0.2rem 0.5rem;
		border-radius: 3.2px;
		border: 0.8px solid rgba(251, 146, 60, 0.24);
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
		padding: 0.175rem 0.4375rem;
		border-radius: 2.8px;
		border: 0.7px solid rgba(251, 146, 60, 0.24);
	}

	@media (min-width: 1920px) {
		font-size: 0.9rem;
		padding: 0.3rem 0.75rem;
		border-radius: 4.8px;
		border: 1px solid rgba(251, 146, 60, 0.24);
	}
`;

export const RevisionCountBadge = styled.span`
	display: inline-flex;
	align-items: center;
	font-size: 0.75rem;
	padding: 0.25rem 0.6rem;
	border-radius: 9999px;
	background: rgba(59, 130, 246, 0.12);
	color: #1d4ed8;
	border: 1px solid rgba(59, 130, 246, 0.24);
	font-weight: 600;
	white-space: nowrap;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
		padding: 0.2rem 0.48rem;
		border: 0.8px solid rgba(59, 130, 246, 0.24);
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
		padding: 0.175rem 0.42rem;
		border: 0.7px solid rgba(59, 130, 246, 0.24);
	}

	@media (min-width: 1920px) {
		font-size: 0.9rem;
		padding: 0.3rem 0.72rem;
		border: 1px solid rgba(59, 130, 246, 0.24);
	}
`;

export const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 0.625rem;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}

	@media (max-width: 1220px) {
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 0.4375rem;
	}

	@media (min-width: 1920px) {
		gap: 0.75rem;
	}
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
		gap: 0.45rem;
		padding: 0.6rem 1.2rem;
		border-radius: 9.6px;
		font-size: 0.8rem;
	}

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
	background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
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
		gap: 0.45rem;
		padding: 0.6rem 1.2rem;
		border-radius: 9.6px;
		font-size: 0.8rem;
	}

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

	@media (min-width: 1440px) {
		width: 0.7rem;
		height: 0.7rem;
	}

	@media (max-width: 1220px) {
		width: 0.6125rem;
		height: 0.6125rem;
	}

	@media (min-width: 1920px) {
		width: 1.05rem;
		height: 1.05rem;
	}
`;

export const CodeTextarea = styled.textarea<{ $readOnly: boolean }>`
	flex: 1;
	width: 100%;
	padding: 1.25rem;
	font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
	font-size: 0.9375rem;
	background: #f8fafc;
	color: #0f172a;
	resize: none;
	border: none;
	outline: none;
	overflow-y: auto;
	tab-size: 4;
	line-height: 1.6;
	cursor: ${(props) => (props.$readOnly ? "default" : "text")};

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
		padding: 1.5rem;
		font-size: 1.125rem;
		line-height: 1.92;
	}

	&::selection {
		background: rgba(123, 159, 232, 0.3);
	}

	&::-webkit-scrollbar {
		width: 10px;

		@media (min-width: 1440px) {
			width: 8px;
		}

		@media (max-width: 1220px) {
			width: 7px;
		}

		@media (min-width: 1920px) {
			width: 12px;
		}
	}

	&::-webkit-scrollbar-track {
		background: #1e293b;
		border-radius: 4px;

		@media (min-width: 1440px) {
			border-radius: 3.2px;
		}

		@media (max-width: 1220px) {
			border-radius: 2.8px;
		}

		@media (min-width: 1920px) {
			border-radius: 4.8px;
		}
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(100, 116, 139, 0.6);
		border-radius: 4px;
		transition: background 0.2s;

		@media (min-width: 1440px) {
			border-radius: 3.2px;
		}

		@media (max-width: 1220px) {
			border-radius: 2.8px;
		}

		@media (min-width: 1920px) {
			border-radius: 4.8px;
		}

		&:hover {
			background: rgba(100, 116, 139, 0.8);
		}
	}
`;

export const SavingBadge = styled.span`
	display: inline-flex;
	align-items: center;
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
	font-weight: 500;
	color: #1d4ed8;
	background-color: #e0edff;
	border-radius: 9999px;

	@media (min-width: 1440px) {
		padding: 0.2rem 0.4rem;
		font-size: 0.6rem;
	}

	@media (max-width: 1220px) {
		padding: 0.175rem 0.35rem;
		font-size: 0.525rem;
	}

	@media (min-width: 1920px) {
		padding: 0.3rem 0.6rem;
		font-size: 0.9rem;
	}
`;

export const ResetButton = styled.button<{ disabled?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 0.875rem;
	background-color: ${(props) => (props.disabled ? "#f3f4f6" : "#ffffff")};
	color: ${(props) => (props.disabled ? "#9ca3af" : "#6b7280")};
	border: 1px solid ${(props) => (props.disabled ? "#e5e7eb" : "#d1d5db")};
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	transition: all 0.2s;

	@media (min-width: 1440px) {
		gap: 0.3rem;
		padding: 0.4rem 0.7rem;
		border: 0.8px solid ${(props) => (props.disabled ? "#e5e7eb" : "#d1d5db")};
		border-radius: 0.4rem;
		font-size: 0.7rem;
	}

	@media (max-width: 1220px) {
		gap: 0.2625rem;
		padding: 0.35rem 0.6125rem;
		border: 0.7px solid ${(props) => (props.disabled ? "#e5e7eb" : "#d1d5db")};
		border-radius: 0.35rem;
		font-size: 0.6125rem;
	}

	@media (min-width: 1920px) {
		gap: 0.45rem;
		padding: 0.6rem 1.05rem;
		border: 1px solid ${(props) => (props.disabled ? "#e5e7eb" : "#d1d5db")};
		border-radius: 0.6rem;
		font-size: 0.8rem;
	}

	&:hover:not(:disabled) {
		background-color: #f9fafb;
		border-color: #9ca3af;
		color: #374151;
	}

	&:active:not(:disabled) {
		transform: scale(0.98);
	}

	svg {
		width: 1rem;
		height: 1rem;

		@media (min-width: 1440px) {
			width: 0.8rem;
			height: 0.8rem;
		}

		@media (max-width: 1220px) {
			width: 0.7rem;
			height: 0.7rem;
		}

		@media (min-width: 1920px) {
			width: 1.2rem;
			height: 1.2rem;
		}
	}
`;
