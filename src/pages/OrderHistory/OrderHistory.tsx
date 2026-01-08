import { useMemo, useRef, useState, useEffect } from "react";
import * as S from "@/pages/TransactionHistory/TransactionHistory.styled";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	getOrderDetail,
	getOrderOverviewReport,
	listOrders,
	type Order,
	type OrderOverviewReport,
} from "@/services/orderAPI";
import CustomDateTimePicker from "@/components/custom/CustomDateTimePicker/CustomDateTimePicker";
import CustomBarChart from "@/components/custom/BarChart/BarChart";
import CustomLineChart from "@/components/custom/LineChart/LineChart";
import type { Pagination as PaginationMeta } from "@/services/transactionAPI";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCcw } from "lucide-react";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

const OrderHistory = () => {
	const formatYmd = (date: Date) => {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	};

	const formatByDayLabel = (raw: unknown) => {
		if (raw === null || raw === undefined) return "";
		const value = String(raw).trim();
		if (!value) return "";
		// If backend already returns YYYY-MM-DD, keep as-is.
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
		// Handle verbose Date strings, e.g. "Mon Dec 29 2025 00:00:00 GMT+0700 (Indochina Time)"
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return formatYmd(parsed);
	};

	const parseYmdToLocalDate = (value: string) => {
		const [yy, mm, dd] = String(value).split("-");
		const year = Number(yy);
		const monthIndex = Number(mm) - 1;
		const day = Number(dd);
		if (
			!Number.isFinite(year) ||
			!Number.isFinite(monthIndex) ||
			!Number.isFinite(day)
		) {
			return new Date(NaN);
		}
		return new Date(year, monthIndex, day);
	};

	const syncOverviewRange = (nextFrom?: string, nextTo?: string) => {
		const fromValue = nextFrom ?? overviewFrom;
		const toValue = nextTo ?? overviewTo;
		if (!fromValue || !toValue) return;
		const fromDate = parseYmdToLocalDate(fromValue);
		const toDate = parseYmdToLocalDate(toValue);
		if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()))
			return;
		if (fromDate > toDate) {
			// Keep range valid by aligning the other bound.
			if (nextFrom !== undefined) setOverviewTo(fromValue);
			else if (nextTo !== undefined) setOverviewFrom(toValue);
		}
	};

	const [overviewFrom, setOverviewFrom] = useState<string>(() => {
		const today = new Date();
		const from = new Date(today);
		from.setDate(from.getDate() - 30);
		return formatYmd(from);
	});
	const [overviewTo, setOverviewTo] = useState<string>(() =>
		formatYmd(new Date()),
	);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);
	const [pagination, setPagination] = useState<PaginationMeta | null>(null);

	const [overview, setOverview] = useState<OrderOverviewReport | null>(null);
	const [overviewLoading, setOverviewLoading] = useState(false);
	const [overviewError, setOverviewError] = useState<string | null>(null);
	const activeOverviewRequestRef = useRef(0);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [sortBy, setSortBy] = useState<
		"createdAt" | "orderCode" | "orderStatus"
	>("createdAt");
	const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
	const [groupId, setGroupId] = useState<string>("");
	const [groupIdDraft, setGroupIdDraft] = useState<string>("");

	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState<string | null>(null);
	const activeDetailOrderIdRef = useRef<string | null>(null);
	const activeListRequestRef = useRef(0);

	const dateTimeFormatter = useMemo(() => {
		return new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}, []);

	const formatDateTime = (value: string | Date | null | undefined) => {
		if (!value) return "-";
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		return dateTimeFormatter.format(date);
	};

	const getErrorMessage = (err: any, fallback: string) => {
		return String(err?.response?.data?.message ?? err?.message ?? fallback);
	};

	const toIsoStartOfDay = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d.toISOString();
	};

	const toIsoEndOfDay = (date: Date) => {
		const d = new Date(date);
		d.setHours(23, 59, 59, 999);
		return d.toISOString();
	};

	const formatVnd = (value: string | number | null | undefined) => {
		const raw = value ?? "0";
		const num = typeof raw === "number" ? raw : Number(String(raw));
		if (!Number.isFinite(num)) return String(raw);
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(num);
	};

	const toNumberSafe = (value: unknown) => {
		const n = typeof value === "number" ? value : Number(String(value ?? "0"));
		return Number.isFinite(n) ? n : 0;
	};

	const resolveSubscriptionName = (order: Order) => {
		return (
			order.subscription?.subscriptionName ??
			order.subscription?.subscriptionCode ??
			order.subscriptionId ??
			"-"
		);
	};

	const resolveGroupName = (order: Order) => {
		return order.group?.name ?? order.groupId ?? "-";
	};

	const resolveStatusVariant = (statusRaw: string | null | undefined) => {
		const status = String(statusRaw ?? "").toUpperCase();
		const variant: "default" | "destructive" | "secondary" =
			status === "PAID"
				? "default"
				: status === "FAILED"
					? "destructive"
					: "secondary";
		return { status, variant };
	};

	const handleStatusColor = (status: string) => {
		switch (status.toUpperCase()) {
			case "PAID":
				return "text-green-600 bg-green-100";
			case "SUCCESS":
				return "text-green-600 bg-green-100";
			case "PENDING":
				return "text-yellow-600 bg-yellow-100";
			case "FAILED":
				return "text-red-600 bg-red-100";
			default:
				return "gray";
		}
	};

	const renderAvatarAndFullname = (
		username: string,
		firstName: string,
		lastName: string,
		avatarUrl: string,
	) => {
		const displayName = `${firstName} ${lastName}`.trim() || username || "User";
		const avatarSrc = avatarUrl;
		return (
			<div className="flex items-center gap-2">
				<img
					src={avatarSrc}
					alt={displayName}
					className="h-6 w-6 rounded-full object-cover"
				/>
				<span>{displayName}</span>
			</div>
		);
	};

	const fetchOrders = async (options?: { silent?: boolean }) => {
		const requestId = ++activeListRequestRef.current;
		if (!options?.silent) {
			setIsLoading(true);
		}
		setError(null);

		try {
			const res = await listOrders({
				page,
				limit: pageSize,
				sortBy,
				sortOrder,
				groupId: groupId.trim() ? groupId.trim() : undefined,
			});

			if (activeListRequestRef.current !== requestId) return;

			const meta = (res as any)?.pagination as PaginationMeta | undefined;
			setPagination(meta ?? null);

			if (meta?.totalPage && page > meta.totalPage) {
				setPage(meta.totalPage);
				return;
			}

			setOrders(res?.data ?? []);
		} catch (err: any) {
			if (activeListRequestRef.current !== requestId) return;
			const message = getErrorMessage(err, "Failed to load orders");
			setError(message);
			fireAlert("error", message);
		} finally {
			if (activeListRequestRef.current !== requestId) return;
			if (!options?.silent) {
				setIsLoading(false);
			}
		}
	};

	const fetchOverview = async () => {
		const requestId = ++activeOverviewRequestRef.current;
		setOverviewLoading(true);
		setOverviewError(null);
		try {
			const fromDate = overviewFrom
				? parseYmdToLocalDate(overviewFrom)
				: undefined;
			const toDate = overviewTo ? parseYmdToLocalDate(overviewTo) : undefined;
			const from = fromDate ? toIsoStartOfDay(fromDate) : undefined;
			const to = toDate ? toIsoEndOfDay(toDate) : undefined;
			const res = await getOrderOverviewReport({ from, to });
			if (activeOverviewRequestRef.current !== requestId) return;
			setOverview(res?.data ?? null);
		} catch (err: any) {
			if (activeOverviewRequestRef.current !== requestId) return;
			const message = getErrorMessage(err, "Failed to load order overview");
			setOverviewError(message);
		} finally {
			if (activeOverviewRequestRef.current !== requestId) return;
			setOverviewLoading(false);
		}
	};

	const refreshOrders = async () => {
		await Promise.all([fetchOrders(), fetchOverview()]);
	};

	useEffect(() => {
		void fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize, sortBy, sortOrder, groupId]);

	useEffect(() => {
		if (!overviewFrom || !overviewTo) return;
		const fromDate = parseYmdToLocalDate(overviewFrom);
		const toDate = parseYmdToLocalDate(overviewTo);
		if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
			return;
		}
		if (fromDate > toDate) {
			setOverviewTo(overviewFrom);
			return;
		}
		void fetchOverview();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [overviewFrom, overviewTo]);

	const applyFilters = () => {
		setPage(1);
		setGroupId(groupIdDraft);
	};

	const clearFilters = () => {
		setGroupIdDraft("");
		setGroupId("");
		setPage(1);
	};

	const totalPage = pagination?.totalPage ?? 1;
	const totalRecord = pagination?.totalRecord ?? orders.length;

	const visiblePages = useMemo(() => {
		const current = page;
		const total = totalPage;
		if (!Number.isFinite(total) || total <= 1)
			return [] as Array<number | "...">;

		const pages: Array<number | "..."> = [];
		const pushRange = (from: number, to: number) => {
			for (let p = from; p <= to; p++) pages.push(p);
		};

		pages.push(1);
		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);

		if (start > 2) pages.push("...");
		pushRange(start, end);
		if (end < total - 1) pages.push("...");
		if (total > 1) pages.push(total);

		return pages;
	}, [page, totalPage]);

	const openDetail = async (order: Order) => {
		setSelectedOrder(order);
		setDetailOpen(true);
		setDetailLoading(true);
		setDetailError(null);
		activeDetailOrderIdRef.current = order.id;

		try {
			const res = await getOrderDetail(order.id);
			if (activeDetailOrderIdRef.current !== order.id) return;
			setSelectedOrder(res?.data ?? order);
		} catch (err: any) {
			if (activeDetailOrderIdRef.current !== order.id) return;
			setDetailError(getErrorMessage(err, "Failed to load order details"));
		} finally {
			if (activeDetailOrderIdRef.current !== order.id) return;
			setDetailLoading(false);
		}
	};

	const closeDetail = () => {
		activeDetailOrderIdRef.current = null;
		setDetailOpen(false);
		setSelectedOrder(null);
		setDetailError(null);
		setDetailLoading(false);
	};

	const detailFields = useMemo(() => {
		if (!selectedOrder) return [];
		return [
			{
				key: "orderCode",
				label: "Order code:",
				value: selectedOrder.orderCode ?? "-",
				className: "font-medium",
			},
			{
				key: "status",
				label: "Status:",
				value: String(selectedOrder.orderStatus ?? "-").toUpperCase(),
				render: () => {
					const { status, variant } = resolveStatusVariant(
						selectedOrder.orderStatus,
					);
					return (
						<Badge variant={variant} className={handleStatusColor(status)}>
							{status || "N/A"}
						</Badge>
					);
				},
			},
			{
				key: "subscription",
				label: "Subscription:",
				value: resolveSubscriptionName(selectedOrder),
				className: "font-medium",
			},
			{
				key: "group",
				label: "Group:",
				value: resolveGroupName(selectedOrder),
				className: "font-medium break-all",
			},
			{
				key: "months",
				label: "Month(s):",
				value: selectedOrder.monthQuantity ?? "-",
				className: "font-medium",
			},
			{
				key: "paymentBy",
				label: "Payment by:",
				value: selectedOrder.paymentBy ?? "-",
				className: "font-medium",
			},
			{
				key: "createdAt",
				label: "Created at:",
				value: formatDateTime(selectedOrder.createdAt),
				className: "font-medium",
			},
		];
	}, [selectedOrder, formatDateTime]);

	return (
		<S.PageContainer>
			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						<S.Title>Overview</S.Title>
						<S.Subtitle>Sold orders and revenue.</S.Subtitle>
					</S.TitleBlock>
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<div className="flex flex-col gap-1">
								<div className="text-xs text-muted-foreground">From</div>
								<CustomDateTimePicker
									value={overviewFrom}
									onChange={(next) => {
										setOverviewFrom(next);
										syncOverviewRange(next, undefined);
									}}
									showTime={false}
									isAllowedPast={true}
									maxDate={overviewTo}
								/>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-xs text-muted-foreground">To</div>
								<CustomDateTimePicker
									value={overviewTo}
									onChange={(next) => {
										setOverviewTo(next);
										syncOverviewRange(undefined, next);
									}}
									showTime={false}
									isAllowedPast={true}
									minDate={overviewFrom}
								/>
							</div>
						</div>

						<Button
							variant="outline"
							disabled={overviewLoading}
							onClick={() => void fetchOverview()}
						>
							{overviewLoading ? (
								"Refreshing..."
							) : (
								<RefreshCcw className="icon-size" />
							)}
						</Button>
					</div>
				</S.HeaderRow>

				{overviewError ? (
					<div className="mt-3 text-sm text-muted-foreground">
						{overviewError}
					</div>
				) : overviewLoading && !overview ? (
					<div className="mt-3 text-sm text-muted-foreground">
						Loading overview...
					</div>
				) : (
					<div className="mt-4 grid gap-4">
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="rounded-md p-4 shadow-sm">
								<div className="text-xs text-muted-foreground">Orders sold</div>
								<div className="mt-1 text-2xl font-semibold">
									{overview?.totalOrdersSold ?? 0}
								</div>
							</div>
							<div className="rounded-md p-4 shadow-sm">
								<div className="text-xs text-muted-foreground">
									Subscription months sold
								</div>
								<div className="mt-1 text-2xl font-semibold">
									{overview?.totalSubscriptionsSold ?? 0}
								</div>
							</div>
							<div className="rounded-md p-4 shadow-sm">
								<div className="text-xs text-muted-foreground">Revenue</div>
								<div className="mt-1 text-2xl font-semibold">
									{formatVnd(overview?.totalRevenueVnd ?? "0")}
								</div>
							</div>
						</div>

						{/* Charts */}
						<div className="grid gap-3 lg:grid-cols-2">
							{(overview?.bySubscription?.length ?? 0) === 0 ? (
								<div className="rounded-md border p-4">
									<div className="text-sm font-medium">
										Revenue by subscription
									</div>
									<div className="mt-1 text-xs text-muted-foreground">
										Top subscriptions by revenue
									</div>
									<div className="mt-3 text-sm text-muted-foreground">
										No data.
									</div>
								</div>
							) : (
								(() => {
									const data = (overview?.bySubscription ?? [])
										.slice(0, 8)
										.map((r) => ({
											name:
												r.subscriptionName ||
												r.subscriptionCode ||
												r.subscriptionId,
											revenueVnd: toNumberSafe(r.revenueVnd),
										}));

									return (
										<CustomBarChart
											title="Revenue by subscription"
											description="Top subscriptions by revenue"
											data={data}
											bars={[
												{
													dataKey: "revenueVnd",
													fill: "#8b5cf6",
													name: "Revenue",
												},
											]}
											height={220}
										/>
									);
								})()
							)}

							{(overview?.byDay?.length ?? 0) === 0 ? (
								<div className="rounded-md border p-4">
									<div className="text-sm font-medium">Revenue by day</div>
									<div className="mt-1 text-xs text-muted-foreground">
										Last 30 days (UTC date buckets)
									</div>
									<div className="mt-3 text-sm text-muted-foreground">
										No data.
									</div>
								</div>
							) : (
								(() => {
									const rowsAll = overview?.byDay ?? [];
									const rows = rowsAll.slice(Math.max(0, rowsAll.length - 30));
									const data = rows.map((r) => ({
										name: formatByDayLabel(r.date),
										revenueVnd: toNumberSafe(r.revenueVnd),
									}));

									return (
										<CustomLineChart
											title="Revenue by day"
											description="Last 30 days (UTC date buckets)"
											data={data}
											lines={[
												{
													dataKey: "revenueVnd",
													stroke: "#6366f1",
													name: "Revenue",
												},
											]}
											height={220}
											timeButtons={null as unknown as string[]}
										/>
									);
								})()
							)}
						</div>
					</div>
				)}
			</S.Panel>

			<Dialog
				open={detailOpen}
				onOpenChange={(open) => {
					if (!open) closeDetail();
					else setDetailOpen(true);
				}}
			>
				<DialogContent className="sm:max-w-[1200px]">
					<DialogHeader>
						<DialogTitle>
							Order details
							{selectedOrder?.id ? ` - #${selectedOrder.id.split("-")[0]}` : ""}
						</DialogTitle>
						<DialogDescription>
							Details of the selected order.
						</DialogDescription>
					</DialogHeader>

					{detailLoading ? (
						<div className="text-sm text-muted-foreground">
							Loading order details...
						</div>
					) : detailError ? (
						<div className="text-sm text-muted-foreground">{detailError}</div>
					) : !selectedOrder ? (
						<div className="text-sm text-muted-foreground">
							No order selected.
						</div>
					) : (
						<div className="grid gap-4">
							<div className="grid grid-cols-2 gap-2 text-sm">
								{detailFields.map((field) => (
									<div
										key={field.key}
										className="contents flex items-center gap-2"
									>
										<div className="text-muted-foreground min-w-[100px]">
											{field.label}
										</div>
										{field.render ? (
											field.render()
										) : (
											<div className={field.className ?? "font-medium"}>
												{field.value as any}
											</div>
										)}
									</div>
								))}
							</div>

							<div>
								<h3 className="mb-2 text-md font-medium">Transactions</h3>
								{selectedOrder.orderTransactions &&
								selectedOrder.orderTransactions.length > 0 ? (
									<div className="overflow-x-auto rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="min-w-[160px]">Code</TableHead>
													<TableHead className="min-w-[120px]">Type</TableHead>
													<TableHead className="min-w-[120px]">
														Status
													</TableHead>
													<TableHead className="min-w-[160px]">User</TableHead>
													<TableHead className="min-w-[160px]">
														Amount
													</TableHead>
													<TableHead className="min-w-[220px]">
														Created at
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{selectedOrder.orderTransactions.map((tx) => {
													const amountNum = Number(tx.vndAmount);
													const amountText = Number.isFinite(amountNum)
														? new Intl.NumberFormat("vi-VN", {
																style: "currency",
																currency: "VND",
																maximumFractionDigits: 0,
															}).format(amountNum)
														: String(tx.vndAmount ?? "-");

													const { status, variant } = resolveStatusVariant(
														tx.transactionStatus,
													);

													return (
														<TableRow key={tx.id}>
															<TableCell className="font-medium">
																{tx.transactionCode || tx.id}
															</TableCell>
															<TableCell>{tx.transactionType}</TableCell>
															<TableCell>
																<Badge
																	variant={variant}
																	className={handleStatusColor(status)}
																>
																	{status || "N/A"}
																</Badge>
															</TableCell>
															<TableCell>
																{renderAvatarAndFullname(
																	(tx.user as any)?.username,
																	(tx.user as any)?.firstName,
																	(tx.user as any)?.lastName,
																	(tx.user as any)?.avatarUrl,
																)}
															</TableCell>
															<TableCell>{amountText}</TableCell>
															<TableCell>
																{formatDateTime((tx as any)?.createdAt)}
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</div>
								) : (
									<div className="text-sm text-muted-foreground">
										No transactions found for this order.
									</div>
								)}
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={closeDetail}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<S.Panel>
				<S.HeaderRow>
					<S.TitleBlock>
						<S.Title>Orders</S.Title>
						<S.Subtitle>View orders across the system.</S.Subtitle>
					</S.TitleBlock>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							disabled={isLoading}
							onClick={() =>
								setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
							}
						>
							Sort: {sortOrder}
						</Button>
						<Button
							variant="outline"
							disabled={isLoading}
							onClick={() => void refreshOrders()}
						>
							{isLoading ? "Refreshing..." : "Refresh"}
						</Button>
					</div>
				</S.HeaderRow>

				<div className="mt-4 flex flex-wrap items-end gap-3">
					<div className="min-w-[260px]">
						<div className="mb-1 text-xs text-muted-foreground">Group ID</div>
						<Input
							placeholder="Filter by groupId"
							value={groupIdDraft}
							onChange={(e) => setGroupIdDraft(e.target.value)}
							disabled={isLoading}
						/>
					</div>

					<div className="min-w-[180px]">
						<div className="mb-1 text-xs text-muted-foreground">Sort by</div>
						<select
							className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={sortBy}
							onChange={(e) => {
								setPage(1);
								setSortBy(e.target.value as any);
							}}
							disabled={isLoading}
						>
							<option value="createdAt">Created at</option>
							<option value="orderCode">Order code</option>
							<option value="orderStatus">Order status</option>
						</select>
					</div>

					<div className="min-w-[140px]">
						<div className="mb-1 text-xs text-muted-foreground">Page size</div>
						<Input
							type="number"
							min={1}
							value={pageSize}
							onChange={(e) => {
								const next = Number(e.target.value);
								setPage(1);
								setPageSize(Number.isFinite(next) && next > 0 ? next : 20);
							}}
							disabled={isLoading}
						/>
					</div>

					<Button variant="default" disabled={isLoading} onClick={applyFilters}>
						Apply
					</Button>
					<Button
						variant="outline"
						disabled={isLoading && !groupIdDraft}
						onClick={clearFilters}
					>
						Clear
					</Button>
				</div>
			</S.Panel>

			<S.TableCard>
				<S.TableHeader>
					<S.TableTitle>Orders</S.TableTitle>
					<S.TableSubtitle>
						{isLoading
							? "Loading orders..."
							: `Total: ${totalRecord} • Page: ${page}/${totalPage}`}
					</S.TableSubtitle>
				</S.TableHeader>

				{error ? (
					<S.ErrorState>{error}</S.ErrorState>
				) : isLoading ? (
					<S.LoadingState>Loading...</S.LoadingState>
				) : orders.length === 0 ? (
					<S.EmptyState>No orders to display yet.</S.EmptyState>
				) : (
					<div className="p-4">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[180px]">Order code</TableHead>
										<TableHead className="min-w-[120px]">Status</TableHead>
										<TableHead className="min-w-[220px]">
											Subscription
										</TableHead>
										<TableHead className="min-w-[220px]">Group</TableHead>
										<TableHead className="min-w-[120px]">Months</TableHead>
										<TableHead className="min-w-[180px]">Payment by</TableHead>
										<TableHead className="min-w-[200px]">Created at</TableHead>
										<TableHead className="min-w-[120px]">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orders.map((order) => {
										const { status, variant } = resolveStatusVariant(
											order.orderStatus,
										);
										return (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													{order.orderCode ?? order.id}
												</TableCell>
												<TableCell>
													<Badge variant={variant}>{status || "N/A"}</Badge>
												</TableCell>
												<TableCell>{resolveSubscriptionName(order)}</TableCell>
												<TableCell className="break-all">
													{resolveGroupName(order)}
												</TableCell>
												<TableCell>{order.monthQuantity ?? "-"}</TableCell>
												<TableCell>{order.paymentBy ?? "-"}</TableCell>
												<TableCell>{formatDateTime(order.createdAt)}</TableCell>
												<TableCell>
													<Button
														variant="outline"
														size="sm"
														onClick={() => void openDetail(order)}
													>
														View
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>

						{totalPage > 1 ? (
							<div className="mt-4">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												size="default"
												href="#"
												className={
													page <= 1 ? "pointer-events-none opacity-50" : ""
												}
												onClick={(e) => {
													e.preventDefault();
													if (page > 1) setPage(page - 1);
												}}
											/>
										</PaginationItem>

										{visiblePages.map((p, idx) => (
											<PaginationItem key={`${p}-${idx}`}>
												{p === "..." ? (
													<PaginationEllipsis />
												) : (
													<PaginationLink
														size="icon"
														href="#"
														isActive={p === page}
														onClick={(e) => {
															e.preventDefault();
															setPage(p);
														}}
													>
														{p}
													</PaginationLink>
												)}
											</PaginationItem>
										))}

										<PaginationItem>
											<PaginationNext
												size="default"
												href="#"
												className={
													page >= totalPage
														? "pointer-events-none opacity-50"
														: ""
												}
												onClick={(e) => {
													e.preventDefault();
													if (page < totalPage) setPage(page + 1);
												}}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						) : null}
					</div>
				)}
			</S.TableCard>
		</S.PageContainer>
	);
};

export default OrderHistory;
