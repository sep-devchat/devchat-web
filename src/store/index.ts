import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import threadReducer from "./thread.slice";
import groupMembersReducer from "./groupMembers.slice";
import aiReducer from "./ai.slice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		thread: threadReducer,
		groupMembers: groupMembersReducer,
		ai: aiReducer,
	},
	middleware: (getDefaultMiddleWare) =>
		getDefaultMiddleWare({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
