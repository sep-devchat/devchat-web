import React from "react";
import { Link } from "@tanstack/react-router";

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
	verifyPaymentCallback,
	type PaymentCallbackResult,
} from "@/services/paymentAPI";
import MainBg from "@/components/custom/MainBackground/MainBg";
import { CircleCheck, CircleX } from "lucide-react";

const getErrorMessage = (err: any, fallback: string) => {
	return (
		err?.response?.data?.message ??
		err?.response?.data?.error ??
		err?.message ??
		fallback
	);
};

const formatVnd = (vndAmount: number) => {
	try {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(vndAmount);
	} catch {
		return `${vndAmount} VND`;
	}
};

const calcVndFromVnpAmount = (raw: unknown): number | null => {
	if (raw === null || raw === undefined) return null;
	const str = String(raw);
	const n = Number(str);
	if (!Number.isFinite(n)) return null;
	// VNPay returns vnp_Amount in VND * 100
	return Math.round(n);
};

const formatVnpPayDate = (raw: unknown): string | null => {
	if (raw === null || raw === undefined) return null;
	const str = String(raw).trim();
	// VNPay typically returns payDate as yyyyMMddHHmmss
	if (!/^\d{14}$/.test(str)) return str;
	const yyyy = str.slice(0, 4);
	const MM = str.slice(4, 6);
	const dd = str.slice(6, 8);
	const HH = str.slice(8, 10);
	const mm = str.slice(10, 12);
	const ss = str.slice(12, 14);
	return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
};

const KeyValueRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
	label,
	value,
}) => {
	if (value === undefined || value === null || value === "") return null;
	return (
		<div className="flex items-start justify-between gap-4 py-2">
			<div className="text-sm text-muted-foreground">{label}</div>
			<div className="text-sm font-medium text-right break-all">{value}</div>
		</div>
	);
};

const PaymentResult: React.FC = () => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [result, setResult] = React.useState<PaymentCallbackResult | null>(
		null,
	);

	React.useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const params: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});

		// If the page is opened without VNPay query params, don’t call backend.
		if (Object.keys(params).length === 0) {
			setIsLoading(false);
			setError("Missing payment callback parameters.");
			return;
		}

		let isMounted = true;
		(async () => {
			try {
				setIsLoading(true);
				setError(null);
				const res = await verifyPaymentCallback(params);
				if (!isMounted) return;
				setResult(res.data);
			} catch (err: any) {
				if (!isMounted) return;
				setError(getErrorMessage(err, "Failed to verify payment result."));
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	const vndAmount = calcVndFromVnpAmount(result?.amount);
	const isVerified = Boolean(result?.isVerified);
	const isSuccess = Boolean(result?.isSuccess);
	const groupId = result?.groupId ?? null;
	const isDonation = result?.transactionType === "DONATION";

	const title = isLoading
		? "Verifying payment…"
		: error
			? "Payment verification failed"
			: isVerified && isSuccess
				? isDonation
					? "Donation successful"
					: "Payment successful"
				: isVerified
					? "Payment failed"
					: "Payment not verified";

	const subtitle = isLoading
		? "Please wait while we confirm your payment with VNPay."
		: error
			? error
			: (result?.message ?? "");

	return (
		<>
			<MainBg />
			<div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
				<Card className="w-full max-w-xl">
					<div className="flex justify-center mt-8">
						{isVerified && isSuccess ? (
							<CircleCheck size={100} className="text-green-500" />
						) : (
							<CircleX size={100} className="text-red-500" />
						)}
					</div>
					<CardHeader>
						<CardTitle className="text-xl text-center">{title}</CardTitle>
						<CardDescription className="text-center">
							{subtitle}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						{isLoading ? (
							<div className="text-sm text-muted-foreground">Loading…</div>
						) : error ? null : (
							<div className="rounded-md">
								<KeyValueRow
									label="Status"
									value={
										isVerified
											? isSuccess
												? "SUCCESS"
												: "FAILED"
											: "NOT VERIFIED"
									}
								/>
								<KeyValueRow label="Transaction Ref" value={result?.txnRef} />
								<KeyValueRow
									label="Amount"
									value={
										vndAmount !== null ? formatVnd(vndAmount) : result?.amount
									}
								/>
								<KeyValueRow label="Payment Method" value={result?.bankCode} />
								<KeyValueRow
									label="Transaction No"
									value={result?.transactionNo}
								/>
								<KeyValueRow
									label="Pay Date"
									value={formatVnpPayDate(result?.payDate) ?? undefined}
								/>
								<KeyValueRow label="Group" value={result?.groupId} />
								<KeyValueRow
									label="Transaction type"
									value={result?.transactionType ?? undefined}
								/>
								<KeyValueRow
									label="Share fund"
									value={result?.shareFundId ?? undefined}
								/>
								<KeyValueRow
									label="Subscription"
									value={result?.subscriptionId}
								/>
								<KeyValueRow
									label="Group Subscription"
									value={result?.groupSubscriptionId}
								/>
							</div>
						)}
					</CardContent>

					<CardFooter className="flex flex-wrap gap-2 justify-end">
						<Button asChild variant="outline">
							<Link to="/">Go home</Link>
						</Button>

						{groupId ? (
							<Button>
								<Link to="/chat/group/$groupId" params={{ groupId }}>
									Back to group
								</Link>
							</Button>
						) : null}
					</CardFooter>
				</Card>
			</div>
		</>
	);
};

export default PaymentResult;
