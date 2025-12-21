import { Profile } from "@/services/auth/auth.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProfile as apiFetchProfile } from "@/services/auth/authAPI";

export interface FetchProfileError {
	message: string;
	status?: number;
}

interface UserState {
	profile: Profile | null;
	pendingEmail: string | null;
	loading: boolean;
	error?: string | null;
	lastErrorStatus?: number | null;
}

const initialState: UserState = {
	profile: null,
	pendingEmail: null,
	loading: false,
	error: null,
	lastErrorStatus: null,
};

// Thunk: fetch the current user's profile (used on page reload/app init)
export const fetchCurrentProfile = createAsyncThunk<
	Profile,
	void,
	{ rejectValue: FetchProfileError }
>("user/fetchCurrentProfile", async (_, { rejectWithValue }) => {
	try {
		const res = await apiFetchProfile();
		return res.data;
	} catch (err: any) {
		const message = err?.response?.data?.message || "Failed to fetch profile";
		const status = err?.response?.status;
		return rejectWithValue({ message, status });
	}
});

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setProfile(state, action) {
			state.profile = action.payload;
		},
		setPendingEmail(state, action) {
			state.pendingEmail = action.payload ?? null;
		},
		clearPendingEmail(state) {
			state.pendingEmail = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentProfile.pending, (state) => {
				state.loading = state.profile ? false : true;
				state.error = null;
				state.lastErrorStatus = null;
			})
			.addCase(fetchCurrentProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.profile = action.payload ?? null;
				state.lastErrorStatus = null;
			})
			.addCase(fetchCurrentProfile.rejected, (state, action) => {
				state.loading = false;
				state.profile = null;
				state.error = action.payload?.message ?? "Failed to fetch profile";
				state.lastErrorStatus = action.payload?.status ?? null;
			});
	},
});

export const { setProfile, setPendingEmail, clearPendingEmail } =
	userSlice.actions;
export default userSlice.reducer;
