import React, { useState } from "react";
import { MessageItemType } from "../../../types/moderateMessage.types.ts";
import * as S from "./ContentArea.styled";
import { HeaderContent } from "../HeaderContent/HeaderContent";
import { MessageItem } from "../MessageItem/MessageItem";
import { Pagination } from "../Pagination/Pagination";

interface ContentAreaProps {
	title: string;
	headerActions?: React.ReactNode;
	showCheckbox?: boolean;
	showHeaderCheckbox?: boolean;
	items: MessageItemType[];
	totalPages?: number;
	onSelectAll?: (checked: boolean) => void;
	onSelectItem?: (id: string, checked: boolean) => void;
	onPageChange?: (page: number) => void;
	themeId?: string | null;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
	title,
	headerActions,
	showCheckbox,
	showHeaderCheckbox = false,
	items,
	totalPages = 9,
	onSelectAll,
	onSelectItem,
	onPageChange,
	themeId,
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		onPageChange?.(page);
	};

	return (
		<S.Container>
			<HeaderContent
				title={title}
				actions={headerActions}
				showCheckbox={showHeaderCheckbox}
				onSelectAll={onSelectAll}
				themeId={themeId}
			/>

			<S.ContentWrapper>
				{items.map((item) => (
					<MessageItem
						key={item.id}
						item={item}
						showCheckbox={showCheckbox}
						onSelect={onSelectItem}
					/>
				))}
			</S.ContentWrapper>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</S.Container>
	);
};
