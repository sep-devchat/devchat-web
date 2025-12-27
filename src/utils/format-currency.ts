const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
	style: "currency",
	currency: "VND",
	maximumFractionDigits: 0,
});

export type FormatVndOptions = {
	/**
	 * Returned when amount is null/undefined/empty.
	 * Defaults to "-" to match existing UI patterns.
	 */
	fallback?: string;
};

/**
 * Formats an input value as Vietnamese đồng (VND), e.g. `1.234.567 ₫`.
 */
export const formatVnd = (
	amount: string | number | null | undefined,
	options: FormatVndOptions = {},
): string => {
	const fallback = options.fallback ?? "-";

	if (amount === null || amount === undefined) return fallback;
	if (typeof amount === "number") {
		return Number.isFinite(amount) ? VND_FORMATTER.format(amount) : fallback;
	}

	const raw = String(amount).trim();
	if (!raw) return fallback;

	// Strip currency symbols/separators while keeping minus and decimal.
	const numeric = Number(raw.replace(/[^0-9.-]/g, ""));
	if (!Number.isFinite(numeric)) return raw;
	return VND_FORMATTER.format(numeric);
};
