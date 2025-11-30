import styled from "styled-components";

export const DropdownOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	@media (max-width: 1220px) {
		margin-top: 5.6px;
		max-width: 280px;
		max-height: 420px;
		border-radius: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-top: 6.4px;
		max-width: 340px;
		max-height: 480px;
		border-radius: 9.6px;
	}

	@media (min-width: 1920px) {
		margin-top: 8.8px;
		max-width: 440px;
		max-height: 660px;
		border-radius: 13.2px;
	}
`;

export const ThreadDropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 8px;
	width: 480px;
	max-height: 600px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	display: flex;
	flex-direction: column;
	z-index: 1000;
	overflow: hidden;

	@media (max-width: 1220px) {
		width: 380px;
		max-height: 400px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 480px;
		max-height: 600px;
	}

	@media (min-width: 1920px) {
		width: 520px;
		max-height: 660px;
	}
`;

export const DropdownHeader = styled.div`
	padding: 16px 20px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	align-items: center;
	gap: 10px;
	background: white;

	@media (max-width: 1220px) {
		padding: 11.2px 14px;
		gap: 7px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px 16px;
		gap: 8px;
	}

	@media (min-width: 1920px) {
		padding: 17.6px 22px;
		gap: 11px;
	}
`;

export const HeaderIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
`;

export const Title = styled.h2`
	font-size: 16px;
	font-weight: 600;
	color: #111827;
	margin: 0;
	flex: 1;

	@media (max-width: 1220px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (min-width: 1920px) {
		font-size: 18px;
	}
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	border-radius: 4px;
	transition: all 0.2s;

	&:hover {
		background: #f3f4f6;
		color: #111827;
	}

	@media (max-width: 1220px) {
		padding: 2.8px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;

export const SearchContainer = styled.div`
	padding: 12px 16px;
	border-bottom: 1px solid #e5e7eb;
	background: white;

	@media (max-width: 1220px) {
		padding: 8.4px 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px 12.8px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px 17.6px;
	}
`;

export const SearchWrapper = styled.div`
	position: relative;
	display: flex;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const SearchInput = styled.input`
	flex: 1;
	padding: 8px 12px 8px 36px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	outline: none;
	transition: all 0.2s;

	&::placeholder {
		color: #9ca3af;
	}

	&:focus {
		border-color: #133e87;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	@media (max-width: 1220px) {
		padding: 5.6px 8.4px 5.6px 25.2px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 9.6px 6.4px 28.8px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 13.2px 8.8px 39.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const SearchIcon = styled.div`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
	pointer-events: none;

	@media (max-width: 1220px) {
		left: 8.4px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		left: 9.6px;
	}

	@media (min-width: 1920px) {
		left: 13.2px;
	}
`;

export const CreateButton = styled.button`
	padding: 8px 16px;
	background: #133e87;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	white-space: nowrap;

	&:hover {
		background: #1952b3;
	}

	&:active {
		transform: scale(0.98);
	}

	@media (max-width: 1220px) {
		padding: 5.6px 11.2px;
		border-radius: 4.2px;
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 6.4px 12.8px;
		border-radius: 4.8px;
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		padding: 8.8px 17.6px;
		border-radius: 6.6px;
		font-size: 16px;
	}
`;

export const ThreadsSection = styled.div`
	padding: 16px;
	flex: 1;
	overflow-y: auto;
	max-height: 450px;

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
	}

	&::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}

	@media (max-width: 1220px) {
		padding: 11.2px;
		max-height: 315px;

		&::-webkit-scrollbar {
			width: 5.6px;
		}

		&::-webkit-scrollbar-track {
			border-radius: 2.8px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 2.8px;
		}
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 12.8px;
		max-height: 360px;

		&::-webkit-scrollbar {
			width: 6.4px;
		}

		&::-webkit-scrollbar-track {
			border-radius: 3.2px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 3.2px;
		}
	}

	@media (min-width: 1920px) {
		padding: 17.6px;
		max-height: 495px;

		&::-webkit-scrollbar {
			width: 8.8px;
		}

		&::-webkit-scrollbar-track {
			border-radius: 4.4px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 4.4px;
		}
	}
`;

export const SectionTitle = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	margin-bottom: 12px;
	letter-spacing: 0.5px;

	@media (max-width: 1220px) {
		font-size: 11px;
		margin-bottom: 8.4px;
		letter-spacing: 0.35px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
		margin-bottom: 9.6px;
		letter-spacing: 0.4px;
	}

	@media (min-width: 1920px) {
		font-size: 14px;
		margin-bottom: 13.2px;
		letter-spacing: 0.55px;
	}
`;

export const ThreadsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	@media (max-width: 1220px) {
		gap: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
	}
`;

export const ThreadItem = styled.div<{ isActive?: boolean }>`
	padding: 12px;
	border: 1px solid ${(props) => (props.isActive ? "#133E87" : "#e5e7eb")};
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s;
	background: ${(props) => (props.isActive ? "#eff6ff" : "white")};

	&:hover {
		border-color: #133e87;
		background: #f9fafb;
	}

	@media (max-width: 1220px) {
		padding: 8.4px;
		border-radius: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 9.6px;
		border-radius: 6.4px;
	}

	@media (min-width: 1920px) {
		padding: 13.2px;
		border-radius: 8.8px;
	}
`;

export const ThreadItemHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 8px;

	@media (max-width: 1220px) {
		margin-bottom: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		margin-bottom: 6.4px;
	}

	@media (min-width: 1920px) {
		margin-bottom: 8.8px;
	}
`;

export const ThreadInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

export const ThreadName = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #111827;
	margin-bottom: 4px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
		margin-bottom: 3.2px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 4.4px;
	}
`;

export const ThreadMeta = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: #6b7280;

	@media (max-width: 1220px) {
		gap: 5.6px;
		font-size: 11px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 6.4px;
		font-size: 12px;
	}

	@media (min-width: 1920px) {
		gap: 8.8px;
		font-size: 14px;
	}
`;

export const AuthorInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;

	@media (max-width: 1220px) {
		gap: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		gap: 3.2px;
	}

	@media (min-width: 1920px) {
		gap: 4.4px;
	}
`;

export const AuthorIcon = styled.div`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #ef4444;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	@media (max-width: 1220px) {
		width: 11.2px;
		height: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 12.8px;
		height: 12.8px;
	}

	@media (min-width: 1920px) {
		width: 17.6px;
		height: 17.6px;
	}
`;

export const AuthorIconInner = styled.div`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: white;

	@media (max-width: 1220px) {
		width: 5.6px;
		height: 5.6px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 6.4px;
		height: 6.4px;
	}

	@media (min-width: 1920px) {
		width: 8.8px;
		height: 8.8px;
	}
`;

export const AuthorName = styled.span`
	font-weight: 500;
`;

export const TimeStamp = styled.span`
	color: #9ca3af;
`;

export const ThreadDescription = styled.div`
	font-size: 13px;
	color: #4b5563;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 15px;
	}
`;

export const EmptyState = styled.div`
	padding: 40px 20px;
	text-align: center;
	color: #9ca3af;

	@media (max-width: 1220px) {
		padding: 28px 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 32px 16px;
	}

	@media (min-width: 1920px) {
		padding: 44px 22px;
	}
`;

export const EmptyIcon = styled.div`
	font-size: 48px;
	margin-bottom: 16px;
	opacity: 0.5;

	@media (max-width: 1220px) {
		font-size: 33.6px;
		margin-bottom: 11.2px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 38.4px;
		margin-bottom: 12.8px;
	}

	@media (min-width: 1920px) {
		font-size: 52.8px;
		margin-bottom: 17.6px;
	}
`;

export const EmptyText = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 0;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const EditButton = styled.button`
	background: none;
	border: none;
	padding: 4px;
	color: #6b7280;
	cursor: pointer;
	transition: all 0.2s;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: all 0.2s;
	flex-shrink: 0;

	${ThreadItem}:hover & {
		opacity: 1;
	}

	&:hover {
		color: #2563eb;
		background: #dbeafe;
	}

	&:active {
		color: #1d4ed8;
		background: #bfdbfe;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 2.8px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;

export const DeleteButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ef4444;
	border-radius: 4px;
	opacity: 0;
	transition: all 0.2s;
	flex-shrink: 0;

	${ThreadItem}:hover & {
		opacity: 1;
	}

	&:hover {
		background: #fee2e2;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 2.8px;
		border-radius: 2.8px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 3.2px;
		border-radius: 3.2px;
	}

	@media (min-width: 1920px) {
		padding: 4.4px;
		border-radius: 4.4px;
	}
`;
