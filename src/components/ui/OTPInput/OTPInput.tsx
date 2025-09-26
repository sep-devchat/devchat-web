/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

export type OTPRef = {
	getValue: () => string;
	clear: () => void;
};

type OTPInputProps = {
	length?: number;
	value?: string; // controlled
	defaultValue?: string; // uncontrolled initial
	onChange?: (val: string) => void;
	disabled?: boolean;
	className?: string;
	inputClassName?: string;
	style?: React.CSSProperties;
};

const normalize = (s: string | undefined, len: number) =>
	(s ?? "")
		.slice(0, len)
		.padEnd(len, " ")
		.split("")
		.map((c) => (c === " " ? "" : c));

const OTPInput = forwardRef<OTPRef, OTPInputProps>(
	(
		{
			length = 4,
			value,
			defaultValue,
			onChange,
			disabled = false,
			className,
			inputClassName,
			style,
		},
		ref,
	) => {
		const isControlled = typeof value === "string";

		const [internal, setInternal] = useState<string[]>(
			() => normalize(defaultValue, length) || Array(length).fill(""),
		);

		// sync controlled value -> internal
		useEffect(() => {
			if (isControlled) {
				setInternal(normalize(value, length));
			}
		}, [value, isControlled, length]);

		const inputsRef = useRef<Array<HTMLInputElement | null>>(
			Array(length).fill(null),
		);

		const current = isControlled ? normalize(value, length) : internal;

		useImperativeHandle(
			ref,
			() => ({
				getValue: () => current.join(""),
				clear: () => {
					const empty = Array(length).fill("");
					if (isControlled) {
						onChange?.(empty.join(""));
					} else {
						setInternal(empty);
						onChange?.(empty.join(""));
						// clear DOM values
						inputsRef.current.forEach((el) => {
							if (el) el.value = "";
						});
						inputsRef.current[0]?.focus();
					}
				},
			}),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[current.join("")], // update when value changes
		);

		const setAt = (idx: number, ch: string) => {
			const next = [...current];
			next[idx] = ch.slice(-1);
			if (isControlled) onChange?.(next.join(""));
			else {
				setInternal(next);
				onChange?.(next.join(""));
			}
		};

		const handleChange =
			(idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
				const raw = e.target.value || "";
				// allow only digits
				const filtered = raw.replace(/[^0-9]/g, "");
				if (!filtered) {
					// cleared
					setAt(idx, "");
					return;
				}

				// paste or multi-char
				if (filtered.length > 1) {
					const chars = filtered.split("").slice(0, length - idx);
					const next = [...current];
					for (let i = 0; i < chars.length && idx + i < length; i++) {
						next[idx + i] = chars[i];
						// update DOM so user sees it immediately
						if (inputsRef.current[idx + i])
							inputsRef.current[idx + i]!.value = chars[i];
					}
					if (isControlled) onChange?.(next.join(""));
					else setInternal(next);
					const nextFocus = Math.min(length - 1, idx + chars.length);
					inputsRef.current[nextFocus]?.focus();
					return;
				}

				// single char
				const ch = filtered.slice(-1);
				setAt(idx, ch);
				if (ch && idx < length - 1) {
					inputsRef.current[idx + 1]?.focus();
				}
			};

		const handleKeyDown =
			(idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
				const key = e.key;
				if (key === "Backspace") {
					// if current has value, clear it; else move focus back and clear previous
					if (current[idx]) {
						setAt(idx, "");
						// also clear DOM value
						if (inputsRef.current[idx]) inputsRef.current[idx]!.value = "";
					} else if (idx > 0) {
						inputsRef.current[idx - 1]?.focus();
						setAt(idx - 1, "");
						if (inputsRef.current[idx - 1])
							inputsRef.current[idx - 1]!.value = "";
					}
				} else if (key === "ArrowLeft" && idx > 0) {
					inputsRef.current[idx - 1]?.focus();
				} else if (key === "ArrowRight" && idx < length - 1) {
					inputsRef.current[idx + 1]?.focus();
				}
			};

		// ensure DOM inputs reflect internal state (when uncontrolled and state changes)
		useEffect(() => {
			current.forEach((ch, i) => {
				const el = inputsRef.current[i];
				if (el && el.value !== (ch ?? "")) el.value = ch ?? "";
			});
		}, [current]);

		return (
			<div
				className={className}
				style={{
					display: "flex",
					gap: 8,
					justifyContent: "center",
					alignItems: "center",
					...style,
				}}
			>
				{Array.from({ length }).map((_, idx) => (
					<input
						key={idx}
						ref={(el) => (inputsRef.current[idx] = el)}
						inputMode="numeric"
						maxLength={1}
						disabled={disabled}
						defaultValue={current[idx] ?? ""}
						onChange={handleChange(idx)}
						onKeyDown={handleKeyDown(idx)}
						className={inputClassName}
						style={{
							width: 56,
							height: 56,
							textAlign: "center",
							fontSize: 20,
							borderRadius: 8,
							border: "1px solid var(--border-color, #e5e7eb)",
							outline: "none",
						}}
						aria-label={`OTP digit ${idx + 1}`}
					/>
				))}
			</div>
		);
	},
);

OTPInput.displayName = "OTPInput";
export default OTPInput;
