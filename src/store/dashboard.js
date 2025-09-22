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

export const get_newLeadsThisWeek = createAsyncThunk(
    'get_newLeadsThisWeek',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/newLeadsThisWeek`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_latestActivities = createAsyncThunk(
    'get_latestActivities',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/latestActivities`, { withCredentials: true })
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
            .addCase(get_total_lead.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.message
            })
            
            .addCase(get_newLeadsThisWeek.pending, (state, _) => { state.loader = true })
            .addCase(get_newLeadsThisWeek.fulfilled, (state, { payload }) => {
                state.loader = false
                state.newLeadsThisWeek = payload.data
                state.successMessage = payload.message,
                state.successTag = payload.successTag
            })
            .addCase(get_newLeadsThisWeek.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.message
            })
        
            .addCase(get_latestActivities.pending, (state, _) => { state.loader = true })
            .addCase(get_latestActivities.fulfilled, (state, { payload }) => {
                state.loader = false
                state.latestActivities = payload.data
                state.successMessage = payload.message,
                state.successTag = payload.successTag
            })
            .addCase(get_latestActivities.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.message
            })
    }
})

export const { messageClear } = dashboardReducer.actions
export default dashboardReducer.reducer;