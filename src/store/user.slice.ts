import { Profile } from "@/services/auth/auth.type";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
	profile: Profile | null;
	pendingEmail: string | null;
}

const initialState: UserState = {
	profile: null,
	pendingEmail: null,
};

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
});

export const { setProfile, setPendingEmail, clearPendingEmail } =
	userSlice.actions;
export default userSlice.reducer;
