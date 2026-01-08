import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { getOrderDetail, type Order } from "@/services/orderAPI";
import { formatVnd } from "@/utils/format-currency";

type Props = {
	groupId: string;
	loading: boolean;
	error: string | null;
	orders: Order[];
	onRefresh: () => void;
};

export default function GroupOrdersTab({
	groupId,
	loading,
	error,
	orders,
	onRefresh,
}: Props) {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState<string | null>(null);
	const activeDetailOrderIdRef = useRef<string | null>(null);

	const dateTimeFormatter = useMemo(() => {
		return new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}, []);

	const formatDateTime = (value: string | null | undefined) => {
		if (!value) return "-";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		return dateTimeFormatter.format(date);
	};

	const resolveSubscriptionName = (order: Order) => {
		return (
			order.subscription?.subscriptionName ??
			order.subscription?.subscriptionCode ??
			order.subscriptionId
		);
	};

	const resolveGroupName = (order: Order) => {
		return order.group?.name ?? order.groupId;
	};

	const handleStatusColor = (status: string) => {
		switch (status) {
			case "PAID":
				return "text-green-600 bg-green-100";
			case "SUCCESS":
				return "text-green-600 bg-green-100";
			case "PENDING":
				return "text-yellow-600 bg-yellow-100";
			case "FAILED":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const handleFullname = (
		firstName: string | undefined,
		lastName: string | undefined,
	) => {
		if (!firstName && !lastName) return "-";
		return `${firstName ?? ""} ${lastName ?? ""}`.trim();
	};

	const handleHiddenCode = (code: string) => {
		if (code.length <= 4) return "****";
		const splitCode = code.split("_")[1] || code;
		return `${splitCode.slice(0, 6)}****${splitCode.slice(-6)}`;
	};

	const getErrorMessage = (err: any, fallback: string) => {
		return String(err?.response?.data?.message ?? err?.message ?? fallback);
	};

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
				render: () => (
					<div className="font-medium">{selectedOrder.orderCode ?? "-"}</div>
				),
			},
			{
				key: "status",
				label: "Status:",
				render: () => (
					<div
						className={`font-medium px-2 py-1 rounded-md ${handleStatusColor(
							selectedOrder.orderStatus ?? "",
						)}`}
					>
						{selectedOrder.orderStatus ?? "-"}
					</div>
				),
			},
			{
				key: "subscription",
				label: "Subscription:",
				render: () => (
					<div className="font-medium">
						{resolveSubscriptionName(selectedOrder)}
					</div>
				),
			},
			{
				key: "group",
				label: "Group:",
				render: () => (
					<div className="font-medium break-all">
						{resolveGroupName(selectedOrder)}
					</div>
				),
			},
			{
				key: "months",
				label: "Month(s):",
				render: () => (
					<div className="font-medium">
						{selectedOrder.monthQuantity ?? "-"}
					</div>
				),
			},
			{
				key: "paymentBy",
				label: "Payment by:",
				render: () => (
					<div className="font-medium">{selectedOrder.paymentBy ?? "-"}</div>
				),
			},
			{
				key: "createdAt",
				label: "Created at:",
				render: () => (
					<div className="font-medium">
						{formatDateTime(selectedOrder.createdAt)}
					</div>
				),
			},
		];
	}, [
		selectedOrder,
		formatDateTime,
		resolveGroupName,
		resolveSubscriptionName,
		handleStatusColor,
	]);

	return (
		<div className="flex flex-col gap-4">
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
							Order details - #{selectedOrder?.id?.split("-")[0]}
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
						<div className="grid gap-2">
							<div className="grid grid-cols-2 gap-2 text-sm">
								{detailFields.map((field) => (
									<div
										key={field.key}
										className="contents flex gap-2 items-center"
									>
										<div className="text-muted-foreground min-w-[100px]">
											{field.label}
										</div>
										{field.render()}
									</div>
								))}
							</div>

							<h3 className="mt-4 mb-2 text-md font-medium">Transactions</h3>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[50px]">Code</TableHead>
										<TableHead className="min-w-[150px]">Type</TableHead>
										<TableHead className="min-w-[100px]">Method</TableHead>
										<TableHead className="min-w-[100px]">Amount</TableHead>
										<TableHead className="min-w-[100px]">Status</TableHead>
										<TableHead className="min-w-[100px]">Executed by</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{selectedOrder.orderTransactions &&
									selectedOrder.orderTransactions.length > 0 ? (
										selectedOrder.orderTransactions.map((transaction) => (
											<TableRow key={transaction.id}>
												<TableCell>
													{handleHiddenCode(transaction.transactionCode) ?? "-"}
												</TableCell>
												<TableCell>
													{transaction.transactionType ?? "-"}
												</TableCell>
												<TableCell>
													{transaction.paymentMethod ?? "-"}
												</TableCell>
												<TableCell>
													{transaction.vndAmount != null
														? `${formatVnd(transaction.vndAmount)}`
														: "-"}
												</TableCell>
												<TableCell className="flex">
													<div
														className={`font-medium px-2 py-1 rounded-md ${handleStatusColor(
															transaction.transactionStatus ?? "",
														)}`}
													>
														{transaction.transactionStatus ?? "-"}
													</div>
												</TableCell>
												<TableCell>
													{transaction.user?.avatarUrl ? (
														<img
															src={transaction.user.avatarUrl}
															alt="avatar"
															className="inline-block w-6 h-6 rounded-full mr-2"
														/>
													) : (
														""
													)}
													{handleFullname(
														transaction.user?.firstName,
														transaction.user?.lastName,
													)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center text-sm text-muted-foreground"
											>
												No transactions found for this order.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={closeDetail}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="rounded-md bg-background p-4 shadow-sm">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium">Orders</p>
						<p className="text-sm text-muted-foreground">
							Orders created after purchasing subscriptions (and share-fund
							donations until fully paid).
						</p>
					</div>
					<Button
						variant="outline"
						disabled={!groupId || loading}
						onClick={onRefresh}
					>
						{loading ? "Refreshing..." : "Refresh"}
					</Button>
				</div>
			</div>

			{!groupId ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">Missing group id.</p>
				</div>
			) : loading ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">Loading orders...</p>
				</div>
			) : error ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">{error}</p>
				</div>
			) : orders.length === 0 ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">
						No orders found for this group.
					</p>
				</div>
			) : (
				<div className="rounded-md border bg-background">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[220px]">Order code</TableHead>
								<TableHead className="min-w-[220px]">Subscription</TableHead>
								<TableHead className="min-w-[120px]">Months</TableHead>
								<TableHead className="min-w-[180px]">Payment by</TableHead>
								<TableHead className="min-w-[140px]">Status</TableHead>
								<TableHead className="min-w-[200px]">Created at</TableHead>
								<TableHead className="min-w-[120px]">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.orderCode ?? "-"}</TableCell>
									<TableCell>{resolveSubscriptionName(order)}</TableCell>
									<TableCell>{order.monthQuantity ?? "-"}</TableCell>
									<TableCell>{order.paymentBy ?? "-"}</TableCell>
									<TableCell>{order.orderStatus ?? "-"}</TableCell>
									<TableCell>{formatDateTime(order.createdAt)}</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											onClick={() => openDetail(order)}
										>
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
