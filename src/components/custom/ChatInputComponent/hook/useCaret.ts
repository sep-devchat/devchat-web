import { useCallback } from "react";

export const useCaret = () => {
	const placeCaretAtEnd = useCallback((el: HTMLElement | null) => {
		if (!el) return;
		el.focus();
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		const sel = window.getSelection();
		if (sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}, []);

	return { placeCaretAtEnd };
};
