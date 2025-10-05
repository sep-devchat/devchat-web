import React from "react";
import * as S from "./Pagination.styled";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const renderPageNumbers = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, "...", currentPage, "...", totalPages);
			}
		}

		return pages;
	};

	return (
		<S.PaginationContainer>
			<S.NavButton
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				◀
			</S.NavButton>

			{renderPageNumbers().map((page, idx) => (
				<React.Fragment key={idx}>
					{page === "..." ? (
						<S.Ellipsis>...</S.Ellipsis>
					) : (
						<S.PageButton
							onClick={() => onPageChange(page as number)}
							$active={currentPage === page}
						>
							{page}
						</S.PageButton>
					)}
				</React.Fragment>
			))}

			<S.NavButton
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				▶
			</S.NavButton>
		</S.PaginationContainer>
	);
};
