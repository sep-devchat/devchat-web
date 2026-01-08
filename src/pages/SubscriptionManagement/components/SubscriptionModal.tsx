import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
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

	const renderField = (field: SubscriptionModalProps["fields"][number]) => {
		const { key, label, placeholder, type, min, required, disabled } = field;
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
						<S.CheckboxLabel htmlFor={String(key)}>{label}</S.CheckboxLabel>
					</S.CheckboxRow>
				) : (
					<>
						<S.Label htmlFor={key}>{label}</S.Label>
						<S.Input
							id={key}
							type={type || "text"}
							disabled={disabled}
							value={form[key] as string | number}
							onChange={(e) =>
								onChange(
									key,
									type === "number" ? Number(e.target.value) : e.target.value,
								)
							}
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
