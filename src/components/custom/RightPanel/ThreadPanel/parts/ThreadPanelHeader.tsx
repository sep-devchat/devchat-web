import React from "react";
import { Folder, X } from "lucide-react";
import {
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	CloseButton,
} from "../ThreadPanel.styled";

interface ThreadPanelHeaderProps {
	onClose?: () => void;
}

const ThreadPanelHeader: React.FC<ThreadPanelHeaderProps> = ({ onClose }) => {
	return (
		<CPHeader>
			<CPHeaderLeft>
				<CPHeaderIcon>
					<Folder size={18} />
				</CPHeaderIcon>
				<CPTitle>Thread</CPTitle>
			</CPHeaderLeft>
			{onClose && (
				<CloseButton onClick={onClose}>
					<X size={20} />
				</CloseButton>
			)}
		</CPHeader>
	);
};

export default ThreadPanelHeader;
