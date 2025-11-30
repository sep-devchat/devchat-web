// ChangeHistory.styled.ts
import styled from "styled-components";

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background: linear-gradient(to bottom, #f7f9fc, #e8f0fc);
	border-radius: 0;
	overflow: hidden;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.08),
		0 2px 4px -1px rgba(0, 0, 0, 0.04);

	@media (min-width: 1440px) {
		box-shadow:
			0 3.2px 4.8px -0.8px rgba(0, 0, 0, 0.08),
			0 1.6px 3.2px -0.8px rgba(0, 0, 0, 0.04);
	}

	@media (max-width: 1220px) {
		box-shadow:
			0 2.8px 4.2px -0.7px rgba(0, 0, 0, 0.08),
			0 1.4px 2.8px -0.7px rgba(0, 0, 0, 0.04);
	}

	@media (min-width: 1920px) {
		box-shadow:
			0 4.4px 6.6px -1.1px rgba(0, 0, 0, 0.08),
			0 2.2px 4.4px -1.1px rgba(0, 0, 0, 0.04);
	}
`;

export const Header = styled.div`
	padding: 1rem;
	border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	flex-shrink: 0;
	background: #eff4fc;
	position: relative;
	overflow: hidden;

	@media (min-width: 1440px) {
		padding: 0.8rem;
		border-bottom: 0.8px solid rgba(209, 224, 253, 0.5);
	}

	@media (max-width: 1220px) {
		padding: 0.7rem;
		border-bottom: 0.7px solid rgba(209, 224, 253, 0.5);
	}

	@media (min-width: 1920px) {
		padding: 1.1rem;
		border-bottom: 1px solid rgba(209, 224, 253, 0.5);
	}
`;

export const HeaderTitle = styled.h3`
	font-weight: 500;
	font-size: 1rem;
	line-height: 1rem;
	color: #27364b;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		font-size: 0.8rem;
		line-height: 0.8rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.7rem;
		line-height: 0.7rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.1rem;
		line-height: 1.1rem;
	}
`;

export const HeaderSubtitle = styled.p`
	font-size: 0.75rem;
	margin-top: 0.375rem;
	color: #666;
	position: relative;
	z-index: 1;
	font-weight: 100;

	@media (min-width: 1440px) {
		font-size: 0.6rem;
		margin-top: 0.3rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.525rem;
		margin-top: 0.2625rem;
	}

	@media (min-width: 1920px) {
		font-size: 0.825rem;
		margin-top: 0.4125rem;
	}
`;

export const ListContainer = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	padding: 1rem;

	@media (min-width: 1440px) {
		gap: 0.5rem;
		padding: 0.8rem;
	}

	@media (max-width: 1220px) {
		gap: 0.4375rem;
		padding: 0.7rem;
	}

	@media (min-width: 1920px) {
		gap: 0.6875rem;
		padding: 1.1rem;
	}

	&::-webkit-scrollbar {
		width: 8px;

		@media (min-width: 1440px) {
			width: 6.4px;
		}

		@media (max-width: 1220px) {
			width: 5.6px;
		}

		@media (min-width: 1920px) {
			width: 8.8px;
		}
	}

	&::-webkit-scrollbar-track {
		background: rgba(209, 224, 253, 0.3);
		border-radius: 4px;

		@media (min-width: 1440px) {
			border-radius: 3.2px;
		}

		@media (max-width: 1220px) {
			border-radius: 2.8px;
		}

		@media (min-width: 1920px) {
			border-radius: 4.4px;
		}
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(166, 194, 242, 0.5);
		border-radius: 4px;
		transition: background 0.2s;

		@media (min-width: 1440px) {
			border-radius: 3.2px;
		}

		@media (max-width: 1220px) {
			border-radius: 2.8px;
		}

		@media (min-width: 1920px) {
			border-radius: 4.4px;
		}

		&:hover {
			background: rgba(166, 194, 242, 0.7);
		}
	}
`;

export const ChangeButton = styled.button`
	width: 100%;
	text-align: left;
	padding: 1rem;
	border-radius: 10px;
	border: 1px solid rgba(209, 224, 253, 0.6);
	background: #ffffff;
	cursor: pointer;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 1px 3px rgba(123, 159, 232, 0.08);
	position: relative;
	overflow: hidden;

	@media (min-width: 1440px) {
		padding: 0.8rem;
		border-radius: 8px;
		border: 0.8px solid rgba(209, 224, 253, 0.6);
		box-shadow: 0 0.8px 2.4px rgba(123, 159, 232, 0.08);
	}

	@media (max-width: 1220px) {
		padding: 0.7rem;
		border-radius: 7px;
		border: 0.7px solid rgba(209, 224, 253, 0.6);
		box-shadow: 0 0.7px 2.1px rgba(123, 159, 232, 0.08);
	}

	@media (min-width: 1920px) {
		padding: 1.1rem;
		border-radius: 11px;
		border: 1px solid rgba(209, 224, 253, 0.6);
		box-shadow: 0 1.1px 3.3px rgba(123, 159, 232, 0.08);
	}

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(166, 194, 242, 0.12),
			transparent
		);
		transition: left 0.5s;
	}

	&:hover {
		background: linear-gradient(
			135deg,
			rgba(209, 224, 253, 0.3) 0%,
			rgba(166, 194, 242, 0.2) 100%
		);
		border-color: rgba(123, 159, 232, 0.4);
		box-shadow: 0 4px 12px rgba(123, 159, 232, 0.2);
		transform: translateY(-2px);

		@media (min-width: 1440px) {
			box-shadow: 0 3.2px 9.6px rgba(123, 159, 232, 0.2);
			transform: translateY(-1.6px);
		}

		@media (max-width: 1220px) {
			box-shadow: 0 2.8px 8.4px rgba(123, 159, 232, 0.2);
			transform: translateY(-1.4px);
		}

		@media (min-width: 1920px) {
			box-shadow: 0 4.4px 13.2px rgba(123, 159, 232, 0.2);
			transform: translateY(-2.2px);
		}

		&::before {
			left: 100%;
		}
	}

	&:active {
		transform: translateY(0);
	}

	&:focus {
		outline: none;
	}
`;

export const ChangeContent = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.875rem;
	position: relative;
	z-index: 1;

	@media (min-width: 1440px) {
		gap: 0.7rem;
	}

	@media (max-width: 1220px) {
		gap: 0.6125rem;
	}

	@media (min-width: 1920px) {
		gap: 0.9625rem;
	}
`;

export const UserIconContainer = styled.div`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	@media (min-width: 1440px) {
		width: 2rem;
		height: 2rem;
	}

	@media (max-width: 1220px) {
		width: 1.75rem;
		height: 1.75rem;
	}

	@media (min-width: 1920px) {
		width: 2.75rem;
		height: 2.75rem;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 1px solid #d1e0fd;

		@media (min-width: 1440px) {
			border: 0.8px solid #d1e0fd;
		}

		@media (max-width: 1220px) {
			border: 0.7px solid #d1e0fd;
		}

		@media (min-width: 1920px) {
			border: 1px solid #d1e0fd;
		}
	}
`;

export const UserInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

export const UserName = styled.p`
	font-weight: 600;
	font-size: 0.9375rem;
	line-height: 1.375rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #2c3e50;
	transition: color 0.2s;

	@media (min-width: 1440px) {
		font-size: 0.75rem;
		line-height: 1.1rem;
	}

	@media (max-width: 1220px) {
		font-size: 0.65625rem;
		line-height: 0.9625rem;
	}

	@media (min-width: 1920px) {
		font-size: 1.03125rem;
		line-height: 1.5125rem;
	}

	${ChangeButton}:hover & {
		color: #5a7fb8;
	}
`;

export const TimeInfo = styled.div`
	display: flex;
	font-weight: 400;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.375rem;
	font-size: 0.8125rem;
	line-height: 1.125rem;
	color: #6b7c93;

	@media (min-width: 1440px) {
		gap: 0.4rem;
		margin-top: 0.3rem;
		font-size: 0.65rem;
		line-height: 0.9rem;
	}

	@media (max-width: 1220px) {
		gap: 0.35rem;
		margin-top: 0.2625rem;
		font-size: 0.56875rem;
		line-height: 0.7875rem;
	}

	@media (min-width: 1920px) {
		gap: 0.55rem;
		margin-top: 0.4125rem;
		font-size: 0.89375rem;
		line-height: 1.2375rem;
	}

	svg {
		color: #8ba3c7;
	}
`;

export const CompareIcon = styled.div`
	width: 1.125rem;
	height: 1.125rem;
	color: #7b9fe8;
	opacity: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	transform: translateX(-8px);

	@media (min-width: 1440px) {
		width: 0.9rem;
		height: 0.9rem;
		transform: translateX(-6.4px);
	}

	@media (max-width: 1220px) {
		width: 0.7875rem;
		height: 0.7875rem;
		transform: translateX(-5.6px);
	}

	@media (min-width: 1920px) {
		width: 1.2375rem;
		height: 1.2375rem;
		transform: translateX(-8.8px);
	}

	${ChangeButton}:hover & {
		opacity: 1;
		transform: translateX(0);

		@media (min-width: 1920px) {
			transform: translateX(0);
		}
	}
`;

export const DeleteButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.375rem;
	background: transparent;
	border: none;
	border-radius: 0.375rem;
	color: #94a3b8;
	cursor: pointer;
	transition: all 0.2s;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		padding: 0.3rem;
		border-radius: 0.3rem;
	}

	@media (max-width: 1220px) {
		padding: 0.2625rem;
		border-radius: 0.2625rem;
	}

	@media (min-width: 1920px) {
		padding: 0.4125rem;
		border-radius: 0.4125rem;
	}

	&:hover {
		background: #fee2e2;
		color: #dc2626;
	}

	&:focus {
		outline: none;
	}

	&:active {
		transform: scale(0.95);
	}
`;

export const EditButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.375rem;
	background: transparent;
	border: none;
	border-radius: 0.375rem;
	color: #94a3b8;
	cursor: pointer;
	transition: all 0.2s;
	flex-shrink: 0;

	@media (min-width: 1440px) {
		padding: 0.3rem;
		border-radius: 0.3rem;
	}

	@media (max-width: 1220px) {
		padding: 0.2625rem;
		border-radius: 0.2625rem;
	}

	@media (min-width: 1920px) {
		padding: 0.4125rem;
		border-radius: 0.4125rem;
	}

	&:hover {
		background: #fefee2ff;
		color: #dcbb26ff;
	}

	&:focus {
		outline: none;
	}

	&:active {
		transform: scale(0.95);
	}
`;
