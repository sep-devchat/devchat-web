import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	margin: 0 auto;
`;

export const Header = styled.div`
	background: white;
	border-bottom: 0.0625rem solid #e1e5e9;
	padding: 0;
	background: #e2e8f0;
`;

// export const NavTabs = styled.div`
// 	display: flex;
// 	align-items: center;
// 	padding: 0.75rem 1.25rem;

// 	@media (max-width: 1220px) {
// 		padding: 0.625rem 1rem;
// 	}

// 	@media (min-width: 1440px) {
// 		padding: 0.875rem 1.5rem;
// 	}
// `;

// export const NavTab = styled.button<{ active?: boolean }>`
// 	background: none;
// 	border: none;
// 	padding: 0.25rem 1.25rem;
// 	margin-right: 1rem;
// 	font-size: 0.875rem;
// 	border: 0.0625rem solid #cbd4e1;
// 	cursor: pointer;
// 	border-radius: 0.375rem;
// 	transition: all 0.2s ease;
// 	font-size: 1rem;
// 	font-weight: 600;
// 	color: #1e2a3b;
// 	background: ${(props) => (props.active ? "#ffffff" : "transparent")};
// 	border: ${(props) =>
// 		props.active ? "0.0625rem solid #ffffff" : "0.0625rem solid #CBD4E1"};

// 	&:focus {
// 		outline: none;
// 		box-shadow: none;
// 	}

// 	&:hover {
// 		border: none;
// 	}

// 	@media (max-width: 1220px) {
// 		padding: 0.1875rem 1rem;
// 		margin-right: 0.75rem;
// 		font-size: 0.875rem;
// 		border-radius: 0.3125rem;
// 	}

// 	@media (min-width: 1440px) {
// 		padding: 0.3125rem 1.5rem;
// 		margin-right: 1.25rem;
// 		font-size: 1.125rem;
// 		border-radius: 0.5rem;
// 	}
// `;

export const Content = styled.div`
	padding: 1.5rem 1.25rem;
	flex: 1;
	overflow-y: auto;
	height: calc(100vh - 8.125rem);
	overflow-x: hidden;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}

	-webkit-overflow-scrolling: touch;

	//note

	@media (max-width: 1220px) {
		padding: 1.25rem 1rem;
		height: calc(100vh - 7.5rem);
	}

	@media (min-width: 1440px) {
		padding: 1rem;
		height: calc(100vh - 9rem);
	}
`;

export const Title = styled.h2`
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 0.25rem 0;

	@media (min-width: 1920px) {
		font-size: 18px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 15px;
	}

	@media (max-width: 1220px) {
		font-size: 14px;
	}
`;

export const Subtitle = styled.p`
	font-size: 0.875rem;
	color: #666;
	margin: 0 0 1.25rem 0;

	@media (min-width: 1920px) {
		font-size: 16px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}
`;

export const SearchContainer = styled.div`
	display: flex;
	align-items: center;
	background: white;
	border: 0.0625rem solid #cbd4e1;
	border-radius: 0.5rem;
	padding: 0.75rem 1rem;
	margin-bottom: 1rem;
	gap: 0.75rem;
	height: 3.4375rem;

	@media (max-width: 1220px) {
		padding: 10px 0.875rem;
		margin-bottom: 0.875rem;
		gap: 0.625rem;
		height: 2.5rem;
		border-radius: 0.5rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		padding: 10px 1rem;
		margin-bottom: 0.875rem;
		gap: 0.75rem;
		height: 2.8rem;
		border-radius: 0.5rem;
	}

	@media (min-width: 1920px) {
		padding: 10px 1rem;
		margin-bottom: 0.875rem;
		gap: 0.75rem;
		height: 3rem;
		border-radius: 0.5rem;
	}
`;

export const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	font-size: 0.875rem;
	color: #333;
	background: transparent;

	&::placeholder {
		color: #999;
	}

	@media (min-width: 1920px) {
		font-size: 14.5px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12.5px;
	}

	@media (max-width: 1220px) {
		font-size: 11.5px;
	}
`;

export const SendButton = styled.button`
	background: #133e87;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover:not(:disabled) {
		background: #1565c0;
	}

	&:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}

	@media (max-width: 1220px) {
		padding: 0.375rem 0.875rem;
		border-radius: 0.3125rem;
		font-size: 0.8125rem;
	}

	@media (min-width: 1440px) {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.8rem;
	}
`;

export const ResultsList = styled.div`
	background: white;
	border-radius: 0.5rem;
	overflow: hidden;
	border: 0.0625rem solid #e1e5e9;
	width: 95%;
	margin: 0 auto;
	max-height: calc(5 * 4.5625rem);
	overflow-y: auto;

	/* Custom scrollbar */
	&::-webkit-scrollbar {
		width: 0.375rem;
	}

	&::-webkit-scrollbar-track {
		background: #f8f9fa;
	}

	&::-webkit-scrollbar-thumb {
		background: #cbd5e0;
		border-radius: 0.1875rem;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: #133e87;
	}

	@media (max-width: 1220px) {
		border-radius: 0.375rem;
		max-height: calc(5 * 4rem);

		&::-webkit-scrollbar {
			width: 0.25rem;
		}
	}

	@media (min-width: 1440px) {
		border-radius: 0.5rem;
		max-height: calc(5 * 5rem);

		&::-webkit-scrollbar {
			width: 0.5rem;
		}
	}
`;

export const ResultItem = styled.div<{ selected?: boolean }>`
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem;
	min-height: 2.3125rem;
	border-bottom: 0.0625rem solid #f0f0f0;
	cursor: pointer;
	transition: background-color 0.2s ease;
	background-color: ${(props) => (props.selected ? "#F1F4F9" : "white")};
	border-left: ${(props) =>
		props.selected ? "0.1875rem solid #133E87" : "0.1875rem solid transparent"};
	flex-shrink: 0;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: ${(props) => (props.selected ? "#e3f2fd" : "#f8f9fa")};
		border-left: 0.1875rem solid #133e87;
	}

	@media (max-width: 1220px) {
		padding: 0.625rem 0.875rem;
		min-height: 2rem;
	}

	@media (min-width: 1440px) {
		padding: 0.75rem 1rem;
		min-height: 1.75rem;
	}
`;

export const Avatar = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 0.75rem;
	background: #e0e0e0;

	@media (min-width: 1920px) {
		width: 2.25rem;
		height: 2.25rem;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 1.8rem;
		height: 1.8rem;
	}

	@media (max-width: 1220px) {
		width: 1.8rem;
		height: 1.8rem;
	}
`;

export const UserInfo = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

export const UserName = styled.div`
	font-size: 0.875rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 0.125rem;

	@media (min-width: 1920px) {
		font-size: 16px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
	}
`;

export const UserHandle = styled.div`
	font-size: 0.8125rem;
	color: #666;

	@media (min-width: 1920px) {
		font-size: 14px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 12px;
	}

	@media (max-width: 1220px) {
		font-size: 11px;
	}
`;

export const UserInfoDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.span`
  font-size: 18px;
  line-height: 1;
  color: #999;
`;

export const MutualFriends = styled.div`
	font-size: 0.8125rem;
	color: #999;

	@media (max-width: 1220px) {
		font-size: 0.75rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.8rem;
	}
`;

export const SectionHeader = styled.div`
	font-size: 0.875rem;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 1rem;

	@media (min-width: 1920px) {
		font-size: 16px;
		margin-bottom: 16px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 13.5px;
		margin-bottom: 10px;
	}

	@media (max-width: 1220px) {
		font-size: 12px;
		margin-bottom: 8px;
	}
`;

export const ActionButton = styled.button<{
	variant?: "accept" | "decline" | "unfriend" | "view";
}>`
    background: ${(props) =>
		props.variant === "accept"
			? "#00885D"
			: props.variant === "decline" || props.variant === "unfriend"
				? "#ef4444"
				: props.variant === "view"
					? "#133E87"
					: "#133E87"};
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    min-height: 2rem;
    
    &:hover {
        background: ${(props) =>
		props.variant === "accept"
			? "#16a34a"
			: props.variant === "decline" || props.variant === "unfriend"
				? "#dc2626"
				: props.variant === "view"
					? "#2563EB"
					: "#1565c0"};
    }
    
    &:first-child {
        margin-left: 0;
    }
    
    &:focus {
        outline: none;
    }
    
    @media (max-width: 1220px) {
        padding: 0.4rem;
        border-radius: 0.3125rem;
        font-size: 0.75rem;
        margin-left: 0.375rem;
        min-width: 1.75rem;
        min-height: 1.75rem;
    }
    
    @media (min-width: 1440px) {
        padding: 0.55rem;
        border-radius: 0.5rem;
        font-size: 0.9375rem;
        margin-left: 0.25rem;
        min-width: 2.25rem;
        min-height: 2.25rem;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    @media (max-width: 1220px) {
        gap: 0.375rem;
    }
    
    @media (min-width: 1440px) {
        gap: 0.625rem;
    }
`;

//note
export const UnfriendButton = styled.button`
	background: none;
	border: none;
	color: #ef4444;
	font-size: 1.25rem;
	cursor: pointer;
	padding: 0.25rem;
	border-radius: 0.25rem;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #fef2f2;
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}

	@media (max-width: 1220px) {
		font-size: 1.125rem;
		padding: 0.1875rem;
		border-radius: 0.1875rem;
	}

	@media (min-width: 1440px) {
		font-size: 1.375rem;
		padding: 0.3125rem;
		border-radius: 0.3125rem;
	}
`;

export const Modal = styled.div`
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

export const ModalContent = styled.div`
	background: white;
	border-radius: 0.75rem;
	padding: 2.5rem 2rem;
	text-align: center;
	min-width: 31.25rem;
	margin: 1.25rem;
	box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.12);

	@media (max-width: 1220px) {
		border-radius: 0.625rem;
		padding: 2rem 1.5rem;
		min-width: 28rem;
		margin: 1rem;
	}

	@media (min-width: 1440px) {
		border-radius: 1rem;
		padding: 3rem 2.5rem;
		min-width: 37.5rem;
		margin: 1.5rem;
	}
`;

export const ModalTitle = styled.h3`
	font-size: 1.875rem;
	font-weight: 600;
	color: #00885d;
	margin: 0 0 1.25rem 0;

	@media (max-width: 1220px) {
		font-size: 1.625rem;
		margin: 0 0 1rem 0;
	}

	@media (min-width: 1440px) {
		font-size: 2.125rem;
		margin: 0 0 1.5rem 0;
	}
`;

export const SendImg = styled.img`
	width: 7.5rem;
	height: 7.5rem;
	margin: 0.625rem auto;

	@media (max-width: 1220px) {
		width: 6.5rem;
		height: 6.5rem;
		margin: 0.5rem auto;
	}

	@media (min-width: 1440px) {
		width: 9rem;
		height: 9rem;
		margin: 0.75rem auto;
	}
`;

export const ModalMessage = styled.p`
	font-size: 1rem;
	color: #1a1a1a;
	margin: 0 0 2rem 0;
	line-height: 1.5;
	font-weight: 300;

	@media (max-width: 1220px) {
		font-size: 0.9375rem;
		margin: 0 0 1.75rem 0;
		line-height: 1.4;
	}

	@media (min-width: 1440px) {
		font-size: 1.125rem;
		margin: 0 0 2.5rem 0;
		line-height: 1.6;
	}
`;

export const ModalButton = styled.button`
	background: #00885d;
	color: white;
	border: none;
	padding: 0.75rem 2.5rem;
	border-radius: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	width: 100%;
	transition: background-color 0.2s ease;

	&:hover {
		background: #16a34a;
	}

	&:focus {
		outline: none;
		box-shadow: none;
	}

	@media (max-width: 1220px) {
		padding: 0.625rem 2rem;
		border-radius: 0.375rem;
		font-size: 0.9375rem;
	}

	@media (min-width: 1440px) {
		padding: 0.875rem 3rem;
		border-radius: 0.625rem;
		font-size: 1.125rem;
	}
`;

export const FriendsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1rem;

	@media (min-width: 640px) {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: 1280px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (max-width: 1220px) {
		gap: 0.875rem;
	}

	@media (min-width: 1440px) {
		gap: 0.5rem;
	}
`;

export const FriendCard = styled.div`
	background-color: white;
	border-radius: 0.5rem;
	box-shadow: 0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.05);
	border: 0.0625rem solid #e5e7eb;
	transition: box-shadow 0.2s ease;

	&:hover {
		box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 1220px) {
		border-radius: 0.375rem;
	}

	@media (min-width: 1440px) {
		border-radius: 0.5rem;
	}
`;

export const CardContent = styled.div`
	padding: 1rem;

	@media (max-width: 1220px) {
		padding: 0.875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.875rem;
	}
`;

export const CardHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	align-items: center;
`;

export const MenuButton = styled.button`
	padding: 0.25rem;
	border: none;
	background-color: transparent;
	cursor: pointer;
	border-radius: 62.4375rem;
	transition: background-color 0.2s ease;
	justify-content: center;

	&:hover {
		background-color: #f3f4f6;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 0.1875rem;
	}

	@media (min-width: 1440px) {
		padding: 0.25rem;
	}
`;

export const MenuDropdown = styled.div`
	position: absolute;
	right: 0;
	margin-top: 0.5rem;
	width: 14rem;
	background-color: white;
	box-shadow: 0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1);
	border: 0.0625rem solid #e5e7eb;
	padding: 0.5rem 0;
	z-index: 10;

	@media (max-width: 1220px) {
		margin-top: 0.375rem;
		width: 12.5rem;
		padding: 0.375rem 0;
	}

	@media (min-width: 1440px) {
		margin-top: 0.5rem;
		width: 13rem;
		padding: 0.5rem 0;
	}
`;

export const MenuItem = styled.button`
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border: none;
	background-color: transparent;
	text-align: left;
	cursor: pointer;
	transition: background-color 0.2s ease;
	color: #374151;
	font-size: 0.875rem;

	&:hover {
		background-color: #f3f4f6;
		border-radius: 0;
	}

	&:focus {
		outline: none;
	}

	svg {
		margin-right: 0.75rem;
		color: #374151;
	}

	@media (max-width: 1220px) {
		padding: 0.375rem 0.875rem;
		font-size: 0.8125rem;

		svg {
			margin-right: 0.625rem;
		}
	}

	@media (min-width: 1440px) {
		padding: 0.5rem 1.25rem;
		font-size: 0.875rem;

		svg {
			margin-right: 0.875rem;
		}
	}
`;

export const MenuItemText = styled.span`
	color: #374151;
`;

export const FriendInfo = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FriendName = styled.h3`
	font-weight: 600;
	color: #111827;
	font-size: 0.875rem;

	@media (max-width: 1220px) {
		font-size: 0.8125rem;
	}

	@media (min-width: 1440px) {
		font-size: 0.85rem;
	}
`;

export const NoResults = styled.div`
	text-align: center;
	padding: 3rem 0;

	@media (max-width: 1220px) {
		padding: 2.5rem 0;
	}

	@media (min-width: 1440px) {
		padding: 2.75rem 0;
	}
`;

export const NoResultsText = styled.p`
	color: #6b7280;
	font-size: 1.125rem;

	@media (max-width: 1220px) {
		font-size: 1rem;
	}

	@media (min-width: 1440px) {
		font-size: 1.25rem;
	}
`;

export const Overlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
`;

export const MenuContainer = styled.div`
	position: relative;
	display: inline-block;
`;

export const PaginationContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 1.25rem;
	gap: 0.375rem;

	@media (max-width: 1220px) {
		margin-top: 1rem;
		gap: 0.3125rem;
	}

	@media (min-width: 1440px) {
		margin-top: 1.5rem;
		gap: 0.5rem;
	}
`;

export const PageButton = styled.button<{ $active?: boolean }>`
	padding: 0.375rem 0.75rem;
	border-radius: 0.5rem;
	border: none;
	cursor: pointer;
	background-color: ${({ $active }) => ($active ? "#133E87" : "#E5E7EB")};
	color: ${({ $active }) => ($active ? "#fff" : "#1F2937")};
	font-weight: 500;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: ${({ $active }) => ($active ? "#1D4ED8" : "#D1D5DB")};
	}

	&:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		cursor: not-allowed;
	}

	&:focus {
		outline: none;
	}

	@media (max-width: 1220px) {
		padding: 0.3125rem 0.625rem;
		border-radius: 0.375rem;
	}

	@media (min-width: 1440px) {
		padding: 0.5rem 0.875rem;
		border-radius: 0.625rem;
	}
`;
