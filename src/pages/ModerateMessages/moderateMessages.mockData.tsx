import {
	Check,
	X,
	AlertTriangle,
	Info,
	User,
	Ban,
	Phone,
	AlertCircle,
	FileText,
} from "lucide-react";
import { MessagesDataMap } from "./moderateMessages.types";

export const MOCK_MESSAGES_DATA: MessagesDataMap = {
	"pending-review": [
		{
			id: "1",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1",
				username: "Nhu Nguyen",
				groupName: "Group A",
				time: "2024-01-14 10:45 AM",
			},
			content: {
				message:
					"This is completely stupid! Why would anyone write code like this? You developers are all idiots and don't know what you're doing.",
			},
			tags: [
				{ label: "High Priority", color: "red" },
				{ label: "Inappropriate Content", color: "orange" },
			],
			reason:
				"Response to code review in #react-components channel • Previous violations: 2 warnings in last 30 days",
			reportedBy: "user",
			actions: [
				{
					label: "Approve",
					icon: <Check className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Approved"),
				},
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Deleted"),
				},
				{
					label: "Warning",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Warning"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
			],
		},
		{
			id: "2",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User2",
				username: "Nhu Nguyen",
				groupName: "Tech Community",
				time: "2024-01-14 11:20 AM",
			},
			content: {
				message:
					"Here's a quick script to access user data without authentication:",
				code: "// Bypass authentication\nconst userData = await db.user.findAll();\nconsole.log(userData); // user passwords\nawait userData.forEach(u => console.log(u.password));",
			},
			tags: [
				{ label: "Medium Priority", color: "yellow" },
				{ label: "Code Violation", color: "blue" },
			],
			reason:
				"Response to code review in #react-components channel • Previous violations: 2 warnings in last 30 days",
			reportedBy: "user",
			actions: [
				{
					label: "Approve",
					icon: <Check className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Approved"),
				},
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Deleted"),
				},
				{
					label: "Warning",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Warning"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
			],
		},
	],
	approved: [
		{
			id: "3",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User3",
				username: "Nhu Nguyen",
				groupName: "Tech Community",
				time: "2024-01-14 11:20 AM",
			},
			content: {
				message:
					"I disagree with this approach. The algorithm complexity is O(n²) which will be slow for large datasets. Consider using a hash map instead for O(n) performance.",
			},
			adminAnswer: {
				text: "Approved by: Admin Sarah Connor",
				admin: "Admin Sarah Connor",
				date: "2024-01-14 11:15",
				reason: "Constructive technical criticism, not harassment",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Approved", color: "green" },
				{ label: "Code Violation", color: "blue" },
			],
			reportedBy: "user",
			actions: [
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Delete"),
				},
				{
					label: "Warning",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Warning"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
			],
		},
		{
			id: "4",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User4",
				username: "Nhu Nguyen",
				time: "2024-01-14 09:30 AM",
			},
			content: {
				message:
					"Thanks for the code review! Here's the updated function with better error handling. Let me know if you see any other issues.",
				code: 'function validateUserInput(input) {\n  if (!input) throw new Error("Invalid input");\n  return sanitize(input);\n}',
			},
			adminAnswer: {
				text: "Approved by: Admin Sarah Connor",
				admin: "Admin Sarah Connor",
				date: "2024-01-14 11:15",
				reason: "False positive – professional code review response",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Approved", color: "green" },
				{ label: "False Positive", color: "blue" },
			],
			reportedBy: "user",
			actions: [
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Delete"),
				},
				{
					label: "Warning",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Warning"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
			],
		},
	],
	deleted: [
		{
			id: "5",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User5",
				username: "Nhu Nguyen",
				time: "2024-01-14 10:45 AM",
			},
			content: {
				message:
					"Your code is terrible and you should quit programming. Nobody wants to work with incompetent developers like you.",
			},
			adminAnswer: {
				text: "Deleted by: Auto-Moderator",
				admin: "Auto-Moderator",
				date: "2024-01-14",
				reason:
					"Spam flooding detected. Part of 47 identical messages sent in 2 minutes. User temporarily banned.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Delete", color: "red" },
				{ label: "Spam", color: "blue" },
			],
			reportedBy: "auto",
			actions: [
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
				{
					label: "Restore Message",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Restore"),
				},
				{
					label: "Permanent Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Permanent Delete"),
				},
			],
		},
		{
			id: "6",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User6",
				username: "Nhu Nguyen",
				groupName: "Community",
				time: "2024-01-15 09:30 AM",
			},
			content: {
				message:
					"Posted inappropriate meme content that violates community guidelines...",
			},
			adminAnswer: {
				text: "Deleted by: Admin_John",
				admin: "Admin_John",
				date: "2024-01-15",
				reason:
					"Malicious content promoting illegal hacking tools. User notified.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Delete", color: "red" },
				{ label: "Inappropriate Content", color: "orange" },
			],
			reportedBy: "user",
			actions: [
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
				{
					label: "Restore Message",
					icon: <AlertTriangle className="w-4 h-4" />,
					variant: "warning",
					onClick: () => console.log("Restore"),
				},
				{
					label: "Permanent Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Permanent Delete"),
				},
			],
		},
	],
	"user-warned": [
		{
			id: "7",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User7",
				username: "Nhu Nguyen",
				time: "2024-01-14 02:15 PM",
			},
			content: {
				message:
					"Your code is terrible and you should quit programming. Nobody wants to work with incompetent developers like you.",
			},
			adminAnswer: {
				text: "Warning Notice",
				admin: "Auto-Moderator",
				date: "2024-01-14",
				reason:
					"Your message has been flagged for harassment and unprofessional conduct. This is your 1st warning.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "1st warning", color: "pink" },
				{ label: "Harassment", color: "orange" },
			],
			reportedBy: "auto",
			actions: [
				{
					label: "Approve",
					icon: <Check className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Approve"),
				},
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Delete"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
			],
		},
		{
			id: "8",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User8",
				username: "Nhu Nguyen",
				groupName: "Dev Community",
				time: "2024-01-15 11:30 AM",
			},
			content: {
				message:
					"Posted inappropriate meme content that violates community guidelines...",
			},
			adminAnswer: {
				text: "Warning Notice",
				admin: "Auto-Moderator",
				date: "2024-01-15",
				reason:
					"Your content has been flagged for inappropriate material. This is your 2nd warning. This is your 3rd warning.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "3rd warning", color: "pink" },
				{ label: "Inappropriate Content", color: "orange" },
			],
			reportedBy: "user",
			actions: [
				{
					label: "Approve",
					icon: <Check className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Approve"),
				},
				{
					label: "Delete",
					icon: <X className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Delete"),
				},
				{
					label: "Detail",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Detail"),
				},
				{
					label: "View User Profile",
					icon: <User className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("View Profile"),
				},
			],
		},
	],
	escalated: [
		{
			id: "9",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User9",
				username: "Nhu Nguyen",
				time: "2024-01-15 09:30 AM",
			},
			content: {
				message:
					"I know where you work, I'm coming for you and your family. This isn't over. Watch your back.",
			},
			adminAnswer: {
				text: "Escalated by: Admin_Chief",
				admin: "Admin_Chief",
				date: "2024-01-15",
				reason:
					"Escalated Case: Direct threat requiring legal review. Senior admin and legal team notified. Potential law enforcement involvement.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Escalated", color: "purple" },
				{ label: "Threat", color: "red" },
			],
			reportedBy: "auto",
			actions: [
				{
					label: "Legal Review",
					icon: <FileText className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("Legal Review"),
				},
				{
					label: "Security Review",
					icon: <AlertCircle className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Security Review"),
				},
				{
					label: "Emergency Ban",
					icon: <Ban className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Emergency Ban"),
				},
				{
					label: "Incident Report",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Incident Report"),
				},
				{
					label: "Contact Authorities",
					icon: <Phone className="w-4 h-4" />,
					variant: "other",
					onClick: () => console.log("Contact Authorities"),
				},
			],
		},
		{
			id: "10",
			user: {
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User10",
				username: "Nhu Nguyen",
				time: "2024-01-15 10:45 AM",
			},
			content: {
				message:
					"Found a way to access all passwords that's their passwords. Here it is [REDACTED SENSITIVE DATA]",
				code: "// Bypass authentication const userData = await db.user.findAll(); console.log(userData);",
			},
			adminAnswer: {
				text: "Escalated by: Admin_Chief",
				admin: "Admin_Chief",
				date: "2024-01-15",
				reason:
					"Critical security breach - potential data leak or admin credentials. Security team and CTO notified immediately. System lockdown initiated.",
				reviewTime: "5 minutes",
			},
			tags: [
				{ label: "Escalated", color: "purple" },
				{ label: "Data Leak", color: "red" },
			],
			reportedBy: "auto",
			actions: [
				{
					label: "Legal Review",
					icon: <FileText className="w-4 h-4" />,
					variant: "primary",
					onClick: () => console.log("Legal Review"),
				},
				{
					label: "Security Review",
					icon: <AlertCircle className="w-4 h-4" />,
					variant: "success",
					onClick: () => console.log("Security Review"),
				},
				{
					label: "Emergency Ban",
					icon: <Ban className="w-4 h-4" />,
					variant: "danger",
					onClick: () => console.log("Emergency Ban"),
				},
				{
					label: "Incident Report",
					icon: <Info className="w-4 h-4" />,
					variant: "info",
					onClick: () => console.log("Incident Report"),
				},
				{
					label: "Contact Authorities",
					icon: <Phone className="w-4 h-4" />,
					variant: "other",
					onClick: () => console.log("Contact Authorities"),
				},
			],
		},
	],
};
