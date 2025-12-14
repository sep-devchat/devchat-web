import { useEffect, useMemo, useState } from "react";
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
	DescripSection,
	SectionWrapper,
	TitleArea,
	TitleSection,
} from "../GroupSetting.styled";
import { CreditCard } from "lucide-react";
import {
	listSubscriptions,
	type Subscription,
} from "@/services/subscriptionAPI";
import { createShareFund } from "@/services/shareFundAPI";
import {
	deleteShareFund,
	donateShareFund,
	listShareFundsInGroup,
	type ShareFund,
} from "@/services/shareFundAPI";
import { createDepositUrl } from "@/services/paymentAPI";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

type SubscriptionSectionProps = {
	canBuy?: boolean;
	groupId: string;
};

export default function SubscriptionSection({
	canBuy = false,
	groupId,
}: SubscriptionSectionProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [creatingPlanId, setCreatingPlanId] = useState<string | null>(null);
	const [shareFunds, setShareFunds] = useState<ShareFund[]>([]);
	const [shareFundsLoading, setShareFundsLoading] = useState(false);
	const [shareFundsError, setShareFundsError] = useState<string | null>(null);
	const [donatingFundId, setDonatingFundId] = useState<string | null>(null);
	const [deletingFundId, setDeletingFundId] = useState<string | null>(null);
	const [fundPendingDelete, setFundPendingDelete] = useState<ShareFund | null>(
		null,
	);
	const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
	const [fundPendingDonate, setFundPendingDonate] = useState<ShareFund | null>(
		null,
	);
	const [donateAmountRaw, setDonateAmountRaw] = useState("10000");

	const getErrorMessage = (err: any, fallback: string) => {
		return String(err?.response?.data?.message ?? err?.message ?? fallback);
	};

	const renderEnabledTag = (enabled: boolean) => {
		return (
			<span
				className={
					"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
					(enabled ? "bg-green-600 text-white" : "bg-red-600 text-white")
				}
			>
				{enabled ? "Enabled" : "Disabled"}
			</span>
		);
	};

	const renderLanguageLimit = (value: number) => {
		return value === -1 ? "Unlimited" : String(value);
	};

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);

		listSubscriptions()
			.then((res) => {
				if (!mounted) return;
				setSubscriptions(res?.data ?? []);
			})
			.catch((err: any) => {
				if (!mounted) return;
				const message =
					err?.response?.data?.message ??
					err?.message ??
					"Failed to load subscription plans";
				setError(String(message));
				fireAlert("error", String(message));
			})
			.finally(() => {
				if (!mounted) return;
				setLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, []);

	const refreshShareFunds = async () => {
		if (!groupId) return;
		setShareFundsLoading(true);
		setShareFundsError(null);
		try {
			const res = await listShareFundsInGroup(groupId);
			setShareFunds(res?.data ?? []);
		} catch (err: any) {
			const message =
				err?.response?.data?.message ??
				err?.message ??
				"Failed to load share funds";
			setShareFundsError(String(message));
		} finally {
			setShareFundsLoading(false);
		}
	};

	useEffect(() => {
		refreshShareFunds();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	const hasPlans = subscriptions.length > 0;
	const sortedPlans = useMemo(() => {
		return [...subscriptions].sort((a, b) => {
			const aPrice = Number(a.price);
			const bPrice = Number(b.price);
			if (Number.isFinite(aPrice) && Number.isFinite(bPrice))
				return aPrice - bPrice;
			return String(a.subscriptionName).localeCompare(
				String(b.subscriptionName),
			);
		});
	}, [subscriptions]);

	const comparisonRows = useMemo(
		() =>
			[
				{ key: "price", label: "Price" },
				{ key: "limitMembers", label: "Limit members" },
				{ key: "isAIActive", label: "AI" },
				{ key: "runCodePerDay", label: "Run code/day" },
				{ key: "programmingLanguageInGroups", label: "Languages in groups" },
				{ key: "levelSubscription", label: "Level" },
			] as const,
		[],
	);

	const subscriptionById = useMemo(() => {
		const map = new Map<string, Subscription>();
		for (const plan of subscriptions) map.set(plan.id, plan);
		return map;
	}, [subscriptions]);

	const getCellValue = (
		plan: Subscription,
		key: (typeof comparisonRows)[number]["key"],
	) => {
		switch (key) {
			case "isAIActive":
				return renderEnabledTag(Boolean(plan.allowUseAI ?? plan.isAIActive));
			case "price":
				return String(plan.price);
			case "limitMembers":
				return String(plan.limitMembers);
			case "runCodePerDay":
				return String(plan.runCodePerDay);
			case "programmingLanguageInGroups":
				return renderLanguageLimit(plan.programmingLanguageInGroups);
			case "levelSubscription":
				return String(plan.levelSubscription);
			default:
				return "";
		}
	};

	const shareFundBySubscriptionId = useMemo(() => {
		const map = new Map<string, ShareFund>();
		for (const fund of shareFunds) {
			map.set(fund.subscriptionId, fund);
		}
		return map;
	}, [shareFunds]);

	const canSafelyDeleteFundInUI = (fund: ShareFund) => {
		try {
			return BigInt(fund.currentVndAmount ?? "0") === 0n;
		} catch {
			return false;
		}
	};

	const handlePayIndividually = async (plan: Subscription) => {
		if (!canBuy) {
			fireAlert("warning", "Only the group owner can choose payment option.");
			return;
		}
		if (!groupId) {
			fireAlert("error", "Missing group id.");
			return;
		}
		const amount = Number(plan.price);
		if (!Number.isFinite(amount) || amount <= 0) {
			fireAlert("error", "Invalid subscription price.");
			return;
		}

		try {
			setPayingPlanId(plan.id);
			const res = await createDepositUrl({
				amount: Math.round(amount),
				userId: `group:${groupId}|subscription:${plan.id}`,
			});
			const url = res?.data?.paymentUrl;
			if (url) {
				window.open(url, "_blank");
				fireAlert("success", "Opened VNPay payment page.");
			} else {
				fireAlert("error", "Payment URL not returned.");
			}
		} catch (err: any) {
			fireAlert("error", getErrorMessage(err, "Failed to create payment URL"));
		} finally {
			setPayingPlanId(null);
		}
	};

	const handleCreateShareFund = async (plan: Subscription) => {
		if (!canBuy) {
			fireAlert("warning", "Only the group owner can create a share fund.");
			return;
		}
		if (!groupId) {
			fireAlert("error", "Missing group id.");
			return;
		}

		try {
			setCreatingPlanId(plan.id);
			await createShareFund(groupId, { subscriptionId: plan.id });
			await refreshShareFunds();
			fireAlert(
				"success",
				`Created share fund for '${plan.subscriptionName}'.`,
			);
		} catch (err: any) {
			fireAlert("error", getErrorMessage(err, "Failed to create share fund"));
		} finally {
			setCreatingPlanId(null);
		}
	};

	const openDonateDialog = (fund: ShareFund) => {
		if (!groupId) return;
		setFundPendingDonate(fund);
		setDonateAmountRaw("10000");
	};

	const closeDonateDialog = () => {
		setFundPendingDonate(null);
	};

	const confirmDonate = async () => {
		if (!groupId || !fundPendingDonate) return;
		const amount = Number(donateAmountRaw);
		if (!Number.isFinite(amount) || amount <= 0) {
			fireAlert("error", "Invalid amount.");
			return;
		}

		try {
			setDonatingFundId(fundPendingDonate.id);
			await donateShareFund(groupId, fundPendingDonate.id, {
				amount: Math.round(amount),
			});
			await refreshShareFunds();
			setFundPendingDonate(null);
			fireAlert("success", "Donated successfully.");
		} catch (err: any) {
			fireAlert("error", getErrorMessage(err, "Failed to donate"));
		} finally {
			setDonatingFundId(null);
		}
	};

	const openDeleteDialog = (fund: ShareFund) => {
		if (!groupId) return;
		setFundPendingDelete(fund);
	};

	const closeDeleteDialog = () => {
		setFundPendingDelete(null);
	};

	const confirmDeleteFund = async () => {
		if (!groupId || !fundPendingDelete) return;
		try {
			setDeletingFundId(fundPendingDelete.id);
			await deleteShareFund(groupId, fundPendingDelete.id);
			await refreshShareFunds();
			setFundPendingDelete(null);
			fireAlert("success", "Deleted share fund.");
		} catch (err: any) {
			fireAlert("error", getErrorMessage(err, "Failed to delete share fund"));
		} finally {
			setDeletingFundId(null);
		}
	};

	return (
		<SectionWrapper>
			<TitleArea>
				<TitleSection>Subscription</TitleSection>
				<DescripSection>
					Buy subscription to unlock premium features.
				</DescripSection>
			</TitleArea>

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
							<Card key={plan.id} className="min-w-[280px]">
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
											<span className="font-medium">{plan.price}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Limit members
											</span>
											<span className="font-medium">{plan.limitMembers}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">AI</span>
											<span className="font-medium">
												{renderEnabledTag(
													Boolean(plan.allowUseAI ?? plan.isAIActive),
												)}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Run code/day
											</span>
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
								<CardFooter className="justify-end">
									<div className="flex flex-row gap-2">
										<Button
											variant="outline"
											disabled={!canBuy || !groupId || payingPlanId === plan.id}
											onClick={() => void handlePayIndividually(plan)}
										>
											{payingPlanId === plan.id
												? "Paying..."
												: "Pay individually"}
										</Button>

										<Button
											disabled={
												!canBuy ||
												!groupId ||
												creatingPlanId === plan.id ||
												shareFundBySubscriptionId.has(plan.id)
											}
											onClick={() => void handleCreateShareFund(plan)}
										>
											<CreditCard />
											{shareFundBySubscriptionId.has(plan.id)
												? "Share fund created"
												: creatingPlanId === plan.id
													? " Creating..."
													: "Create share fund"}
										</Button>
									</div>
								</CardFooter>
							</Card>
						))}
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
								No share funds yet. The group owner can create one above.
							</p>
						</div>
					) : (
						<div className="flex w-full flex-row gap-4 overflow-x-auto px-4 pb-4">
							{shareFunds.map((fund) => {
								const targetPriceRaw =
									fund.subscription?.price ??
									subscriptionById.get(fund.subscriptionId)?.price;
								const targetVnd = Number(targetPriceRaw);
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

										<CardFooter className="justify-end">
											<div className="flex flex-row gap-2">
												<Button
													disabled={!groupId || donatingFundId === fund.id}
													onClick={() => openDonateDialog(fund)}
												>
													{donatingFundId === fund.id
														? "Donating..."
														: "Donate"}
												</Button>

												{canBuy && (
													<Button
														variant="destructive"
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

				<Dialog
					open={!!fundPendingDelete}
					onOpenChange={(open) => {
						if (!open) closeDeleteDialog();
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete share fund</DialogTitle>
							<DialogDescription>
								Delete this share fund? This is only possible if it has no
								contributions.
							</DialogDescription>
						</DialogHeader>

						<DialogFooter className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={closeDeleteDialog}
								disabled={!!deletingFundId}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								disabled={!groupId || !fundPendingDelete || !!deletingFundId}
								onClick={() => void confirmDeleteFund()}
							>
								{deletingFundId ? "Deleting..." : "Delete"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog
					open={!!fundPendingDonate}
					onOpenChange={(open) => {
						if (!open) closeDonateDialog();
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Donate to share fund</DialogTitle>
							<DialogDescription>
								Enter the amount you want to donate (VND).
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-2">
							<Input
								autoFocus
								type="number"
								min={1}
								value={donateAmountRaw}
								onChange={(e) => setDonateAmountRaw(e.target.value)}
								disabled={!!donatingFundId}
								placeholder="10000"
							/>
						</div>

						<DialogFooter className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={closeDonateDialog}
								disabled={!!donatingFundId}
							>
								Cancel
							</Button>
							<Button
								disabled={!groupId || !fundPendingDonate || !!donatingFundId}
								onClick={() => void confirmDonate()}
							>
								{donatingFundId ? "Donating..." : "Donate"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

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
									Only the group owner can purchase a subscription.
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</SectionWrapper>
	);
}
