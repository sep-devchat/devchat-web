import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/services/transactionAPI";

type Props = {
	groupId: string;
	loading: boolean;
	error: string | null;
	transactions: Transaction[];
	resolveTransactionTarget: (tx: Transaction) => string;
	onRefresh: () => void;
};

export default function GroupTransactionsTab({
	groupId,
	loading,
	error,
	transactions,
	resolveTransactionTarget,
	onRefresh,
}: Props) {
	const vndFormatter = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	});

	const formatVnd = (amount: string | number | null | undefined): string => {
		if (amount === null || amount === undefined) return "-";
		if (typeof amount === "number" && Number.isFinite(amount)) {
			return vndFormatter.format(amount);
		}

		const raw = String(amount).trim();
		if (!raw) return "-";
		const numeric = Number(raw.replace(/[^0-9.-]/g, ""));
		if (!Number.isFinite(numeric)) return raw;
		return vndFormatter.format(numeric);
	};

	const handleUsername = (tx: Transaction): string => {
		if (tx.user?.firstName || tx.user?.lastName) {
			return `${tx.user.firstName ?? ""} ${tx.user.lastName ?? ""}`.trim();
		}

		return tx.user?.username ?? tx.user?.email ?? "Unknown User";
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-md border bg-background p-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium">Transactions</p>
						<p className="text-sm text-muted-foreground">
							Transactions related to this group (subscription payments and
							share-fund donations).
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
					<p className="text-sm text-muted-foreground">
						Loading transactions...
					</p>
				</div>
			) : error ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">{error}</p>
				</div>
			) : transactions.length === 0 ? (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">
						No transactions found for this group.
					</p>
				</div>
			) : (
				<div className="rounded-md border bg-background">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-[200px]">Payment user</TableHead>
								<TableHead className="min-w-[140px]">Amount (VND)</TableHead>
								<TableHead className="min-w-[160px]">Type</TableHead>
								<TableHead className="min-w-[160px]">Status</TableHead>
								<TableHead className="min-w-[160px]">Method</TableHead>
								<TableHead className="min-w-[220px]">Related</TableHead>
								<TableHead className="min-w-[280px]">Message</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((tx) => (
								<TableRow key={tx.id}>
									<TableCell className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												src={tx.user?.avatarUrl}
												alt={handleUsername(tx)}
											/>
											<AvatarFallback>
												{handleUsername(tx).charAt(0)}
											</AvatarFallback>
										</Avatar>
										{handleUsername(tx)}
									</TableCell>
									<TableCell>{formatVnd(tx.vndAmount)}</TableCell>
									<TableCell>{tx.transactionType}</TableCell>
									<TableCell>{tx.transactionStatus}</TableCell>
									<TableCell>{tx.paymentMethod}</TableCell>
									<TableCell>{resolveTransactionTarget(tx)}</TableCell>
									<TableCell>{tx.transactionMessage ?? "-"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
