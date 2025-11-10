import { Profile } from "@/services/auth/auth.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProfile as apiFetchProfile } from "@/services/auth/authAPI";

interface UserState {
	profile: Profile | null;
	pendingEmail: string | null;
	loading: boolean;
	error?: string | null;
}

const initialState: UserState = {
	profile: null,
	pendingEmail: null,
	loading: false,
	error: null,
};

// Thunk: fetch the current user's profile (used on page reload/app init)
export const fetchCurrentProfile = createAsyncThunk<
	Profile,
	void,
	{ rejectValue: string }
>("user/fetchCurrentProfile", async (_, { rejectWithValue }) => {
	try {
		const res = await apiFetchProfile();
		return res.data;
	} catch (err: any) {
		const message = err?.response?.data?.message || "Failed to fetch profile";
		return rejectWithValue(message);
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
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCurrentProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.profile = action.payload ?? null;
			})
			.addCase(fetchCurrentProfile.rejected, (state, action) => {
				state.loading = false;
				state.profile = null;
				state.error = action.payload ?? "Failed to fetch profile";
			});
	},
});

export const { setProfile, setPendingEmail, clearPendingEmail } =
	userSlice.actions;
export default userSlice.reducer;
