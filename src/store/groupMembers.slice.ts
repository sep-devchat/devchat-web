/* eslint-disable @typescript-eslint/no-explicit-any */
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
	backgroundLoading: boolean;
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

type FetchGroupMembersArgs = {
	groupId: string;
	page?: number;
	limit?: number;
	silent?: boolean;
};

export const fetchGroupMembers = createAsyncThunk(
	"groupMembers/fetchGroupMembers",
	async (args: FetchGroupMembersArgs, { rejectWithValue }) => {
		const { groupId } = args;
		try {
			const response = await membersGroup(groupId);
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

const areMembersEqual = (a: Member, b: Member) => {
	const roleEqual =
		(a.role?.name || "") === (b.role?.name || "") &&
		(a.role?.level || 0) === (b.role?.level || 0);
	return (
		a.id === b.id &&
		a.name === b.name &&
		a.username === b.username &&
		a.avatar === b.avatar &&
		a.isOnline === b.isOnline &&
		a.email === b.email &&
		roleEqual
	);
};

const mergeMembers = (previous: Member[], incoming: Member[]) => {
	if (!previous.length) return incoming;
	let changed = previous.length !== incoming.length;
	const prevMap = new Map(previous.map((member) => [member.id, member]));
	const merged = incoming.map((member) => {
		const existing = prevMap.get(member.id);
		if (existing && areMembersEqual(existing, member)) {
			return existing;
		}
		changed = true;
		return member;
	});
	return changed ? merged : previous;
};

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
				const { groupId, silent } = action.meta.arg;
				if (!state.byGroupId[groupId]) {
					state.byGroupId[groupId] = {
						members: [],
						loading: false,
						backgroundLoading: false,
						error: null,
						lastFetched: 0,
					};
				}
				if (silent) {
					state.byGroupId[groupId].backgroundLoading = true;
				} else {
					state.byGroupId[groupId].loading = true;
					state.byGroupId[groupId].error = null;
				}
			})
			.addCase(fetchGroupMembers.fulfilled, (state, action) => {
				const { groupId, members } = action.payload as {
					groupId: string;
					members: Member[];
				};
				const silent = action.meta.arg.silent;
				const bucket = state.byGroupId[groupId] || {
					members: [],
					loading: false,
					backgroundLoading: false,
					error: null,
					lastFetched: 0,
				};
				const mergedMembers = mergeMembers(bucket.members, members);
				state.byGroupId[groupId] = {
					members: mergedMembers,
					loading: silent ? bucket.loading : false,
					backgroundLoading: false,
					error: null,
					lastFetched: Date.now(),
				};
			})
			.addCase(fetchGroupMembers.rejected, (state, action) => {
				const payload = action.payload as
					| { groupId: string; message: string }
					| undefined;
				const { groupId, silent } = action.meta.arg;
				if (!state.byGroupId[groupId]) {
					state.byGroupId[groupId] = {
						members: [],
						loading: false,
						backgroundLoading: false,
						error: null,
						lastFetched: 0,
					};
				}
				state.byGroupId[groupId].loading = false;
				state.byGroupId[groupId].backgroundLoading = false;
				if (!silent) {
					state.byGroupId[groupId].error =
						payload?.message || "Failed to load members";
				}
			});
	},
});

export const { setCurrentGroup, clearGroup, clearAllGroups } =
	groupMembersSlice.actions;
export default groupMembersSlice.reducer;
