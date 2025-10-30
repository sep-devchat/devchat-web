import {
	CloseButton,
	CPHeader,
	CPHeaderIcon,
	CPHeaderLeft,
	CPTitle,
	PageWrapper,
} from "./CodeList.styled";
import { SquareCode, X } from "lucide-react";

interface CodeListProps {
	onClose?: () => void;
}

export default function CodeList({ onClose }: CodeListProps) {
	return (
		<PageWrapper>
			<CPHeader>
				<CPHeaderLeft>
					<CPHeaderIcon>
						<SquareCode />
					</CPHeaderIcon>
					<CPTitle>Code List</CPTitle>
				</CPHeaderLeft>

				{onClose && (
					<CloseButton onClick={onClose}>
						<X size={20} />
					</CloseButton>
				)}
			</CPHeader>
		</PageWrapper>
	);
}
