import { useEffect, useMemo, useState } from "react";
import { AlertContainer } from "@/components/custom/AlertCustom/Alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	DescripSection,
	SectionWrapper,
	TitleArea,
	TitleSection,
} from "../../GroupSetting.styled";
import {
	getGroupSubscriptions,
	type GroupSubscriptionInGroup,
} from "@/services/groupAPI";
import {
	listSubscriptions,
	type Subscription,
} from "@/services/subscriptionAPI";
import {
	createShareFund,
	deleteShareFund,
	donateShareFund,
	listShareFundsInGroup,
	type ShareFund,
} from "@/services/shareFundAPI";
import { listTransactions, type Transaction } from "@/services/transactionAPI";
import CheckoutSection from "./CheckoutSection";
import GroupSubscriptionsTab from "./GroupSubscriptionsTab";
import GroupTransactionsTab from "./GroupTransactionsTab";
import SystemSubscriptionsTab, {
	type ComparisonRow,
	type ComparisonRowKey,
} from "./SystemSubscriptionsTab";
import RequiredMark from "@/components/custom/RequiredMark";

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

type ActiveTab = "group" | "system" | "transactions";

export default function SubscriptionSection({
	canBuy = false,
	groupId,
}: SubscriptionSectionProps) {
	const [activeTab, setActiveTab] = useState<ActiveTab>("group");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

	const [checkoutPlan, setCheckoutPlan] = useState<Subscription | null>(null);

	const [groupSubscriptionsLoading, setGroupSubscriptionsLoading] =
		useState(false);
	const [groupSubscriptionsError, setGroupSubscriptionsError] = useState<
		string | null
	>(null);
	const [currentGroupSubscription, setCurrentGroupSubscription] =
		useState<GroupSubscriptionInGroup | null>(null);
	const [groupAllSubscriptions, setGroupAllSubscriptions] = useState<
		GroupSubscriptionInGroup[]
	>([]);

	const [shareFunds, setShareFunds] = useState<ShareFund[]>([]);
	const [shareFundsLoading, setShareFundsLoading] = useState(false);
	const [shareFundsError, setShareFundsError] = useState<string | null>(null);

	const [creatingPlanId, setCreatingPlanId] = useState<string | null>(null);
	const [donatingFundId, setDonatingFundId] = useState<string | null>(null);
	const [deletingFundId, setDeletingFundId] = useState<string | null>(null);

	const [fundPendingDonate, setFundPendingDonate] = useState<ShareFund | null>(
		null,
	);
	const [donateAmountRaw, setDonateAmountRaw] = useState("10000");
	const [fundPendingDelete, setFundPendingDelete] = useState<ShareFund | null>(
		null,
	);

	const [planPendingCreateFund, setPlanPendingCreateFund] =
		useState<Subscription | null>(null);
	const [createFundNameRaw, setCreateFundNameRaw] = useState("");
	const [createFundContributeTimeRaw, setCreateFundContributeTimeRaw] =
		useState("");
	const [createFundMonthQuantityRaw, setCreateFundMonthQuantityRaw] =
		useState("1");

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	type LoadedMarker = { groupId: string } | null;
	const [transactionsLoadedFor, setTransactionsLoadedFor] =
		useState<LoadedMarker>(null);
	const [transactionsLoading, setTransactionsLoading] = useState(false);
	const [transactionsError, setTransactionsError] = useState<string | null>(
		null,
	);

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

	const formatDateTime = useMemo(() => {
		const fmt = new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
		return (value: string | null | undefined) => {
			if (!value) return "-";
			const date = new Date(value);
			if (Number.isNaN(date.getTime())) return "-";
			return fmt.format(date);
		};
	}, []);

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
				const message = getErrorMessage(
					err,
					"Failed to load subscription plans",
				);
				setError(message);
				fireAlert("error", message);
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
			setShareFundsError(getErrorMessage(err, "Failed to load share funds"));
		} finally {
			setShareFundsLoading(false);
		}
	};

	useEffect(() => {
		void refreshShareFunds();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	useEffect(() => {
		// Reset transaction state when group changes.
		setTransactions([]);
		setTransactionsError(null);
		setTransactionsLoadedFor(null);
		setTransactionsLoading(false);
	}, [groupId]);

	useEffect(() => {
		let mounted = true;
		if (!groupId) {
			setCurrentGroupSubscription(null);
			setGroupAllSubscriptions([]);
			setGroupSubscriptionsError(null);
			setGroupSubscriptionsLoading(false);
			return;
		}

		setGroupSubscriptionsLoading(true);
		setGroupSubscriptionsError(null);
		getGroupSubscriptions(groupId)
			.then((res) => {
				if (!mounted) return;
				setCurrentGroupSubscription(res?.data?.currentSubscription ?? null);
				setGroupAllSubscriptions(res?.data?.subscriptions ?? []);
			})
			.catch((err: any) => {
				if (!mounted) return;
				setGroupSubscriptionsError(
					getErrorMessage(err, "Failed to load group subscriptions"),
				);
			})
			.finally(() => {
				if (!mounted) return;
				setGroupSubscriptionsLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, [groupId]);

	const hasPlans = subscriptions.length > 0;
	const currentSubscriptionPlanId = currentGroupSubscription?.subscriptionId;
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

	const comparisonRows = useMemo<ComparisonRow[]>(
		() => [
			{ key: "price", label: "Price" },
			{ key: "limitMembers", label: "Limit members" },
			{ key: "isAIActive", label: "AI" },
			{ key: "runCodePerDay", label: "Run code/day" },
			{ key: "programmingLanguageInGroups", label: "Languages in groups" },
			{ key: "levelSubscription", label: "Level" },
		],
		[],
	);

	const subscriptionById = useMemo(() => {
		const map = new Map<string, Subscription>();
		for (const plan of subscriptions) map.set(plan.id, plan);
		return map;
	}, [subscriptions]);

	const groupSubscriptionsInTab = groupAllSubscriptions;

	const resolveSubscriptionName = (sub: GroupSubscriptionInGroup) => {
		return (
			sub.subscription?.subscriptionName ??
			subscriptionById.get(sub.subscriptionId)?.subscriptionName ??
			"(unknown)"
		);
	};

	const getCellValue = (plan: Subscription, key: ComparisonRowKey) => {
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

	const handlePayIndividually = (plan: Subscription) => {
		if (!groupId) {
			fireAlert("error", "Missing group id.");
			return;
		}
		setCheckoutPlan(plan);
	};

	const openCreateFundDialog = (plan: Subscription) => {
		if (!canBuy) {
			fireAlert("warning", "Only the group owner can create a share fund.");
			return;
		}
		if (shareFunds.length > 0) {
			fireAlert("warning", "A share fund already exists in this group.");
			return;
		}
		if (!groupId) {
			fireAlert("error", "Missing group id.");
			return;
		}
		setPlanPendingCreateFund(plan);
		setCreateFundNameRaw("");
		setCreateFundContributeTimeRaw("");
		setCreateFundMonthQuantityRaw("1");
	};

	const closeCreateFundDialog = () => {
		setPlanPendingCreateFund(null);
	};

	const confirmCreateFund = async () => {
		if (!canBuy || !groupId || !planPendingCreateFund) return;

		const planId = planPendingCreateFund.id;
		const planName = planPendingCreateFund.subscriptionName;

		const fundName = createFundNameRaw.trim();
		const monthQuantityRaw = createFundMonthQuantityRaw.trim();
		const monthQuantityParsed = Number(monthQuantityRaw);
		if (
			!Number.isFinite(monthQuantityParsed) ||
			monthQuantityParsed < 1 ||
			!Number.isInteger(monthQuantityParsed)
		) {
			fireAlert("error", "Month quantity must be an integer ≥ 1.");
			return;
		}
		const monthQuantity = monthQuantityParsed;

		const contributeTimeRaw = createFundContributeTimeRaw.trim();
		let contributeTime: number | null | undefined = undefined;
		if (contributeTimeRaw.length > 0) {
			const parsed = Number(contributeTimeRaw);
			if (!Number.isFinite(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
				fireAlert(
					"error",
					"Contribution limit must be an integer ≥ 1 (or leave blank).",
				);
				return;
			}
			contributeTime = parsed;
		}

		try {
			setCreatingPlanId(planId);
			await createShareFund(groupId, {
				subscriptionId: planId,
				monthQuantity,
				fundName: fundName.length > 0 ? fundName : null,
				contributeTime,
			});
			await refreshShareFunds();
			setPlanPendingCreateFund(null);
			fireAlert("success", `Created share fund for '${planName}'.`);
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

	const refreshTransactions = async () => {
		if (!groupId) return;
		setTransactionsLoading(true);
		setTransactionsError(null);
		try {
			const res = await listTransactions({ page: 1, take: 20, groupId });
			setTransactions(res?.data ?? []);
			setTransactionsLoadedFor({ groupId });
		} catch (err: any) {
			setTransactionsError(getErrorMessage(err, "Failed to load transactions"));
		} finally {
			setTransactionsLoading(false);
		}
	};

	useEffect(() => {
		if (activeTab !== "transactions") return;
		if (!groupId) return;
		if (transactionsLoadedFor?.groupId === groupId) return;
		void refreshTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab, groupId, transactionsLoadedFor?.groupId]);

	const resolveTransactionTarget = (tx: Transaction): string => {
		if (tx.subscriptionId) {
			const planName =
				tx.subscription?.subscriptionName ??
				subscriptionById.get(tx.subscriptionId)?.subscriptionName;
			return planName ? `Subscription: ${planName}` : "Subscription";
		}
		if (tx.shareFundId) {
			const fund = shareFunds.find((f) => f.id === tx.shareFundId);
			return fund ? `Share fund: ${fund.fundName ?? fund.id}` : "Share fund";
		}
		return "-";
	};

	return (
		<SectionWrapper>
			<AlertContainer />

			<CheckoutSection
				open={!!checkoutPlan}
				plan={checkoutPlan}
				groupId={groupId}
				onOpenChange={(open) => {
					if (!open) setCheckoutPlan(null);
				}}
			/>

			<TitleArea>
				<TitleSection>Subscription</TitleSection>
				<DescripSection>
					Buy subscription to unlock premium features.
				</DescripSection>
			</TitleArea>

			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as ActiveTab)}
			>
				<TabsList className="w-full justify-start">
					<TabsTrigger value="group">Group</TabsTrigger>
					<TabsTrigger value="system">System subscriptions</TabsTrigger>
					<TabsTrigger value="transactions">Transactions</TabsTrigger>
				</TabsList>

				<TabsContent value="group">
					<GroupSubscriptionsTab
						groupId={groupId}
						groupSubscriptionsLoading={groupSubscriptionsLoading}
						groupSubscriptionsError={groupSubscriptionsError}
						currentGroupSubscription={currentGroupSubscription}
						groupAllSubscriptions={groupSubscriptionsInTab}
						currentSubscriptionPlanId={currentSubscriptionPlanId}
						resolveSubscriptionName={resolveSubscriptionName}
						formatDateTime={formatDateTime}
						shareFundsLoading={shareFundsLoading}
						shareFundsError={shareFundsError}
						shareFunds={shareFunds}
						donatingFundId={donatingFundId}
						deletingFundId={deletingFundId}
						canBuy={canBuy}
						canSafelyDeleteFundInUI={canSafelyDeleteFundInUI}
						openDonateDialog={openDonateDialog}
						openDeleteDialog={openDeleteDialog}
						getTargetSubscriptionPrice={(subscriptionId) =>
							subscriptionById.get(subscriptionId)?.price
						}
					/>
				</TabsContent>

				<TabsContent value="system">
					<SystemSubscriptionsTab
						canBuy={canBuy}
						groupId={groupId}
						loading={loading}
						error={error}
						hasPlans={hasPlans}
						sortedPlans={sortedPlans}
						currentSubscriptionPlanId={currentSubscriptionPlanId}
						checkoutPlan={checkoutPlan}
						creatingPlanId={creatingPlanId}
						hasAnyShareFund={shareFunds.length > 0}
						shareFundBySubscriptionId={shareFundBySubscriptionId}
						renderEnabledTag={renderEnabledTag}
						renderLanguageLimit={renderLanguageLimit}
						handlePayIndividually={handlePayIndividually}
						openCreateFundDialog={openCreateFundDialog}
						comparisonRows={comparisonRows}
						getCellValue={getCellValue}
					/>
				</TabsContent>

				<TabsContent value="transactions">
					<GroupTransactionsTab
						groupId={groupId}
						loading={transactionsLoading}
						error={transactionsError}
						transactions={transactions}
						resolveTransactionTarget={resolveTransactionTarget}
						onRefresh={() => void refreshTransactions()}
					/>
				</TabsContent>
			</Tabs>

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

					<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={closeDeleteDialog}
							disabled={!!deletingFundId}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							className="w-full sm:w-auto"
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

					<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={closeDonateDialog}
							disabled={!!donatingFundId}
						>
							Cancel
						</Button>
						<Button
							className="w-full sm:w-auto"
							disabled={!groupId || !fundPendingDonate || !!donatingFundId}
							onClick={() => void confirmDonate()}
						>
							{donatingFundId ? "Donating..." : "Donate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!planPendingCreateFund}
				onOpenChange={(open) => {
					if (!open) closeCreateFundDialog();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create share fund</DialogTitle>
						<DialogDescription>
							Set up details for a new share fund.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-3">
						<div className="grid gap-2">
							<p className="text-sm font-medium">Fund name</p>
							<Input
								autoFocus
								value={createFundNameRaw}
								onChange={(e) => setCreateFundNameRaw(e.target.value)}
								disabled={!!creatingPlanId}
								placeholder={
									planPendingCreateFund
										? `${planPendingCreateFund.subscriptionName} fund`
										: "Share fund"
								}
							/>
						</div>

						<div className="grid gap-2">
							<p className="text-sm font-medium">
								Month quantity <RequiredMark />
							</p>
							<Input
								type="number"
								min={1}
								step={1}
								value={createFundMonthQuantityRaw}
								onChange={(e) => setCreateFundMonthQuantityRaw(e.target.value)}
								disabled={!!creatingPlanId}
								placeholder="1"
							/>
							<p className="text-xs text-muted-foreground">
								How many months this share fund is intended to purchase.
							</p>
						</div>

						<div className="grid gap-2">
							<p className="text-sm font-medium">
								Contribution limit <RequiredMark />
							</p>
							<Input
								type="number"
								min={1}
								step={1}
								value={createFundContributeTimeRaw}
								onChange={(e) => setCreateFundContributeTimeRaw(e.target.value)}
								disabled={!!creatingPlanId}
								placeholder="1"
							/>
							<p className="text-xs text-muted-foreground">
								Max donation times allowed for this fund.
							</p>
						</div>
					</div>

					<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={closeCreateFundDialog}
							disabled={!!creatingPlanId}
						>
							Cancel
						</Button>
						<Button
							className="w-full sm:w-auto"
							disabled={!groupId || !planPendingCreateFund || !!creatingPlanId}
							onClick={() => void confirmCreateFund()}
						>
							{creatingPlanId ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SectionWrapper>
	);
}
