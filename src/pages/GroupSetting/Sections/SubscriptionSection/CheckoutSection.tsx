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
	const months = 1;
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
		setPaying(false);
	}, [open, plan?.id]);

	const unitPrice = useMemo(() => {
		const amount = Number(plan?.price);
		return Number.isFinite(amount) ? amount : NaN;
	}, [plan?.price]);

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
				monthQuantity: 1,
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
						Review invoice details, then proceed to VNPay.
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
								<span className="font-medium">{String(months)}</span>
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
