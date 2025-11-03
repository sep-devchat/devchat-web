import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThreadResponse } from "@/services/threadAPI.ts";
import { UserResponse } from "@/services/userAPI.ts";

interface ThreadState {
	threadsByChannel: {
		[key: string]: {
			threads: ThreadResponse[];
			creators: { [userId: string]: UserResponse };
			lastFetched: number;
			isLoading: boolean;
		};
	};
}

const initialState: ThreadState = {
	threadsByChannel: {},
};

const threadSlice = createSlice({
	name: "thread",
	initialState,
	reducers: {
		setThreadsLoading: (
			state,
			action: PayloadAction<{ channelKey: string; isLoading: boolean }>,
		) => {
			const { channelKey, isLoading } = action.payload;
			if (!state.threadsByChannel[channelKey]) {
				state.threadsByChannel[channelKey] = {
					threads: [],
					creators: {},
					lastFetched: 0,
					isLoading: false,
				};
			}
			state.threadsByChannel[channelKey].isLoading = isLoading;
		},

		setThreads: (
			state,
			action: PayloadAction<{
				channelKey: string;
				threads: ThreadResponse[];
				creators: { [userId: string]: UserResponse };
			}>,
		) => {
			const { channelKey, threads, creators } = action.payload;
			state.threadsByChannel[channelKey] = {
				threads,
				creators,
				lastFetched: Date.now(),
				isLoading: false,
			};
		},

		addThread: (
			state,
			action: PayloadAction<{ channelKey: string; thread: ThreadResponse }>,
		) => {
			const { channelKey, thread } = action.payload;
			if (state.threadsByChannel[channelKey]) {
				state.threadsByChannel[channelKey].threads.unshift(thread);
			}
		},

		updateThread: (
			state,
			action: PayloadAction<{
				channelKey: string;
				threadId: string;
				updates: Partial<ThreadResponse>;
			}>,
		) => {
			const { channelKey, threadId, updates } = action.payload;
			if (state.threadsByChannel[channelKey]) {
				const threadIndex = state.threadsByChannel[
					channelKey
				].threads.findIndex((t) => t.id === threadId);
				if (threadIndex !== -1) {
					state.threadsByChannel[channelKey].threads[threadIndex] = {
						...state.threadsByChannel[channelKey].threads[threadIndex],
						...updates,
					};
				}
			}
		},

		deleteThread: (
			state,
			action: PayloadAction<{ channelKey: string; threadId: string }>,
		) => {
			const { channelKey, threadId } = action.payload;
			if (state.threadsByChannel[channelKey]) {
				state.threadsByChannel[channelKey].threads = state.threadsByChannel[
					channelKey
				].threads.filter((t) => t.id !== threadId);
			}
		},

		invalidateThreadCache: (
			state,
			action: PayloadAction<{ channelKey: string }>,
		) => {
			const { channelKey } = action.payload;
			if (state.threadsByChannel[channelKey]) {
				state.threadsByChannel[channelKey].lastFetched = 0;
			}
		},

		clearAllThreads: (state) => {
			state.threadsByChannel = {};
		},
	},
});

export const {
	setThreadsLoading,
	setThreads,
	addThread,
	updateThread,
	deleteThread,
	invalidateThreadCache,
	clearAllThreads,
} = threadSlice.actions;

export default threadSlice.reducer;
