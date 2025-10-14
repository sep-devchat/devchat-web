import styled from "styled-components";

export const DropdownOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
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
`;

export const DropdownHeader = styled.div`
	padding: 16px 20px;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	align-items: center;
	gap: 10px;
	background: white;
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
`;

export const SearchContainer = styled.div`
	padding: 12px 16px;
	border-bottom: 1px solid #e5e7eb;
	background: white;
`;

export const SearchWrapper = styled.div`
	position: relative;
	display: flex;
	gap: 8px;
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
`;

export const SearchIcon = styled.div`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
	pointer-events: none;
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
`;

export const SectionTitle = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: #6b7280;
	text-transform: uppercase;
	margin-bottom: 12px;
	letter-spacing: 0.5px;
`;

export const ThreadsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
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
`;

export const ThreadItemHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 8px;
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
`;

export const ThreadMeta = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: #6b7280;
`;

export const AuthorInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
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
`;

export const AuthorIconInner = styled.div`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: white;
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
`;

export const EmptyState = styled.div`
	padding: 40px 20px;
	text-align: center;
	color: #9ca3af;
`;

export const EmptyIcon = styled.div`
	font-size: 48px;
	margin-bottom: 16px;
	opacity: 0.5;
`;

export const EmptyText = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 0;
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
`;
