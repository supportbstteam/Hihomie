import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api/api"

export const get_total_lead = createAsyncThunk(
    'get_total_lead',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/totalLeads`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const dashboardReducer = createSlice({

    name: 'dashboard',
    initialState: {
        successMessage: '',
        errorMessage: '',
        successTag: '',
        loader: false,
        totalLeads: 0,
        totalManager: 0,
        totalAgent: 0,
        newLeadsThisWeek: [],
        latestActivities: [],
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
            state.successTag = "";
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(get_total_lead.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_total_lead.fulfilled, (state, { payload }) => {
                state.loader = false
                state.totalLeads = payload.data
                state.successMessage = payload.message,
                state.successTag = payload.successTag
            })
            .addCase(get_total_lead.rejected, (state, _) => {
                state.loader = false
            })
    }
})

export const { messageClear } = dashboardReducer.actions
export default dashboardReducer.reducer;