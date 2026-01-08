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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ShareFund } from "@/services/shareFundAPI";
import type { Subscription } from "@/services/subscriptionAPI";
import { formatVnd } from "@/utils/format-currency";
import { CreditCard, Verified } from "lucide-react";

export type ComparisonRowKey =
	| "price"
	| "limitMembers"
	| "isAIActive"
	| "runCodePerDay"
	| "programmingLanguageInGroups"
	| "levelSubscription";

export type ComparisonRow = { key: ComparisonRowKey; label: string };

type Props = {
	canBuy: boolean;
	groupId: string;

	loading: boolean;
	error: string | null;
	hasPlans: boolean;
	sortedPlans: Subscription[];
	currentSubscriptionPlanId?: string | null;
	checkoutPlan: Subscription | null;

	creatingPlanId: string | null;
	hasAnyShareFund: boolean;
	shareFundBySubscriptionId: Map<string, ShareFund>;

	renderEnabledTag: (enabled: boolean) => JSX.Element;
	renderLanguageLimit: (value: number) => string;

	handlePayIndividually: (plan: Subscription) => void;
	openCreateFundDialog: (plan: Subscription) => void;

	comparisonRows: ReadonlyArray<ComparisonRow>;
	getCellValue: (plan: Subscription, key: ComparisonRowKey) => React.ReactNode;
};

export default function SystemSubscriptionsTab({
	canBuy,
	groupId,
	loading,
	error,
	hasPlans,
	sortedPlans,
	currentSubscriptionPlanId,
	checkoutPlan,
	creatingPlanId,
	hasAnyShareFund,
	shareFundBySubscriptionId,
	renderEnabledTag,
	renderLanguageLimit,
	handlePayIndividually,
	openCreateFundDialog,
	comparisonRows,
	getCellValue,
}: Props) {
	return (
		<div className="flex flex-col gap-4">
			{loading && (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">Loading plans...</p>
				</div>
			)}

			{!loading && error && (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">{error}</p>
				</div>
			)}

			{!loading && !error && !hasPlans && (
				<div className="rounded-md border bg-background p-4">
					<p className="text-sm text-muted-foreground">
						No subscription plans available.
					</p>
				</div>
			)}

			{!loading && !error && hasPlans && (
				<div className="flex w-full flex-row gap-4 overflow-x-auto pb-1">
					{sortedPlans.map((plan) => (
						<Card key={plan.id} className="min-w-[280px] flex flex-col">
							<CardHeader>
								<CardTitle>{plan.subscriptionName}</CardTitle>
								<CardDescription>
									{plan.subscriptionCode} • Level: {plan.levelSubscription}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Price</span>
										<span className="font-medium">{formatVnd(plan.price)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Limit members</span>
										<span className="font-medium">{plan.limitMembers}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">AI</span>
										<span className="font-medium">
											{renderEnabledTag(Boolean(plan.isAIActive))}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Run code/day</span>
										<span className="font-medium">{plan.runCodePerDay}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Languages in groups
										</span>
										<span className="font-medium">
											{renderLanguageLimit(plan.programmingLanguageInGroups)}
										</span>
									</div>
								</div>
							</CardContent>
							{Number(plan.price) > 0 && (
								<CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
									<div className="flex w-full flex-col gap-2">
										<Button
											type="button"
											variant="outline"
											className="w-full sm:w-auto"
											disabled={!groupId || checkoutPlan?.id === plan.id}
											onClick={() => void handlePayIndividually(plan)}
										>
											{checkoutPlan?.id === plan.id
												? "Checkout..."
												: canBuy
													? "Payment individually"
													: "Gift to group"}
										</Button>

										{canBuy && (
											<Button
												type="button"
												className="w-full sm:w-auto"
												disabled={
													!groupId ||
													creatingPlanId === plan.id ||
													hasAnyShareFund ||
													shareFundBySubscriptionId.has(plan.id)
												}
												onClick={() => openCreateFundDialog(plan)}
											>
												<CreditCard className="h-4 w-4" />
												{hasAnyShareFund
													? "Share fund exists"
													: shareFundBySubscriptionId.has(plan.id)
														? "Share fund created"
														: creatingPlanId === plan.id
															? " Creating..."
															: "Create share fund"}
											</Button>
										)}
									</div>
								</CardFooter>
							)}
							{currentSubscriptionPlanId === plan.id && (
								<div className="p-6 pt-4 flex justify-center">
									<Badge variant="secondary" className="bg-blue-500 text-white">
										<Verified className="mr-2" />
										Current plan
									</Badge>
								</div>
							)}
						</Card>
					))}
				</div>
			)}

			{!loading && !error && hasPlans && (
				<div className="rounded-md border bg-background">
					<div className="p-4">
						<p className="text-sm font-medium">Compare subscriptions</p>
						<p className="text-sm text-muted-foreground">
							Compare features across available plans.
						</p>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[180px]">Feature</TableHead>
								{sortedPlans.map((plan) => (
									<TableHead key={plan.id} className="min-w-[180px]">
										{plan.subscriptionName}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{comparisonRows.map((row) => (
								<TableRow key={row.key}>
									<TableCell className="font-medium">{row.label}</TableCell>
									{sortedPlans.map((plan) => (
										<TableCell key={`${plan.id}-${row.key}`}>
											{getCellValue(plan, row.key)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
					{!canBuy && (
						<div className="p-4 pt-3">
							<p className="text-sm text-muted-foreground">
								Members can gift a subscription to the group. Only the group
								owner can create a share fund.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
