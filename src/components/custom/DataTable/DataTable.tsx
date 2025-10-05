import React from "react";
import {
	TableContainer,
	Title,
	TableWrapper,
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from "./DataTable.styled";

interface Column {
	key: string;
	header: string;
	width?: string;
	align?: "left" | "center" | "right";
	render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
	title?: string;
	columns: Column[];
	data: any[];
	className?: string;
}

export default function DataTable({
	title,
	columns,
	data,
	className = "",
}: DataTableProps) {
	const renderCell = (column: Column, row: any) => {
		const value = row[column.key];

		if (column.render) {
			return column.render(value, row);
		}

		return value;
	};

	return (
		<TableContainer className={className}>
			{title && <Title>{title}</Title>}

			<TableWrapper>
				<Table>
					<TableHead>
						<TableRow isHeader>
							{columns.map((column) => (
								<TableHeader
									key={column.key}
									align={column.align}
									width={column.width}
								>
									{column.header}
								</TableHeader>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{columns.map((column) => (
									<TableCell key={column.key} align={column.align}>
										{renderCell(column, row)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableWrapper>
		</TableContainer>
	);
}
