import { theme } from "@/themes";
import styled from "styled-components";

export const Composer = styled.form`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 10px;
	border-top: 1px solid rgba(0, 0, 0, 0.06);
	background: rgba(255, 255, 255, 0.7);
	border-radius: 0 0 10px 10px;
	flex: 0 0 auto;
	height: max-content;
`;

export const Input = styled.input`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid ${theme.color.grey300};
	border-radius: 6px;
	background: ${theme.color.white};
	font-size: 14px;
	color: #1a1a1a;
	outline: none;

	&:focus {
		border-color: ${theme.color.indigo};
		box-shadow: 0 0 0 3px ${theme.color.indigoLight};
	}

	&::placeholder {
		color: ${theme.color.grey400};
	}
`;

// export const InputContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   background: #ffffff;
//   border: 1px solid #e5e7eb;
//   border-radius: 24px;
//   padding: 8px 12px;
//   width: 100%;
// `;

export const TextInput = styled.input`
	width: 100%;
	border: none;
	background: transparent;
	font-size: 14px;
	outline: none;
`;

export const InputContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	background: ${theme.color.white};
	border: 1px solid ${theme.color.grey300};
	border-radius: 24px;
	padding: 8px 16px;
	width: 100%;

	${Input} {
		border: none;
		padding: 0;
		background: transparent;

		&:focus {
			box-shadow: none;
		}
	}
`;

export const IconButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	background: none;
	border: none;
	color: ${theme.color.grey400};
	cursor: pointer;
	border-radius: 4px;

	&:hover {
		color: ${theme.color.grey600};
		background: ${theme.color.grey100};
	}
`;

export const PreviewList = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
	padding: 8px 0;
	flex-wrap: wrap;
`;

export const ImageThumb = styled.div`
	width: 72px;
	height: 72px;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	background: #f8fafc;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const RemoveBtn = styled.button`
	position: absolute;
	top: 4px;
	right: 4px;
	background: rgba(0, 0, 0, 0.6);
	color: white;
	border: none;
	border-radius: 4px;
	padding: 2px 6px;
	font-size: 12px;
	cursor: pointer;
`;
