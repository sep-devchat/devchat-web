// utils.ts
export const formatTime = (date: Date): string => {
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

	if (diff < 1) return "Just now";
	if (diff < 60) return `${diff}m ago`;
	if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
	return date.toLocaleDateString();
};

export const formatMessageTime = (dateStr: string): string => {
	const date = new Date(dateStr);
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export const formatDateHeader = (dateStr: string): string => {
	const date = new Date(dateStr);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) return "Today";
	if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
	});
};
