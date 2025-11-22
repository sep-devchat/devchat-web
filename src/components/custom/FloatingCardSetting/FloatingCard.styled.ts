import styled from "styled-components";

export const Wrapper = styled.div`
	max-width: 48rem;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	box-shadow: 0 1px 8px 4px rgba(0, 0, 0, 0.12);
	padding: 0.75rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	box-sizing: border-box;
	z-index: 100;
	position: absolute;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%);

	@media (max-width: 1220px) {
		max-width: calc(100% - 2rem);
		width: calc(100% - 2rem);
		bottom: 16px;
		padding: 0.625rem 0.875rem;
		gap: 0.75rem;
		flex-direction: row;
		align-items: center;
	}

	@media (max-width: 768px) {
		max-width: calc(100% - 1.5rem);
		width: calc(100% - 1.5rem);
		bottom: 16px;
		padding: 0.5rem 0.75rem;
		gap: 0.625rem;
		flex-direction: column;
		align-items: stretch;
	}

	@media (max-width: 480px) {
		max-width: calc(100% - 1rem);
		width: calc(100% - 1rem);
		bottom: 12px;
		padding: 0.5rem 0.625rem;
		gap: 0.5rem;
		border-radius: 0.375rem;
	}

	.flex.items-start {
		@media (max-width: 1220px) {
			gap: 0.625rem;
		}

		@media (max-width: 768px) {
			gap: 0.5rem;
			width: 100%;
		}
	}

	.flex-shrink-0 {
		@media (max-width: 768px) {
			margin-top: 0;
		}
	}

	.text-sm {
		@media (max-width: 1220px) {
			font-size: 0.8125rem;
			line-height: 1.25rem;
		}

		@media (max-width: 768px) {
			font-size: 0.75rem;
			line-height: 1.125rem;
			white-space: normal;
			overflow: visible;
			text-overflow: initial;
		}

		@media (max-width: 480px) {
			font-size: 0.6875rem;
		}
	}

	.flex.items-center.gap-3 {
		@media (max-width: 1220px) {
			gap: 0.5rem;
		}

		@media (max-width: 768px) {
			width: 100%;
			justify-content: flex-end;
			gap: 0.375rem;
		}

		@media (max-width: 480px) {
			flex-direction: column;
			gap: 0.375rem;
		}

		button {
			@media (max-width: 1220px) {
				padding: 0.375rem 0.75rem;
				font-size: 0.8125rem;
				white-space: nowrap;
			}

			@media (max-width: 768px) {
				padding: 0.375rem 0.625rem;
				font-size: 0.75rem;
			}

			@media (max-width: 480px) {
				width: 100%;
				padding: 0.5rem;
				font-size: 0.75rem;
			}
		}
	}
`;
