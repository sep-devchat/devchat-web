export function htmlToMarkdown(htmlString: string) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");
	const walk = (node: Node): string => {
		if (node.nodeType === Node.TEXT_NODE) return (node as Text).data || "";
		if (node.nodeType !== Node.ELEMENT_NODE) return "";
		const el = node as Element;
		const tag = el.tagName.toLowerCase();
		const children = Array.from(el.childNodes).map(walk).join("");
		switch (tag) {
			case "strong":
			case "b":
				return `**${children}**`;
			case "em":
			case "i":
				return `*${children}*`;
			case "u":
				return `++${children}++`;
			case "s":
			case "strike":
			case "del":
				return `~~${children}~~`;
			case "br":
				return `\n`;
			case "div":
			case "p":
				return children + "\n";
			case "ul":
				return (
					Array.from(el.children)
						.map((li) => `- ${Array.from(li.childNodes).map(walk).join("")}`)
						.join("\n") + "\n"
				);
			case "ol":
				return (
					Array.from(el.children)
						.map(
							(li, idx) =>
								`${idx + 1}. ${Array.from(li.childNodes).map(walk).join("")}`,
						)
						.join("\n") + "\n"
				);
			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6": {
				const level = Number(tag[1] || 1);
				return `${"#".repeat(level)} ${children}\n`;
			}
			default:
				return children;
		}
	};
	const body = doc.body;
	const result = Array.from(body.childNodes).map(walk).join("");
	return result.replace(/\n{3,}/g, "\n\n").trim();
}

// A tiny markdown -> html conversion for the editable (used when typing plain markdown)
export function markdownToHtml(text: string) {
	return (
		text
			// bold trước
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			// underline
			.replace(/\+\+(.+?)\+\+/g, "<u>$1</u>")
			// strike
			.replace(/~~(.+?)~~/g, "<s>$1</s>")
			// italic: ensure not part of ** (use negative lookahead to avoid immediate *)
			.replace(/\*(?!\*)(.+?)\*(?!\*)/g, "<em>$1</em>")
			.replace(/\n/g, "<br/>")
	);
}
