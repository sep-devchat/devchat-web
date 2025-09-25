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
  
  export interface SampleData {
    user: User;
    groups: GroupSummary[];
    expanded_group: ExpandedGroup;
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
      },
  
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
    };
  }
  