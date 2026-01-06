import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { GroupSubscriptionInGroup } from "@/services/groupAPI";
import type { ShareFund } from "@/services/shareFundAPI";

type Props = {
	groupId: string;

	groupSubscriptionsLoading: boolean;
	groupSubscriptionsError: string | null;
	currentGroupSubscription: GroupSubscriptionInGroup | null;
	groupAllSubscriptions: GroupSubscriptionInGroup[];
	currentSubscriptionPlanId?: string | null;
	resolveSubscriptionName: (sub: GroupSubscriptionInGroup) => string;
	formatDateTime: (value: string | null | undefined) => string;

	shareFundsLoading: boolean;
	shareFundsError: string | null;
	shareFunds: ShareFund[];
	donatingFundId: string | null;
	deletingFundId: string | null;
	canBuy: boolean;
	canSafelyDeleteFundInUI: (fund: ShareFund) => boolean;
	openDonateDialog: (fund: ShareFund) => void;
	openDeleteDialog: (fund: ShareFund) => void;
	getTargetSubscriptionPrice: (
		subscriptionId: string,
	) => string | number | null | undefined;
};

export default function GroupSubscriptionsTab({
	groupId,
	groupSubscriptionsLoading,
	groupSubscriptionsError,
	currentGroupSubscription,
	groupAllSubscriptions,
	currentSubscriptionPlanId,
	resolveSubscriptionName,
	formatDateTime,
	shareFundsLoading,
	shareFundsError,
	shareFunds,
	deletingFundId,
	canBuy,
	canSafelyDeleteFundInUI,
	openDeleteDialog,
	getTargetSubscriptionPrice,
}: Props) {
	const normalizeStatus = (value: unknown): string => {
		return String(value ?? "")
			.trim()
			.replace(/\s+/g, "_")
			.toUpperCase();
	};

	const getStatusBadgeVariant = (
		status: unknown,
	): "default" | "secondary" | "destructive" | "outline" => {
		const s = normalizeStatus(status);
		if (!s) return "outline";

		if (
			s.includes("ACTIVE") ||
			s.includes("PAID") ||
			s.includes("SUCCESS") ||
			s.includes("COMPLETED") ||
			s.includes("DONE")
		) {
			return "default";
		}

		if (s.includes("PENDING") || s.includes("PROCESS") || s.includes("WAIT")) {
			return "secondary";
		}

		if (
			s.includes("EXPIRE") ||
			s.includes("CANCEL") ||
			s.includes("FAIL") ||
			s.includes("REJECT") ||
			s.includes("INACTIVE")
		) {
			return "destructive";
		}

		return "outline";
	};

	const getStatusBadgeClassName = (status: unknown): string => {
		switch (getStatusBadgeVariant(status)) {
			case "default":
				return "border-primary/30 bg-primary/10 text-primary";
			case "secondary":
				return "border-secondary/60 bg-secondary/40 text-foreground";
			case "destructive":
				return "border-destructive/30 bg-destructive/10 text-destructive";
			default:
				return "";
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{groupSubscriptionsLoading && (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">
						Loading current group plan...
					</p>
				</div>
			)}

			{!groupSubscriptionsLoading && groupSubscriptionsError && (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">
						{groupSubscriptionsError}
					</p>
				</div>
			)}

			{!groupSubscriptionsLoading &&
				!groupSubscriptionsError &&
				currentGroupSubscription?.subscription && (
					<div className="rounded-md border bg-background p-4">
						<p className="text-sm">
							<span className="text-muted-foreground">Current plan: </span>
							<span className="font-medium">
								{String(
									currentGroupSubscription.subscription.subscriptionName ??
										"(unknown)",
								)}
							</span>
						</p>
					</div>
				)}

			{!groupSubscriptionsLoading && !groupSubscriptionsError && groupId && (
				<div className="rounded-md border bg-background">
					<div className="p-4">
						<p className="text-sm font-medium">Group subscriptions</p>
						<p className="text-sm text-muted-foreground">
							All subscriptions this group has (including history).
						</p>
					</div>
					{groupAllSubscriptions.length === 0 ? (
						<div className="p-4 pt-0">
							<p className="text-sm text-muted-foreground">
								No subscriptions found for this group.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="min-w-[200px]">Plan</TableHead>
									<TableHead className="min-w-[140px]">Status</TableHead>
									<TableHead className="min-w-[120px]">Months</TableHead>
									<TableHead className="min-w-[220px]">Started</TableHead>
									<TableHead className="min-w-[220px]">Ended</TableHead>
									<TableHead className="min-w-[180px]">Payment by</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{groupAllSubscriptions.map((sub) => {
									const isCurrent =
										sub.subscriptionId === currentSubscriptionPlanId;
									return (
										<TableRow key={sub.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													<span>{resolveSubscriptionName(sub)}</span>
													{isCurrent && (
														<Badge variant="secondary">Current</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={getStatusBadgeClassName(
														sub.groupSubscriptionStatus,
													)}
												>
													{String(sub.groupSubscriptionStatus ?? "-")}
												</Badge>
											</TableCell>
											<TableCell>
												{String(
													sub.monthQuantity
														? sub.monthQuantity < 0
															? "Unlimited"
															: sub.monthQuantity
														: "-",
												)}
											</TableCell>
											<TableCell>{formatDateTime(sub.startedAt)}</TableCell>
											<TableCell>{formatDateTime(sub.endedAt)}</TableCell>
											<TableCell>{sub.paymentBy ?? "-"}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</div>
			)}

			<div className="rounded-md border bg-background">
				<div className="p-4">
					<p className="text-sm font-medium">Share funds</p>
					<p className="text-sm text-muted-foreground">
						Group members can donate to help the group buy a subscription.
					</p>
				</div>

				{!groupId ? (
					<div className="p-4 pt-0">
						<p className="text-sm text-muted-foreground">Missing group id.</p>
					</div>
				) : shareFundsLoading ? (
					<div className="p-4 pt-0">
						<p className="text-sm text-muted-foreground">
							Loading share funds...
						</p>
					</div>
				) : shareFundsError ? (
					<div className="p-4 pt-0">
						<p className="text-sm text-muted-foreground">{shareFundsError}</p>
					</div>
				) : shareFunds.length === 0 ? (
					<div className="p-4 pt-0">
						<p className="text-sm text-muted-foreground">
							No share funds yet. The group owner can create one in the "System
							subscriptions" tab.
						</p>
					</div>
				) : (
					<div className="flex w-full flex-row gap-4 overflow-x-auto px-4 pb-4">
						{shareFunds.map((fund) => {
							const targetPriceRaw =
								fund.subscription?.price ??
								getTargetSubscriptionPrice(fund.subscriptionId);
							const monthQuantity = Number(fund.monthQuantity ?? "0");
							const targetVnd = Number(targetPriceRaw) * monthQuantity;
							const currentVnd = Number(fund.currentVndAmount ?? "0");
							const progressPct =
								Number.isFinite(targetVnd) &&
								targetVnd > 0 &&
								Number.isFinite(currentVnd)
									? Math.min(
											100,
											Math.max(0, Math.round((currentVnd / targetVnd) * 100)),
										)
									: 0;

							return (
								<Card key={fund.id} className="min-w-[280px]">
									<CardHeader>
										<CardTitle>{fund.fundName ?? "Share fund"}</CardTitle>
										<CardDescription>
											Current amount: {fund.currentVndAmount} VND
										</CardDescription>
									</CardHeader>

									<CardContent>
										<div className="flex flex-col gap-2">
											<Progress value={progressPct} />
											<p className="text-xs text-muted-foreground">
												{Number.isFinite(targetVnd) && targetVnd > 0
													? `Progress: ${progressPct}% • Target: ${targetVnd} VND`
													: "Target: N/A"}
											</p>
										</div>
									</CardContent>

									<CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
										<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
											{canBuy && (
												<Button
													variant="destructive"
													className="w-full sm:w-auto"
													disabled={
														!groupId ||
														deletingFundId === fund.id ||
														!canSafelyDeleteFundInUI(fund)
													}
													onClick={() => openDeleteDialog(fund)}
												>
													{deletingFundId === fund.id
														? "Deleting..."
														: "Delete"}
												</Button>
											)}
										</div>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
