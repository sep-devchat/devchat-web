import styled from "styled-components";

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
	padding: 20px;
`;

export const ModalContainer = styled.div`
	background: white;
	border-radius: 12px;
	width: 100%;
	max-width: 800px;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
	position: relative;
	//   padding: 24px 24px 24px;
	border-radius: 12px 12px 0 0;
`;

export const HeaderActions = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	display: flex;
	gap: 8px;
`;

export const AvatarSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
	border: 5px solid white;
	object-fit: cover;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

	@media (max-width: 1220px) {
		width: 80px;
		height: 80px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		width: 100px;
		height: 100px;
	}

	@media (min-width: 1920px) {
		width: 120px;
		height: 120px;
	}
`;

export const UserName = styled.h2`
	margin: 16px 0 4px;
	font-size: 24px;
	font-weight: 600;
	color: #1f2937;
	text-align: center;

	@media (max-width: 1220px) {
		font-size: 16px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 18px;
	}

	@media (min-width: 1920px) {
		font-size: 20px;
	}
`;

export const Username = styled.p`
	margin: 0 0 8px;
	font-size: 14px;
	color: #6b7280;
	text-align: center;

	@media (max-width: 1220px) {
		font-size: 12px;
	}

	@media (min-width: 1440px) and (max-width: 1919px) {
		font-size: 14px;
	}

	@media (min-width: 1920px) {
		font-size: 16px;
	}
`;

export const StatusBadge = styled.span<{ $isActive: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 12px;
	background: ${(props) => (props.$isActive ? "#dcfce7" : "#fee2e2")};
	color: ${(props) => (props.$isActive ? "#166534" : "#991b1b")};
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
`;

export const ModalBody = styled.div`
	padding: 24px;
`;

export const InfoSection = styled.div`
	margin-top: 24px;
`;

export const InfoItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 12px 0;
	border-bottom: 1px solid #f3f4f6;

	&:last-child {
		border-bottom: none;
	}
`;

export const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	background: #f3f4f6;
	border-radius: 8px;
	flex-shrink: 0;
	color: #6b7280;
`;

export const InfoContent = styled.div`
	flex: 1;
`;

export const InfoLabel = styled.div`
	font-size: 12px;
	color: #6b7280;
	margin-bottom: 2px;
`;

export const InfoValue = styled.div`
	font-size: 14px;
	color: #1f2937;
	font-weight: 500;
`;

export const ReportModalContent = styled.div`
	padding: 24px;
`;

export const ReportHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 8px;
`;

export const ReportIcon = styled.div`
	width: 48px;
	height: 48px;
	background: #fee2e2;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #dc2626;
`;

export const ReportTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #1f2937;
	margin: 0;
`;

export const ReportDescription = styled.p`
	font-size: 14px;
	color: #6b7280;
	margin: 0 0 24px 0;
	line-height: 1.5;
`;

export const ReasonSection = styled.div`
	margin-bottom: 24px;
`;

export const SectionLabel = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #374151;
	margin-bottom: 12px;
`;

export const ReasonOption = styled.label`
	display: flex;
	align-items: flex-start;
	padding: 12px;
	border: 2px solid #e5e7eb;
	border-radius: 8px;
	margin-bottom: 8px;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		border-color: #d1d5db;
		background: #f9fafb;
	}

	input:checked + & {
		border-color: #667eea;
		background: #f5f7ff;
	}
`;

export const RadioInput = styled.input`
	margin-right: 12px;
	margin-top: 2px;
	cursor: pointer;
`;

export const ReasonText = styled.div`
	flex: 1;
`;

export const ReasonTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: #1f2937;
	margin-bottom: 2px;
`;

export const ReasonDesc = styled.div`
	font-size: 12px;
	color: #6b7280;
`;

export const TextArea = styled.textarea`
	width: 100%;
	min-height: 100px;
	padding: 12px;
	border: 2px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
	font-family: inherit;
	resize: vertical;
	transition: border-color 0.2s;

	&:focus {
		outline: none;
		border-color: #667eea;
	}

	&::placeholder {
		color: #9ca3af;
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
	margin-top: 24px;
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
	flex: 1;
	padding: 12px 24px;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	${(props) =>
		props.$variant === "primary"
			? `
    background: #dc2626;
    color: white;
    &:hover {
      background: #b91c1c;
    }
  `
			: `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

export const LanguagesSection = styled.div`
	margin-top: 24px;
	padding: 16px;
	background: #f9fafb;
	border-radius: 12px;
`;

export const LanguagesSectionTitle = styled.h3`
	font-size: 14px;
	font-weight: 600;
	color: #374151;
	margin: 0 0 16px 0;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;

export const LanguagesList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const LanguagesEmptyState = styled.p`
	margin: 0;
	padding: 8px 0 4px;
	font-size: 13px;
	color: #6b7280;
`;

export const LanguageItem = styled.div<{ $rank: number }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: white;
	border-radius: 8px;
	border: 2px solid
		${(props) =>
			props.$rank === 1
				? "#fbbf24"
				: props.$rank === 2
					? "#d1d5db"
					: props.$rank === 3
						? "#f59e0b"
						: "#e5e7eb"};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	position: relative;
	overflow: hidden;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: ${(props) =>
			props.$rank === 1
				? "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)"
				: props.$rank === 2
					? "linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%)"
					: props.$rank === 3
						? "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)"
						: "#e5e7eb"};
	}
`;

export const RankBadge = styled.div<{ $rank: number }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	font-size: 14px;
	font-weight: 700;
	background: ${(props) =>
		props.$rank === 1
			? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
			: props.$rank === 2
				? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
				: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"};
	color: ${(props) => (props.$rank === 2 ? "#374151" : "white")};
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	flex-shrink: 0;
`;

export const LanguageIcon = styled.img`
	width: 40px;
	height: 40px;
	object-fit: contain;
	flex-shrink: 0;
`;

export const LanguageInfo = styled.div`
	flex: 1;
	min-width: 0;
`;

export const LanguageName = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 4px;
`;

export const LanguageProficiency = styled.div<{ $level: string }>`
	display: inline-block;
	padding: 2px 8px;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 500;
	background: ${(props) => {
		switch (props.$level) {
			case "EXPERT":
				return "#dcfce7";
			case "ADVANCED":
				return "#dbeafe";
			case "INTERMEDIATE":
				return "#fef3c7";
			default:
				return "#fee2e2";
		}
	}};
	color: ${(props) => {
		switch (props.$level) {
			case "EXPERT":
				return "#166534";
			case "ADVANCED":
				return "#1e40af";
			case "INTERMEDIATE":
				return "#92400e";
			default:
				return "#991b1b";
		}
	}};
`;
