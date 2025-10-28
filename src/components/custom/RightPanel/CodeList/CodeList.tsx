// CodeList.tsx
import React, { useState } from "react";
import {
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	PageWrapper,
	CPContent,
	CPModalOverlay,
	CPModalContent,
	IconButton,
} from "./CodeList.styled";
import { SquareCode, X } from "lucide-react";

import CodeItem from "./CodeItem";
import { codeData } from "./codeData";

interface RunCodeModalProps {
	code: string;
	onClose: () => void;
}

interface ThreadPanelProps {
	// groupId: string;
	// channelId: string;
	// threadId?: string;
	onClose?: () => void;
	// onThreadCreated?: (threadId: string) => void;
}

const RunCodeModal: React.FC<RunCodeModalProps> = ({ code, onClose }) => {
	const stop = (e: React.MouseEvent) => e.stopPropagation(); // tránh đóng khi click vào content
	return (
		<CPModalOverlay onClick={onClose}>
			<CPModalContent onClick={stop}>
				<h3>Kết quả chạy code:</h3>
				<p>Đang thực thi code cho file...</p>
				<pre>{code}</pre>
				<button onClick={onClose} style={{ marginTop: 16 }}>
					Đóng
				</button>
			</CPModalContent>
		</CPModalOverlay>
	);
};

// export default function CodeList() {
const CodeList: React.FC<ThreadPanelProps> = ({ onClose }) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [runningCode, setRunningCode] = useState<string>("");

	const handleRunCode = (codeToRun: string) => {
		// Bạn có thể thêm logic "chạy code" ở đây nếu cần (sandbox, server, ...)
		console.log("Chuẩn bị chạy code:", codeToRun);
		setRunningCode(codeToRun);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setRunningCode("");
	};

	const handleClose = (): void => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPHeaderIcon>
						<SquareCode />
					</CPHeaderIcon>
					<CPTitle>Code List</CPTitle>
				</CPHeaderLeft>

				<CPHeaderLeft>
					<IconButton onClick={handleClose}>
						<X size={20} />
					</IconButton>
				</CPHeaderLeft>
			</CPHeader>

			<CPContent>
				{codeData.map((item) => (
					<CodeItem
						key={item.id}
						fileName={item.fileName}
						code={item.code}
						onRun={() => handleRunCode(item.code)}
					/>
				))}
			</CPContent>

			{isModalOpen && (
				<RunCodeModal code={runningCode} onClose={handleCloseModal} />
			)}
		</PageWrapper>
	);
};

export default CodeList;
