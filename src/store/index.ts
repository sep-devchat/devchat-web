import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import threadReducer from "./thread.slice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		thread: threadReducer,
	},
	middleware: (getDefaultMiddleWare) =>
		getDefaultMiddleWare({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
