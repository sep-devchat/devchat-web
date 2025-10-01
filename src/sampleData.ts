// sampleData.ts
// Hàm xuất dữ liệu mẫu cho user, danh sách groups và 1 group mở rộng

export interface User {
	user_id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	created_at: string;
	last_login?: string | null;
	avatar_url?: string | null;
}

export interface GroupSummary {
	group_id: string;
	name: string;
	description?: string | null;
	avatar?: string | null;
	created_by: string;
	created_at: string;
	updated_at?: string | null;
	is_active: boolean;
	role_of_current_user?: string | null;
}

export interface Permissions {
	can_post?: boolean;
	can_create_channel?: boolean;
	can_invite?: boolean;
	can_edit_group?: boolean;
}

export interface Member {
	user_group_id: string;
	user_id: string;
	username: string;
	role: string;
	joined_at: string;
	added_by?: string | null;
	permissions?: Permissions;
}

export interface Channel {
	channel_id: string;
	name: string;
	description?: string | null;
	permission?: string;
	created_by?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	is_active?: boolean;
}

export interface Settings {
	notifications?: string;
	default_channel_permission?: string;
	allow_guest_invite?: boolean;
}

export interface ExpandedGroup {
	group_id: string;
	name: string;
	description?: string | null;
	avatar?: string | null;
	created_by: string;
	created_at: string;
	updated_at?: string | null;
	is_active: boolean;
	members: Member[];
	channels: Channel[];
	settings?: Settings;
}

export type MessageType = "text" | "image" | "file" | "code" | "system";

export interface Attachment {
	// tương ứng với message_attachments table
	attachmentId: string; // UUID (attachment_id)
	messageId: string; // UUID (message_id) - FK
	filename?: string | null; // varchar(255)
	originalFilename?: string | null; // varchar(255)
	filePath?: string | null; // varchar(max)
	fileSize?: number | null; // integer (bytes)
	mimeType?: string | null; // varchar(100)
	uploadedAt?: string | null; // ISO timestamp
}

export interface Message {
	// tương ứng với message table
	messageId: string; // UUID (message_id)
	channelId?: string | null; // UUID (channel_id)
	threadId?: string | null; // UUID (thread_id) - nếu có thread
	senderId: string; // UUID (sender_id)
	content?: string | null; // varchar(max)
	messageType: MessageType; // enum
	parentMessageId?: string | null; // varchar(100) (FK) -> trả về id của message cha nếu là reply
	createdAt: string; // timestamp
	updatedAt?: string | null; // timestamp
	deletedAt?: boolean; // boolean (đánh dấu đã xoá)
	attachments?: Attachment[]; // danh sách file đính kèm (nhiều file)
}

export interface SampleData {
	user: User;
	users?: User[]; // <-- added friends list
	groups: GroupSummary[];
	expanded_group: ExpandedGroup;
	messages?: Message[]; // thêm messages mẫu
}

// Hàm trả về dữ liệu mẫu
export function sampleData(): SampleData {
	return {
		user: {
			user_id: "7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234",
			username: "nguyentuan",
			email: "tuan.nguyen@example.com",
			first_name: "Tuấn",
			last_name: "Nguyễn",
			is_active: true,
			created_at: "2025-09-01T08:30:00Z",
			last_login: "2025-09-22T09:45:00Z",
			avatar_url: "https://i.pravatar.cc/64?img=2",
		},

		users: [
			{
				user_id: "u-1001",
				username: "nhunguyen",
				email: "nhunguyen@gmail.com",
				first_name: "Nhu",
				last_name: "Nguyen",
				is_active: true,
				created_at: "2024-01-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=2",
			},
			{
				user_id: "u-1002",
				username: "lene",
				email: "lene@gmail.com",
				first_name: "Le",
				last_name: "Nguyen",
				is_active: true,
				created_at: "2024-02-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=3",
			},
			{
				user_id: "u-1003",
				username: "ha_ng",
				email: "ha@example.com",
				first_name: "Ha",
				last_name: "Nguyen",
				is_active: true,
				created_at: "2024-03-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=4",
			},
			{
				user_id: "u-1004",
				username: "duyuyen",
				email: "duy@example.com",
				first_name: "Duy",
				last_name: "Uyen",
				is_active: true,
				created_at: "2024-04-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=5",
			},
			{
				user_id: "u-1005",
				username: "phamuyen",
				email: "phamuyen@example.com",
				first_name: "Pham",
				last_name: "Uyen",
				is_active: true,
				created_at: "2024-05-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=6",
			},
			{
				user_id: "u-1006",
				username: "minhuyen",
				email: "minhuyen@example.com",
				first_name: "Minh",
				last_name: "Uyen",
				is_active: true,
				created_at: "2024-06-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=7",
			},
			{
				user_id: "u-1007",
				username: "thanhuyen",
				email: "thanhuyen@example.com",
				first_name: "Thanh",
				last_name: "Uyen",
				is_active: true,
				created_at: "2024-07-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=8",
			},
			{
				user_id: "u-1008",
				username: "thaouyen",
				email: "thaouyen@example.com",
				first_name: "Thao",
				last_name: "Uyen",
				is_active: true,
				created_at: "2024-08-01T00:00:00Z",
				avatar_url: "https://i.pravatar.cc/64?img=9",
			},
		],

		groups: [
			{
				group_id: "d1a2b3c4-1111-4222-8333-abcdef000001",
				name: "Frontend Team",
				description: "Nhóm phát triển giao diện web",
				avatar: "https://cdn.example.com/group-frontend.png",
				created_by: "4f6a7b8c-2222-4333-9444-fedcba000001",
				created_at: "2024-06-10T10:00:00Z",
				updated_at: "2025-08-15T12:00:00Z",
				is_active: true,
				role_of_current_user: "member",
			},
			{
				group_id: "d1a2b3c4-1111-4222-8333-abcdef000002",
				name: "Product Owners",
				description: "Nhóm quản lý sản phẩm",
				avatar: null,
				created_by: "9a8b7c6d-3333-5444-1555-aabbcc000002",
				created_at: "2023-11-05T09:15:00Z",
				updated_at: "2025-07-01T09:00:00Z",
				is_active: true,
				role_of_current_user: "admin",
			},
			{
				group_id: "d1a2b3c4-1111-4222-8333-abcdef000003",
				name: "Design Review",
				description: "Thảo luận thiết kế & review",
				avatar: "https://cdn.example.com/group-design.png",
				created_by: "2b3c4d5e-4444-6555-2666-112233000003",
				created_at: "2025-01-20T14:30:00Z",
				updated_at: "2025-03-11T08:00:00Z",
				is_active: false,
				role_of_current_user: "viewer",
			},
		],

		expanded_group: {
			group_id: "d1a2b3c4-1111-4222-8333-abcdef000001",
			name: "Frontend Team",
			description: "Nhóm phát triển giao diện web",
			avatar: "https://cdn.example.com/group-frontend.png",
			created_by: "4f6a7b8c-2222-4333-9444-fedcba000001",
			created_at: "2024-06-10T10:00:00Z",
			updated_at: "2025-08-15T12:00:00Z",
			is_active: true,

			members: [
				{
					user_group_id: "ug-0001",
					user_id: "7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234",
					username: "nguyentuan",
					role: "member",
					joined_at: "2024-06-15T09:00:00Z",
					added_by: "4f6a7b8c-2222-4333-9444-fedcba000001",
					permissions: {
						can_post: true,
						can_create_channel: false,
						can_invite: true,
					},
				},
				{
					user_group_id: "ug-0002",
					user_id: "aa11bb22-3333-4444-5555-666677778888",
					username: "lethanh",
					role: "manager",
					joined_at: "2024-06-10T10:05:00Z",
					added_by: "4f6a7b8c-2222-4333-9444-fedcba000001",
					permissions: {
						can_post: true,
						can_create_channel: true,
						can_invite: true,
						can_edit_group: true,
					},
				},
				{
					user_group_id: "ug-0003",
					user_id: "cc99dd88-7777-6666-5555-444433332222",
					username: "phamtrang",
					role: "member",
					joined_at: "2024-07-02T11:20:00Z",
					added_by: "aa11bb22-3333-4444-5555-666677778888",
					permissions: {
						can_post: true,
						can_create_channel: false,
					},
				},
			],

			channels: [
				{
					channel_id: "ch-1001",
					name: "general",
					description: "Thông báo chung & discussion",
					permission: "public",
					created_by: "4f6a7b8c-2222-4333-9444-fedcba000001",
					created_at: "2024-06-10T10:10:00Z",
					updated_at: "2025-08-10T08:00:00Z",
					is_active: true,
				},
				{
					channel_id: "ch-1002",
					name: "sprint-planning",
					description: "Kế hoạch sprint, backlog grooming",
					permission: "restricted",
					created_by: "aa11bb22-3333-4444-5555-666677778888",
					created_at: "2024-06-11T14:00:00Z",
					updated_at: "2025-09-01T07:00:00Z",
					is_active: true,
				},
				{
					channel_id: "ch-1003",
					name: "ui-ux",
					description: "Trao đổi về design & component",
					permission: "public",
					created_by: "cc99dd88-7777-6666-5555-444433332222",
					created_at: "2024-07-05T09:40:00Z",
					updated_at: "2025-02-20T06:00:00Z",
					is_active: false,
				},
			],

			settings: {
				notifications: "all",
				default_channel_permission: "member_post",
				allow_guest_invite: false,
			},
		},

		messages: [
			{
				messageId: "m-0001-1111-2222-3333-aaaaaaaaaaaa",
				channelId: "ch-1001",
				threadId: null,
				senderId: "7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234",
				content: "Chào cả team! Đây là thông báo bắt đầu sprint mới.",
				messageType: "text",
				parentMessageId: null,
				createdAt: "2025-09-22T08:00:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [],
			},
			{
				messageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
				channelId: "ch-1001",
				threadId: null,
				senderId: "aa11bb22-3333-4444-5555-666677778888",
				content: "Mình đính kèm mockup và file spec ở đây, mọi người xem nhé.",
				messageType: "text",
				parentMessageId: null,
				createdAt: "2025-09-22T08:05:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [
					{
						attachmentId: "att-1001-aaaa-0001",
						messageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
						filename: "homepage-mockup.png",
						originalFilename: "homepage-v2.png",
						filePath: "/uploads/groups/d1a2b3c4/ch-1001/homepage-mockup.png",
						fileSize: 245120, // bytes
						mimeType: "image/png",
						uploadedAt: "2025-09-22T08:05:10Z",
					},
					{
						attachmentId: "att-1002-aaaa-0002",
						messageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
						filename: "sprint-spec.pdf",
						originalFilename: "sprint-specification.pdf",
						filePath: "/uploads/groups/d1a2b3c4/ch-1001/sprint-spec.pdf",
						fileSize: 512000, // bytes
						mimeType: "application/pdf",
						uploadedAt: "2025-09-22T08:05:12Z",
					},
				],
			},
			{
				messageId: "m-0003-1111-2222-3333-cccccccccccc",
				channelId: "ch-1001",
				threadId: "m-0002-1111-2222-3333-bbbbbbbbbbbb", // reply trong thread
				senderId: "cc99dd88-7777-6666-5555-444433332222",
				content: "File xem ok, mình có 1 comment ở slide 3.",
				messageType: "text",
				parentMessageId: "m-0002-1111-2222-3333-bbbbbbbbbbbb",
				createdAt: "2025-09-22T08:10:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [],
			},
			{
				messageId: "m-0004-1111-2222-3333-dddddddddddd",
				channelId: "ch-1002",
				threadId: null,
				senderId: "7a8f3e2b-1c4d-4f9a-9d2b-0b4a6c1f1234",
				content: null,
				messageType: "image",
				parentMessageId: null,
				createdAt: "2025-09-22T09:00:00Z",
				updatedAt: null,
				deletedAt: false,
				attachments: [
					{
						attachmentId: "att-2001-bbbb-0001",
						messageId: "m-0004-1111-2222-3333-dddddddddddd",
						filename: "design-screenshot.jpg",
						originalFilename: "design-screenshot.jpg",
						filePath: "/uploads/groups/d1a2b3c4/ch-1002/design-screenshot.jpg",
						fileSize: 180000,
						mimeType: "image/jpeg",
						uploadedAt: "2025-09-22T09:00:03Z",
					},
				],
			},
			{
				messageId: "m-0005-1111-2222-3333-eeeeeeeeeeee",
				channelId: "ch-1001",
				threadId: null,
				senderId: "aa11bb22-3333-4444-5555-666677778888",
				content: "Đã xóa message này (demo deleted).",
				messageType: "text",
				parentMessageId: null,
				createdAt: "2025-09-22T09:30:00Z",
				updatedAt: "2025-09-22T09:31:00Z",
				deletedAt: true,
				attachments: [],
			},
		],
	};
}
