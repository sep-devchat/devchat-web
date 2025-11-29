import { theme } from "@/themes";
import styled from "styled-components";

export const PageWrapper = styled.div`
	height: 100%;
	width: 21.875rem;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-right: 1.125rem;
	background: ${theme.color.grey30};
	border-radius: 0 0.625rem 0.625rem 0;

	@media (max-width: 1220px) {
		width: 18.75rem;
		border-radius: 0 0.5rem 0.5rem 0;
	}

	@media (min-width: 1440px) {
		width: 20rem;
		border-radius: 0 0.75rem 0.75rem 0;
	}
`;

export const CPChatArea = styled.div`
	height: 100%;
	background: ${theme.color.grey10};
	border-bottom-right-radius: 0.625rem;

	@media (max-width: 1220px) {
		border-bottom-right-radius: 0.625rem;
	}

	@media (min-width: 1440px) {
		border-bottom-right-radius: 0.625rem;
	}
`;

export const MemberContent = styled.div`
	flex: 1;
	padding: 1rem;
	overflow: visible;

	@media (max-width: 1220px) {
		padding: 0.875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.75rem;
	}
`;

export const MemberSection = styled.div`
	margin-bottom: 1.5rem;

	@media (max-width: 1220px) {
		margin-bottom: 1.25rem;
	}

	@media (min-width: 1440px) {
		margin-bottom: 1.5rem;
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.75rem;

	@media (max-width: 1220px) {
		margin-bottom: 0.625rem;
	}

	@media (min-width: 1440px) {
		margin-bottom: 0.5rem;
	}
`;

export const SectionTitle = styled.h3`
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: ${theme.color.grey90 || "#374151"};
	letter-spacing: 0.03125rem;

	@media (max-width: 1220px) {
		font-size: 0.875rem;
		letter-spacing: 0.025rem;
	}

	@media (min-width: 1440px) {
		font-size: 1rem;
		letter-spacing: 0.03125rem;
	}
`;

export const MemberCount = styled.span`
	background: ${theme.color.grey90 || "#9CA3AF"};
	color: white;
	border-radius: 0.75rem;
	padding: 0.125rem 0.5rem;
	font-size: 0.75rem;
	font-weight: 500;
	min-width: 1.25rem;
	text-align: center;

	@media (max-width: 1220px) {
		border-radius: 0.625rem;
		padding: 0.0625rem 0.375rem;
		font-size: 0.6875rem;
		min-width: 1.125rem;
	}

	@media (min-width: 1440px) {
		border-radius: 1rem;
		padding: 0.1875rem 0.625rem;
		font-size: 0.8rem;
		min-width: 1.1rem;
	}
`;

export const MembersList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	@media (max-width: 1220px) {
		gap: 0.375rem;
	}

	@media (min-width: 1440px) {
		gap: 0.625rem;
	}
`;

export const CPHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 3.25rem;
	padding: 0.875rem 0.75rem;
	background: ${theme.color.grey30};
	border-top-right-radius: 0.625rem;

	@media (max-width: 1220px) {
		height: 3rem;
		padding: 0.75rem 0.625rem;
		border-top-right-radius: 0.5rem;
	}

	@media (min-width: 1440px) {
		height: 3.2rem;
		padding: 1rem 0.5rem;
		border-top-right-radius: 0.75rem;
	}
`;

export const CPHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;

	@media (max-width: 1220px) {
		gap: 0.625rem;
	}

	@media (min-width: 1440px) {
		gap: 1rem;
	}
`;

export const CPHeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	@media (max-width: 1220px) {
		gap: 0.375rem;
	}

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}
`;

export const CPHash = styled.div`
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 0.5rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	box-shadow: 0 0.125rem 0.5rem rgba(102, 126, 234, 0.3);

	@media (max-width: 1220px) {
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
		box-shadow: 0 0.0625rem 0.375rem rgba(102, 126, 234, 0.3);
	}

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.625rem;
		box-shadow: 0 0.1875rem 0.625rem rgba(102, 126, 234, 0.3);
	}
`;

export const CPTitle = styled.h2`
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
	color: ${theme.color.grey90 || "#1f2937"};
	letter-spacing: -0.01875rem;

	@media (max-width: 1220px) {
		font-size: 1rem;
		letter-spacing: -0.015rem;
	}

	@media (min-width: 1440px) {
		font-size: 1.25rem;
		letter-spacing: -0.0225rem;
	}
`;

export const CPHeaderIcon = styled.button`
	width: 2.25rem;
	height: 2.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.5rem;
	background: transparent;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		color: ${theme.color.grey90 || "#374151"};
	}

	&:active {
		transform: scale(0.95);
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
	}

	@media (min-width: 1440px) {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.625rem;
	}
`;

export const SearchContainer = styled.div`
	position: relative;
	width: 100%;
`;

export const SearchIconWrapper = styled.div`
	position: absolute;
	left: -0.1875rem;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
	pointer-events: none;
	display: flex;
	align-items: center;
`;

export const Input = styled.input<{ error?: boolean }>`
	width: 100%;
	padding: 0.75rem 0.875rem;
	border: 0.0625rem solid ${(props) => (props.error ? "#D83232" : "#e5e7eb")};
	border-radius: 0.5rem;
	font-size: 0.875rem;
	color: #374151;
	transition: all 0.2s;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: ${(props) => (props.error ? "#D83232" : "#133e87")};
		box-shadow: 0 0 0 0.1875rem
			${(props) =>
				props.error ? "rgba(220, 38, 38, 0.1)" : "rgba(37, 99, 235, 0.1)"};
	}

	&::placeholder {
		color: #9ca3af;
	}

	@media (max-width: 1220px) {
		padding: 0.625rem 0.75rem;
		border-radius: 0.375rem;
		font-size: 0.8125rem;
	}

	@media (min-width: 1440px) {
		padding: 0.875rem 1rem;
		border-radius: 0.625rem;
		font-size: 0.875rem;
	}
`;

export const SearchInput = styled(Input)<{ prefix?: React.ReactNode }>`
	width: 17.5rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	border: 0.0625rem solid rgba(25, 82, 179, 0.21);
	background: rgba(32, 102, 223, 0.09);
	font-size: 0.875rem;
	color: #1f2937;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: rgba(25, 82, 179, 0.4);
		background: rgba(32, 102, 223, 0.12);
		box-shadow: 0 0 0 0.1875rem rgba(32, 102, 223, 0.1);
	}

	&::placeholder {
		color: #9ca3af;
		font-size: 0.875rem;
	}

	&:hover:not(:focus) {
		border-color: rgba(25, 82, 179, 0.3);
	}

	@media (max-width: 1220px) {
		width: 26rem;
		padding: 0.375rem 0.625rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;

		&::placeholder {
			font-size: 0.8125rem;
		}
	}

	@media (min-width: 1440px) {
		width: 17rem;
		font-size: 0.875rem;
		border-radius: 0.5rem;

		&::placeholder {
			font-size: 0.875rem;
		}
	}
`;
