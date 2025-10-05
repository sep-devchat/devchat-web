export interface MessageItemType {
	id: string;
	user: {
		avatar: string;
		username: string;
		groupName?: string;
		time: string;
	};
	tags: Array<{
		label: string;
		color: "blue" | "red" | "green" | "yellow" | "purple" | "pink" | "orange";
	}>;
	reportedBy: "auto" | "user";
	content: {
		message?: string;
		code?: string;
	};
	adminAnswer?: {
		admin: string;
		text: string;
		date: string;
		reason: string;
		reviewTime?: string;
	};
	reason?: string;
	actions: Array<{
		label: string;
		icon?: React.ReactNode;
		variant: "primary" | "danger" | "success" | "warning" | "info" | "other";
		onClick: () => void;
	}>;
}
