import { useEffect, useMemo, useState } from "react";
import * as S from "./TransactionHistory.styled";
import {
	listTransactions,
	type Pagination,
	type Transaction,
} from "@/services/transactionAPI";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

const TransactionHistory = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [page, setPage] = useState(1);
	const take = 20;

	const formatVnd = useMemo(() => {
		return (value: number) =>
			new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
				maximumFractionDigits: 0,
			}).format(value);
	}, []);

	useEffect(() => {
		let mounted = true;
		setIsLoading(true);
		setError(null);

		listTransactions({ page, take })
			.then((res) => {
				if (!mounted) return;
				setTransactions(res?.data ?? []);
				setPagination((res as any)?.pagination ?? null);
				const totalPage = Number((res as any)?.pagination?.totalPage);
				if (Number.isFinite(totalPage) && totalPage >= 1 && page > totalPage) {
					setPage(totalPage);
				}
			})
			.catch((err: any) => {
				if (!mounted) return;
				const message = String(
					err?.response?.data?.message ??
						err?.message ??
						"Failed to load transactions",
				);
				setError(message);
				fireAlert("error", message);
			})
			.finally(() => {
				if (!mounted) return;
				setIsLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, [page]);

	const hasError = !!error;

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						<S.Title>Transaction History</S.Title>
						<S.Subtitle>View and audit all payment transactions.</S.Subtitle>
					</S.TitleBlock>
				</S.HeaderRow>
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableTitle>Transactions</S.TableTitle>
					<S.TableSubtitle>
						{isLoading
							? "Loading transactions..."
							: `Total: ${pagination?.totalRecord ?? transactions.length}`}
					</S.TableSubtitle>
				</S.TableHeader>

				{hasError ? (
					<S.ErrorState>{error ?? "Failed to load transactions."}</S.ErrorState>
				) : isLoading ? (
					<S.LoadingState>Loading...</S.LoadingState>
				) : transactions.length === 0 ? (
					<S.EmptyState>No transactions to display yet.</S.EmptyState>
				) : (
					<div className="p-4">
						<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
							<p className="text-sm text-muted-foreground">
								Page {pagination?.page ?? page}
								{pagination?.totalPage ? ` / ${pagination.totalPage}` : ""}
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={
										isLoading ||
										!(pagination?.prevPage ?? (page > 1 ? page - 1 : undefined))
									}
									onClick={() =>
										setPage(pagination?.prevPage ?? Math.max(1, page - 1))
									}
								>
									Prev
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={
										isLoading ||
										!(
											pagination?.nextPage ??
											(pagination?.totalPage
												? page < pagination.totalPage
												: false)
										)
									}
									onClick={() => {
										if (pagination?.nextPage)
											return setPage(pagination.nextPage);
										if (pagination?.totalPage) {
											return setPage(Math.min(pagination.totalPage, page + 1));
										}
									}}
								>
									Next
								</Button>
							</div>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[180px]">Code</TableHead>
										<TableHead className="min-w-[120px]">Type</TableHead>
										<TableHead className="min-w-[120px]">Status</TableHead>
										<TableHead className="min-w-[120px]">Method</TableHead>
										<TableHead className="min-w-[140px] text-right">
											Amount
										</TableHead>
										<TableHead className="min-w-[220px]">User</TableHead>
										<TableHead className="min-w-[220px]">Group</TableHead>
										<TableHead className="min-w-[220px]">Share Fund</TableHead>
										<TableHead className="min-w-[260px]">Message</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transactions.map((tx) => {
										const amountNum = Number(tx.vndAmount);
										const amountText = Number.isFinite(amountNum)
											? formatVnd(amountNum)
											: String(tx.vndAmount ?? "");

										const status = String(
											tx.transactionStatus ?? "",
										).toUpperCase();
										const statusVariant:
											| "default"
											| "destructive"
											| "secondary" =
											status === "SUCCESS"
												? "default"
												: status === "FAILED"
													? "destructive"
													: "secondary";

										return (
											<TableRow key={tx.id}>
												<TableCell className="font-medium">
													{tx.transactionCode || tx.id}
												</TableCell>
												<TableCell>{tx.transactionType}</TableCell>
												<TableCell>
													<Badge variant={statusVariant}>
														{status || "N/A"}
													</Badge>
												</TableCell>
												<TableCell>{tx.paymentMethod}</TableCell>
												<TableCell className="text-right">
													{amountText}
												</TableCell>
												<TableCell>{tx.userId || "-"}</TableCell>
												<TableCell>
													{tx.group?.name || tx.groupId || "-"}
												</TableCell>
												<TableCell>{tx.shareFundId || "-"}</TableCell>
												<TableCell className="whitespace-normal">
													{tx.transactionMessage || "-"}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>
				)}
			</S.TableCard>
		</S.PageContainer>
	);
};

export default TransactionHistory;
