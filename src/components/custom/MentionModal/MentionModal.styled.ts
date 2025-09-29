import styled from "styled-components";

export const ModalOverlay = styled.div<{ show: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.1);
	display: ${(props) => (props.show ? "block" : "none")};
	z-index: 1000;
`;

export const ModalContainer = styled.div`
	position: absolute;
	bottom: 80px;
	right: -199px;
	transform: translateX(-50%);
	background: white;
	border-radius: 8px;
	width: 435px;
	max-height: 400px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	overflow: hidden;
`;

export const ModalHeader = styled.div`
	padding: 16px 20px;
	border-bottom: 1px solid #e0e0e0;
	background-color: #f8f9fa;
`;

export const HeaderTitle = styled.div`
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 4px;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
	margin-top: 8px;

	&:focus {
		outline: none;
		border-color: #133e87;
	}
`;

export const MembersSection = styled.div`
	max-height: 280px;
	overflow-y: auto;
`;

export const SectionHeader = styled.div`
	padding: 12px 20px 8px 20px;
	font-size: 12px;
	font-weight: 600;
	color: #666;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	background-color: #f8f9fa;
	border-bottom: 1px solid #e0e0e0;
`;

export const MemberItem = styled.div<{ highlighted: boolean }>`
	display: flex;
	align-items: center;
	padding: 12px 20px;
	cursor: pointer;
	background-color: ${(props) => (props.highlighted ? "#c5d3ef" : "white")};
	border-left: 3px solid
		${(props) => (props.highlighted ? "#133E87" : "transparent")};

	&:hover {
		background-color: #f0f4ff;
		border-left: 3px solid #133e87;
	}
`;

export const Avatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #133e87;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 16px;
	margin-right: 12px;
	overflow: hidden;
`;

export const MemberSpecial = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const MemberInfo = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

export const MemberName = styled.div`
	font-weight: 500;
	font-size: 15px;
	color: #333;
	margin-bottom: 2px;
`;

export const MemberUsername = styled.div`
	font-size: 13px;
	color: #666;
`;

export const SpecialMentionItem = styled.div<{ highlighted: boolean }>`
	display: flex;
	align-items: center;
	padding: 12px 20px;
	cursor: pointer;
	background-color: ${(props) => (props.highlighted ? "#f0f4ff" : "white")};
	border-left: 3px solid
		${(props) => (props.highlighted ? "#133E87" : "transparent")};

	&:hover {
		background-color: #f0f4ff;
		border-left: 3px solid #133e87;
	}
`;

export const SpecialMentionName = styled.div`
	font-weight: 500;
	font-size: 15px;
	color: #133e87;
	margin-bottom: 2px;
`;

export const SpecialMentionDescription = styled.div`
	font-size: 13px;
	color: #666;
`;
