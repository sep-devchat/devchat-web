import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { membersGroup } from "@/services/userGroupAPI";

export interface Member {
	id: string;
	name: string;
	username?: string;
	avatar?: string;
	isOnline?: boolean;
	email?: string;
	role?: {
		name: string;
		level: number;
	};
}

interface GroupBucket {
	members: Member[];
	loading: boolean;
	error: string | null;
	lastFetched: number;
}

interface GroupMembersState {
	currentGroupId: string | null;
	byGroupId: Record<string, GroupBucket>;
}

const initialState: GroupMembersState = {
	currentGroupId: null,
	byGroupId: {},
};

export const fetchGroupMembers = createAsyncThunk(
	"groupMembers/fetchGroupMembers",
	async (
		args: { groupId: string; page?: number; limit?: number },
		{ rejectWithValue },
	) => {
		const { groupId, page = 1, limit = 50 } = args;
		try {
			const response = await membersGroup(groupId, page, limit);
			const data = (response as any)?.data ?? response;
			const membersList: any[] = Array.isArray(data)
				? data
				: data?.members || [];

			const mapped: Member[] = membersList.map((member: any) => {
				const fullName =
					`${member.lastName || ""} ${member.firstName || ""}`.trim() ||
					member.username ||
					"Unknown User";
				return {
					id: member.id || member.userId || member._id,
					name: fullName,
					username:
						member.username ||
						member.userName ||
						member.login ||
						member.handle ||
						undefined,
					avatar:
						member.avatarUrl ||
						`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
					isOnline: member.isActive ?? false,
					email: member.email,
					role: member.role,
				} as Member;
			});
			return { groupId, members: mapped };
		} catch (err: any) {
			return rejectWithValue({
				groupId,
				message: err?.message || "Failed to load members",
			});
		}
	},
);

const groupMembersSlice = createSlice({
	name: "groupMembers",
	initialState,
	reducers: {
		setCurrentGroup(state, action: PayloadAction<string | null>) {
			state.currentGroupId = action.payload;
		},
		clearGroup(state, action: PayloadAction<string>) {
			delete state.byGroupId[action.payload];
			if (state.currentGroupId === action.payload) state.currentGroupId = null;
		},
		clearAllGroups(state) {
			state.byGroupId = {};
			state.currentGroupId = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGroupMembers.pending, (state, action) => {
				const { groupId } = action.meta.arg;
				if (!state.byGroupId[groupId]) {
					state.byGroupId[groupId] = {
						members: [],
						loading: false,
						error: null,
						lastFetched: 0,
					};
				}
				state.byGroupId[groupId].loading = true;
				state.byGroupId[groupId].error = null;
			})
			.addCase(fetchGroupMembers.fulfilled, (state, action) => {
				const { groupId, members } = action.payload as {
					groupId: string;
					members: Member[];
				};
				state.byGroupId[groupId] = {
					members,
					loading: false,
					error: null,
					lastFetched: Date.now(),
				};
			})
			.addCase(fetchGroupMembers.rejected, (state, action) => {
				const payload = action.payload as
					| { groupId: string; message: string }
					| undefined;
				const groupId = payload?.groupId ?? action.meta.arg.groupId;
				if (!state.byGroupId[groupId]) {
					state.byGroupId[groupId] = {
						members: [],
						loading: false,
						error: null,
						lastFetched: 0,
					};
				}
				state.byGroupId[groupId].loading = false;
				state.byGroupId[groupId].error =
					payload?.message || "Failed to load members";
			});
	},
});

export const { setCurrentGroup, clearGroup, clearAllGroups } =
	groupMembersSlice.actions;
export default groupMembersSlice.reducer;
