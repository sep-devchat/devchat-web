import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { createDepositUrl } from "@/services/paymentAPI";
import { listShareFundsInGroup, type ShareFund } from "@/services/shareFundAPI";

type Props = {
	groupId: string;
};

const toNumberSafe = (value: unknown): number => {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
};

const clamp = (n: number, min: number, max: number) =>
	Math.min(max, Math.max(min, n));

const getErrorMessage = (err: unknown, fallback: string) => {
	const anyErr = err as any;
	return String(
		anyErr?.response?.data?.message ?? anyErr?.message ?? anyErr ?? fallback,
	);
};

const toIntAtLeastOne = (value: unknown): number => {
	const n = Math.floor(toNumberSafe(value));
	return Number.isFinite(n) && n >= 1 ? n : 1;
};

export default function ShareFundProgress({ groupId }: Props) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [funds, setFunds] = useState<ShareFund[]>([]);
	const [fundPendingDonate, setFundPendingDonate] = useState<ShareFund | null>(
		null,
	);
	const [donatingFundId, setDonatingFundId] = useState<string | null>(null);

	const refreshFunds = async () => {
		if (!groupId) return;
		setLoading(true);
		setError(null);
		try {
			const res = await listShareFundsInGroup(groupId);
			setFunds(res?.data ?? []);
		} catch (err: any) {
			setError(getErrorMessage(err, "Failed to load share funds"));
			setFunds([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void refreshFunds();
	}, [groupId]);

	const currency = useMemo(() => {
		const fmt = new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		});
		return (value: number) => fmt.format(value);
	}, []);

	const donateInfo = useMemo(() => {
		if (!fundPendingDonate) return null;

		const current = toNumberSafe(fundPendingDonate.currentVndAmount);
		const price = toNumberSafe(fundPendingDonate.subscription?.price);
		const monthQty = toIntAtLeastOne(fundPendingDonate.monthQuantity ?? 1);
		const target = price > 0 ? price * monthQty : 0;
		const contributeTime = toIntAtLeastOne(
			fundPendingDonate.contributeTime ?? 1,
		);
		const donateAmount = target > 0 ? Math.round(target / contributeTime) : 0;

		return { current, target, contributeTime, donateAmount };
	}, [fundPendingDonate]);

	const openDonateDialog = (fund: ShareFund) => setFundPendingDonate(fund);
	const closeDonateDialog = () => setFundPendingDonate(null);

	const confirmDonate = async () => {
		if (!groupId || !fundPendingDonate || !donateInfo) return;
		if (
			!Number.isFinite(donateInfo.donateAmount) ||
			donateInfo.donateAmount <= 0
		) {
			toast.error("Invalid donation amount.");
			return;
		}

		try {
			setDonatingFundId(fundPendingDonate.id);
			const res = await createDepositUrl({
				amount: Math.round(donateInfo.donateAmount),
				monthQuantity: toIntAtLeastOne(fundPendingDonate.monthQuantity ?? 1),
				groupId,
				subscriptionId: String(fundPendingDonate.subscriptionId),
				shareFundId: String(fundPendingDonate.id),
				transactionType: "DONATION",
			});
			const paymentUrl = res?.data?.paymentUrl;
			if (!paymentUrl) {
				toast.error("Failed to create payment URL.");
				return;
			}

			// Redirect to VNPay
			window.location.href = paymentUrl;
		} catch (err: any) {
			toast.error(getErrorMessage(err, "Failed to create payment"));
		} finally {
			setDonatingFundId(null);
		}
	};

	// Hide the whole widget unless we have at least one share fund.
	if (loading || error || funds.length === 0) return null;

	return (
		<div className="px-3">
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-3">
						{funds.map((fund) => {
							const current = toNumberSafe(fund.currentVndAmount);
							const price = toNumberSafe(fund.subscription?.price);
							const monthQty = toIntAtLeastOne(fund.monthQuantity ?? 1);
							const target = price > 0 ? price * monthQty : 0;
							const pct =
								target > 0 ? clamp((current / target) * 100, 0, 100) : 0;
							const contributeTime = toIntAtLeastOne(fund.contributeTime ?? 1);
							const donateAmount =
								target > 0 ? Math.round(target / contributeTime) : 0;

							const title = fund.fundName?.trim() || "Share fund";
							const subName =
								fund.subscription?.subscriptionName ?? "Subscription";

							return (
								<div key={fund.id} className="flex flex-col gap-2">
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0">
											<p className="text-xs font-medium truncate">{title}</p>
											<p className="text-[11px] text-muted-foreground truncate">
												{subName} • Target:{" "}
												{target > 0 ? currency(target) : "-"}
											</p>
										</div>
									</div>
									<Progress value={pct} />
									<div className="flex justify-between text-[11px] text-muted-foreground">
										<span>{pct.toFixed(0)}%</span>
										<span>
											{target > 0
												? `${currency(current)} / ${currency(target)}`
												: "-"}
										</span>
									</div>

									<div className="flex justify-end">
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={
												!groupId ||
												donateAmount <= 0 ||
												donatingFundId === fund.id
											}
											onClick={() => openDonateDialog(fund)}
										>
											{donatingFundId === fund.id ? "Donating..." : "Donate"}
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={!!fundPendingDonate}
				onOpenChange={(open) => {
					if (!open) closeDonateDialog();
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm donation</DialogTitle>
						<DialogDescription>
							Donate to this share fund? The donation amount is calculated as
							target / contribution limit.
						</DialogDescription>
					</DialogHeader>

					{fundPendingDonate && donateInfo && (
						<div className="grid gap-2 text-sm">
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Fund</span>
								<span className="text-right">
									{fundPendingDonate.fundName?.trim() || "Share fund"}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Target</span>
								<span className="text-right">
									{donateInfo.target > 0 ? currency(donateInfo.target) : "-"}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">
									Contribution limit
								</span>
								<span className="text-right">{donateInfo.contributeTime}</span>
							</div>
							<div className="flex justify-between gap-3 font-medium">
								<span>Donate amount</span>
								<span className="text-right">
									{donateInfo.donateAmount > 0
										? currency(donateInfo.donateAmount)
										: "-"}
								</span>
							</div>
						</div>
					)}

					<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline"
							className="w-full sm:w-auto"
							onClick={closeDonateDialog}
							disabled={!!donatingFundId}
						>
							Cancel
						</Button>
						<Button
							type="button"
							className="w-full sm:w-auto"
							disabled={
								!groupId ||
								!fundPendingDonate ||
								!!donatingFundId ||
								!donateInfo ||
								donateInfo.donateAmount <= 0
							}
							onClick={() => void confirmDonate()}
						>
							{donatingFundId ? "Donating..." : "Donate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
