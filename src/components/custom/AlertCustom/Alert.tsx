/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

type AlertType = "success" | "warning" | "error";

export const showGlobalAlert = (payload: {
	type: AlertType;
	message: string;
	duration?: number;
}) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("app:alert", { detail: payload }));
};

type InternalAlert = {
	id: string;
	type: AlertType;
	message: string;
	duration: number;
};

export const AlertContainer: React.FC = () => {
	const [alerts, setAlerts] = useState<InternalAlert[]>([]);

	useEffect(() => {
		const handler = (e: any) => {
			const detail = e?.detail as {
				type: AlertType;
				message: string;
				duration?: number;
			};
			if (!detail) return;
			const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
			const a: InternalAlert = {
				id,
				type: detail.type,
				message: detail.message,
				duration: detail.duration ?? 4000,
			};
			setAlerts((s) => [a, ...s]);

			// auto remove after duration + animation time
			setTimeout(() => {
				setAlerts((s) => s.filter((x) => x.id !== id));
			}, a.duration + 300);
		};

		window.addEventListener("app:alert", handler as EventListener);
		return () =>
			window.removeEventListener("app:alert", handler as EventListener);
	}, []);

	return (
		<div
			style={{
				position: "fixed",
				top: 16,
				right: 16,
				zIndex: 9999,
				display: "flex",
				flexDirection: "column",
				gap: 8,
				alignItems: "flex-end",
			}}
		>
			{alerts.map((a) => (
				<SlideAlert
					key={a.id}
					type={a.type}
					message={a.message}
					duration={a.duration}
				/>
			))}
		</div>
	);
};

const SlideAlert: React.FC<{
	type: AlertType;
	message: string;
	duration: number;
}> = ({ type, message, duration }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// slide in
		const inT = setTimeout(() => setVisible(true), 10);
		// slide out after duration
		const outT = setTimeout(() => setVisible(false), duration);
		return () => {
			clearTimeout(inT);
			clearTimeout(outT);
		};
	}, [duration]);

	const colorStyle =
		type === "success"
			? { color: "#065f46", borderColor: "#bbf7d0" } // green-ish
			: type === "warning"
				? { color: "#92400e", borderColor: "#fef3c7" } // yellow-ish
				: { color: "#7f1d1d", borderColor: "#fecaca" }; // red-ish

	return (
		<div
			aria-live="polite"
			style={{
				transform: visible ? "translateX(0%)" : "translateX(110%)",
				transition: "transform 300ms ease, opacity 300ms ease",
				opacity: visible ? 1 : 0,
			}}
		>
			<div
				style={{
					minWidth: 220,
					maxWidth: 360,
					background: "white",
					padding: "10px 14px",
					borderRadius: 10,
					boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
					borderLeft: `4px solid ${colorStyle.borderColor}`,
					color: colorStyle.color,
				}}
			>
				<div style={{ fontSize: 14, fontWeight: 600 }}>{message}</div>
			</div>
		</div>
	);
};

export default AlertContainer;
