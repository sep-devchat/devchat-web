import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import RequiredMark from "@/components/custom/RequiredMark";
import * as S from "../SubscriptionManagement.styled";

export type SubscriptionFormState = {
	subscriptionCode: string;
	subscriptionName: string;
	price: number;
	limitMembers: number;
	isAIActive: boolean;
	runCodePerDay: number;
	programmingLanguageInGroups: number;
	levelSubscription: number;
	isActive: boolean;
};

export interface SubscriptionModalProps {
	isOpen: boolean;
	title: string;
	description: string;
	fields: Array<{
		key: keyof SubscriptionFormState;
		label: string;
		placeholder?: string;
		type?: "text" | "number" | "checkbox";
		min?: number;
		required?: boolean;
		disabled?: boolean;
		row?: number;
	}>;
	form: SubscriptionFormState;
	onChange: (
		key: keyof SubscriptionFormState,
		value: string | number | boolean,
	) => void;
	onSubmit: (event: React.FormEvent) => void;
	onClose: () => void;
	isSubmitting: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
	isOpen,
	title,
	description,
	fields,
	form,
	onChange,
	onSubmit,
	onClose,
	isSubmitting,
}) => {
	if (!isOpen) return null;

	// Draft state for number inputs so users can clear/edit without immediately snapping to 0.
	const [numberDrafts, setNumberDrafts] = React.useState<
		Record<string, string>
	>({});

	React.useEffect(() => {
		if (!isOpen) return;
		const next: Record<string, string> = {};
		for (const field of fields) {
			if (field.type === "number") {
				next[String(field.key)] = String((form as any)[field.key] ?? 0);
			}
		}
		setNumberDrafts(next);
	}, [isOpen, fields, form]);

	const formatPriceDisplay = (digitsOnly: string) => {
		const raw = String(digitsOnly ?? "").trim();
		if (!raw) return "";
		const num = Number(raw);
		if (!Number.isFinite(num)) return raw;
		// Currency-like formatting (grouping) without the "₫" suffix to keep editing simple.
		return new Intl.NumberFormat("vi-VN", {
			maximumFractionDigits: 0,
		}).format(num);
	};

	const getPriceDraftValue = () => {
		const digits = numberDrafts.price ?? String((form as any).price ?? 0);
		return formatPriceDisplay(digits);
	};

	const handlePriceFocus = () => {
		const cur = numberDrafts.price ?? String((form as any).price ?? 0);
		if (cur === "0") {
			setNumberDrafts((prev) => ({ ...prev, price: "" }));
		}
	};

	const handlePriceBlur = () => {
		const cur = (numberDrafts.price ?? "").trim();
		if (cur === "") {
			setNumberDrafts((prev) => ({ ...prev, price: "0" }));
			onChange("price", 0);
			return;
		}
		const parsed = Number(cur);
		if (!Number.isFinite(parsed)) {
			setNumberDrafts((prev) => ({ ...prev, price: "0" }));
			onChange("price", 0);
		}
	};

	const handlePriceChange = (raw: string) => {
		// Accept formatted input (e.g. "1.234") by stripping non-digits.
		const digitsOnly = String(raw ?? "").replace(/\D+/g, "");
		setNumberDrafts((prev) => ({ ...prev, price: digitsOnly }));
		if (digitsOnly.trim() === "") {
			onChange("price", 0);
			return;
		}
		const parsed = Number(digitsOnly);
		if (Number.isFinite(parsed)) {
			onChange("price", parsed);
		}
	};

	const getNumberDraftValue = (key: keyof SubscriptionFormState) => {
		return numberDrafts[String(key)] ?? String((form as any)[key] ?? 0);
	};

	const handleNumberFocus = (key: keyof SubscriptionFormState) => {
		const k = String(key);
		const cur = numberDrafts[k] ?? String((form as any)[key] ?? 0);
		if (cur === "0") {
			setNumberDrafts((prev) => ({ ...prev, [k]: "" }));
		}
	};

	const handleNumberBlur = (key: keyof SubscriptionFormState) => {
		const k = String(key);
		const cur = numberDrafts[k] ?? "";
		if (cur.trim() === "") {
			setNumberDrafts((prev) => ({ ...prev, [k]: "0" }));
			onChange(key, 0);
			return;
		}
		const parsed = Number(cur);
		if (!Number.isFinite(parsed)) {
			setNumberDrafts((prev) => ({ ...prev, [k]: "0" }));
			onChange(key, 0);
		}
	};

	const handleNumberChange = (
		key: keyof SubscriptionFormState,
		raw: string,
	) => {
		const k = String(key);
		setNumberDrafts((prev) => ({ ...prev, [k]: raw }));
		// While editing, allow empty string (UI) but treat as 0 in form state.
		if (raw.trim() === "") {
			onChange(key, 0);
			return;
		}
		const parsed = Number(raw);
		if (Number.isFinite(parsed)) {
			onChange(key, parsed);
		}
	};

	const renderField = (field: SubscriptionModalProps["fields"][number]) => {
		const { key, label, placeholder, type, min, required, disabled } = field;
		const isPriceCurrency = type === "number" && key === "price";
		const labelNode = (
			<>
				{label}
				{required ? <RequiredMark /> : null}
			</>
		);
		return (
			<S.Field key={String(key)}>
				{type === "checkbox" ? (
					<S.CheckboxRow>
						<Checkbox
							id={String(key)}
							disabled={disabled}
							checked={Boolean(form[key])}
							onCheckedChange={(checked) => onChange(key, checked === true)}
						/>
						<S.CheckboxLabel htmlFor={String(key)}>{labelNode}</S.CheckboxLabel>
					</S.CheckboxRow>
				) : (
					<>
						<S.Label htmlFor={String(key)}>{labelNode}</S.Label>
						<S.Input
							id={key}
							type={isPriceCurrency ? "text" : type || "text"}
							inputMode={isPriceCurrency ? "numeric" : undefined}
							disabled={disabled}
							value={
								isPriceCurrency
									? getPriceDraftValue()
									: type === "number"
										? getNumberDraftValue(key)
										: (form[key] as string | number)
							}
							onFocus={() => {
								if (isPriceCurrency) {
									handlePriceFocus();
									return;
								}
								if (type === "number") handleNumberFocus(key);
							}}
							onBlur={() => {
								if (isPriceCurrency) {
									handlePriceBlur();
									return;
								}
								if (type === "number") handleNumberBlur(key);
							}}
							onChange={(e) => {
								if (isPriceCurrency) {
									handlePriceChange(e.target.value);
									return;
								}
								if (type !== "number") {
									onChange(key, e.target.value);
									return;
								}
								handleNumberChange(key, e.target.value);
							}}
							placeholder={placeholder}
							min={min ?? undefined}
							required={required}
						/>
					</>
				)}
			</S.Field>
		);
	};

	return (
		<S.ModalOverlay>
			<S.ModalCard as="form" onSubmit={onSubmit}>
				<div>
					<S.ModalTitle>{title}</S.ModalTitle>
					<p style={{ margin: 0, color: "#64748b" }}>{description}</p>
				</div>
				{fields.map((field, index) => {
					const row = field.row;
					if (row == null) return renderField(field);

					const prevRow = fields[index - 1]?.row;
					if (prevRow === row) return null;

					const rowFields: typeof fields = [];
					for (let i = index; i < fields.length; i += 1) {
						if (fields[i]?.row !== row) break;
						rowFields.push(fields[i]);
					}

					return (
						<S.FieldsRow key={`row-${row}-${index}`}>
							{rowFields.map((rf) => renderField(rf))}
						</S.FieldsRow>
					);
				})}
				<S.ModalActions>
					<Button variant="outline" type="button" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Spinner className="mr-2" />}Save
					</Button>
				</S.ModalActions>
			</S.ModalCard>
		</S.ModalOverlay>
	);
};

export default SubscriptionModal;
