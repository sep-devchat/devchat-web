import { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Subscription } from "@/services/subscriptionAPI";
import { createDepositUrl } from "@/services/paymentAPI";

type AlertType = "success" | "warning" | "error";
const fireAlert = (type: AlertType, message: string, duration = 4000) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent("app:alert", { detail: { type, message, duration } }),
	);
};

export type CheckoutSectionProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groupId: string;
	plan: Subscription | null;
};

export default function CheckoutSection({
	open,
	onOpenChange,
	groupId,
	plan,
}: CheckoutSectionProps) {
	const monthOptions = useMemo(() => [1, 3, 6, 12] as const, []);
	const [monthsRaw, setMonthsRaw] = useState<(typeof monthOptions)[number]>(1);
	const [paying, setPaying] = useState(false);

	const formatVnd = useMemo(() => {
		return (value: number) =>
			new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
				maximumFractionDigits: 0,
			}).format(value);
	}, []);

	useEffect(() => {
		if (!open) return;
		setMonthsRaw(1);
		setPaying(false);
	}, [open, plan?.id]);

	const unitPrice = useMemo(() => {
		const amount = Number(plan?.price);
		return Number.isFinite(amount) ? amount : NaN;
	}, [plan?.price]);

	const months = useMemo(() => {
		const parsed = Number(monthsRaw);
		if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return NaN;
		if (!monthOptions.includes(parsed as (typeof monthOptions)[number]))
			return NaN;
		return parsed;
	}, [monthOptions, monthsRaw]);

	const total = useMemo(() => {
		if (!Number.isFinite(unitPrice) || !Number.isFinite(months)) return NaN;
		return unitPrice * months;
	}, [unitPrice, months]);

	const canSubmit =
		!!groupId &&
		!!plan?.id &&
		Number.isFinite(unitPrice) &&
		Number.isFinite(months) &&
		months >= 1 &&
		total > 0;

	const handlePay = async () => {
		if (!plan) return;
		if (!groupId) {
			fireAlert("error", "Missing group id.");
			return;
		}
		if (!canSubmit) {
			fireAlert("error", "Invalid invoice info.");
			return;
		}

		try {
			setPaying(true);
			const res = await createDepositUrl({
				amount: Math.round(total),
				monthQuantity: months,
				groupId,
				subscriptionId: plan.id,
			});
			const url = res?.data?.paymentUrl;
			if (!url) {
				fireAlert("error", "Payment URL not returned.");
				return;
			}

			const popup = window.open(url, "_blank");
			if (popup) {
				fireAlert("success", "Opened VNPay payment page.");
				onOpenChange(false);
			} else {
				fireAlert(
					"warning",
					"Payment URL created, but the popup was blocked. Please allow popups then try again.",
				);
			}
		} catch (err: any) {
			const message = String(
				err?.response?.data?.message ??
					err?.message ??
					"Failed to create payment URL",
			);
			fireAlert("error", message);
		} finally {
			setPaying(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Checkout</DialogTitle>
					<DialogDescription>
						Review invoice details, choose months, then proceed to VNPay.
					</DialogDescription>
				</DialogHeader>

				<Card>
					<CardContent className="pt-6">
						<div className="grid gap-2 text-sm">
							<div className="flex items-center justify-between gap-4">
								<span className="text-muted-foreground">Plan</span>
								<span className="font-medium">
									{plan?.subscriptionName ?? "(unknown)"}
								</span>
							</div>
							<div className="flex items-center justify-between gap-4">
								<span className="text-muted-foreground">Unit price</span>
								<span className="font-medium">
									{Number.isFinite(unitPrice)
										? `${formatVnd(unitPrice)}/month`
										: "N/A"}
								</span>
							</div>
							<div className="flex items-center justify-between gap-4">
								<span className="text-muted-foreground">Months</span>
								<span className="font-medium">
									{Number.isFinite(months) ? String(months) : "N/A"}
								</span>
							</div>
							<div className="flex items-center justify-between gap-4">
								<span className="text-muted-foreground">Total</span>
								<span className="font-medium">
									{Number.isFinite(total)
										? formatVnd(Math.round(total))
										: "N/A"}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-2">
					<p className="text-sm font-medium">Duration</p>
					<Select
						value={String(monthsRaw)}
						onValueChange={(value) => {
							const parsed = Number(value);
							if (
								Number.isFinite(parsed) &&
								Number.isInteger(parsed) &&
								monthOptions.includes(parsed as (typeof monthOptions)[number])
							) {
								setMonthsRaw(parsed as (typeof monthOptions)[number]);
							}
						}}
						disabled={paying}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select duration" />
						</SelectTrigger>
						<SelectContent>
							{monthOptions.map((m) => (
								<SelectItem key={m} value={String(m)}>
									{m} month{m > 1 ? "s" : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-xs text-muted-foreground">
						Total will be calculated as unit price × duration.
					</p>
				</div>

				<DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button
						variant="outline"
						className="w-full sm:w-auto"
						onClick={() => onOpenChange(false)}
						disabled={paying}
					>
						Cancel
					</Button>
					<Button
						className="w-full sm:w-auto"
						onClick={() => void handlePay()}
						disabled={!canSubmit || paying}
					>
						{paying ? "Creating payment..." : "Proceed to VNPay"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
