import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiAPI from "@/services/ai/ai.api";
import { AiProviderInfo } from "@/services/ai/ai.type";

interface AiState {
	providers: AiProviderInfo[];
	loading: boolean;
	error: string | null;
	lastFetched: number;
}

const initialState: AiState = {
	providers: [],
	loading: false,
	error: null,
	lastFetched: 0,
};

export const fetchAiProviders = createAsyncThunk(
	"ai/fetchProviders",
	async (_, { rejectWithValue }) => {
		try {
			const res = await aiAPI.listProviders();
			// apiCaller returns ApiResponseDto<T>, payload is in res.data
			const providers = (res as any)?.data ?? res;
			return providers as AiProviderInfo[];
		} catch (err: any) {
			return rejectWithValue(err?.message || "Failed to load AI providers");
		}
	},
);

const aiSlice = createSlice({
	name: "ai",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAiProviders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAiProviders.fulfilled, (state, action) => {
				state.providers = action.payload as AiProviderInfo[];
				state.loading = false;
				state.lastFetched = Date.now();
			})
			.addCase(fetchAiProviders.rejected, (state, action) => {
				state.loading = false;
				state.error =
					(action.payload as string) || "Failed to load AI providers";
			});
	},
});

export default aiSlice.reducer;
export type { AiState };
