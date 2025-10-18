/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ImageWithModal } from "../ImageWithModal/ImageWithModal";

export function pad(n: number) {
	return n.toString().padStart(2, "0");
}

export function isSameDay(a?: string | Date | null, b?: string | Date | null) {
	if (!a || !b) return false;
	const da = a instanceof Date ? a : new Date(a);
	const db = b instanceof Date ? b : new Date(b);
	if (isNaN(da.getTime()) || isNaN(db.getTime())) return false;
	return (
		da.getFullYear() === db.getFullYear() &&
		da.getMonth() === db.getMonth() &&
		da.getDate() === db.getDate()
	);
}

export function formatDateHeader(input: string | Date): string {
	const d = input instanceof Date ? input : new Date(input);
	if (isNaN(d.getTime())) return "";

	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	if (sameYMD(d, now)) return "Today";
	if (sameYMD(d, yesterday)) return "Yesterday";
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatMessageTime(input: string | Date): string {
	const d = input instanceof Date ? input : new Date(input);
	if (isNaN(d.getTime())) return "";

	const now = new Date();
	const padLocal = (n: number) => n.toString().padStart(2, "0");
	const sameYMD = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const hhmm = `${padLocal(d.getHours())}:${padLocal(d.getMinutes())}`;
	if (sameYMD(d, now)) return `Today ${hhmm}`;
	if (sameYMD(d, yesterday)) return `Yesterday ${hhmm}`;
	return `${padLocal(d.getDate())}/${padLocal(d.getMonth() + 1)} ${hhmm}`;
}

// Inline markdown rendering utilities
export function createMarkdownRenderer() {
	let __md_key = 0;

	function renderInlineMarkdown(input: string): React.ReactNode[] {
		const patterns: { re: RegExp; tag: "strong" | "em" | "u" | "s" }[] = [
			{ re: /\*\*(.+?)\*\*/, tag: "strong" },
			{ re: /\*(.+?)\*/, tag: "em" },
			{ re: /\+\+(.+?)\+\+/, tag: "u" },
			{ re: /~~(.+?)~~/, tag: "s" },
		];

		const text = input;
		let earliest: { m: RegExpExecArray; tag: string } | null = null;
		for (const p of patterns) {
			const re = new RegExp(p.re.source, "m");
			const m = re.exec(text);
			if (
				m &&
				(earliest === null || (m.index ?? 0) < (earliest.m.index ?? Infinity))
			) {
				earliest = { m, tag: p.tag };
			}
		}

		if (!earliest) {
			if (text === "")
				return [
					<React.Fragment key={`md-${__md_key++}`}>{text}</React.Fragment>,
				];
			return [text];
		}

		const { m, tag } = earliest as any;
		const idx = m.index ?? 0;
		const full = m[0];
		const inner = m[1] ?? "";

		const before = text.slice(0, idx);
		const after = text.slice(idx + full.length);

		const result: React.ReactNode[] = [];

		if (before.length > 0) {
			result.push(...renderInlineMarkdown(before));
		}

		const key = `md-${__md_key++}`;
		const children = renderInlineMarkdown(inner);

		switch (tag) {
			case "strong":
				result.push(<strong key={key}>{children}</strong>);
				break;
			case "em":
				result.push(<em key={key}>{children}</em>);
				break;
			case "u":
				result.push(<u key={key}>{children}</u>);
				break;
			case "s":
				result.push(<s key={key}>{children}</s>);
				break;
			default:
				result.push(children);
		}

		if (after.length > 0) {
			result.push(...renderInlineMarkdown(after));
		}

		return result;
	}

	const IMAGE_MARKDOWN_RE = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;

	function parseContentToElements(content: string) {
		const elements: React.ReactNode[] = [];
		let lastIndex = 0;
		let match: RegExpExecArray | null;
		let idx = 0;

		while ((match = IMAGE_MARKDOWN_RE.exec(content)) !== null) {
			const matchStart = match.index;
			const matchEnd = IMAGE_MARKDOWN_RE.lastIndex;
			const alt = match[1] || "";
			const url = match[2];

			if (matchStart > lastIndex) {
				const textPart = content.slice(lastIndex, matchStart);
				const nodes = renderInlineMarkdown(textPart);
				for (const n of nodes) {
					elements.push(<span key={`text-${idx++}`}>{n}</span>);
				}
			}

			if (/^https?:\/\//i.test(url)) {
				elements.push(
					<ImageWithModal
						key={`img-${idx++}`}
						src={url}
						alt={alt || "image"}
						maxWidthPx={320}
						maxHeightPx={420}
						clickable={true}
						className="my-1"
					/>,
				);
			} else {
				elements.push(<span key={`textbad-${idx++}`}>{match[0]}</span>);
			}

			lastIndex = matchEnd;
		}

		if (lastIndex < content.length) {
			const tail = content.slice(lastIndex);
			const nodes = renderInlineMarkdown(tail);
			for (const n of nodes) {
				elements.push(<span key={`text-last-${idx++}`}>{n}</span>);
			}
		}

		if (elements.length === 0) {
			const nodes = renderInlineMarkdown(content);
			return nodes.length ? nodes : [content];
		}

		return elements;
	}

	const isOnlySingleImageMarkdown = (content: string) => {
		const trimmed = content.trim();
		const m = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
		return !!m;
	};

	return {
		renderInlineMarkdown,
		parseContentToElements,
		isOnlySingleImageMarkdown,
	};
}
