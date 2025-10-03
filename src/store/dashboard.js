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

export const get_total_manager = createAsyncThunk(
    'get_total_manager',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/totalManagers`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_total_staff = createAsyncThunk(
    'get_total_staff',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/totalStaff`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const dashboardReducer = createSlice({
    // totalLeads: [totalLeads, contactedLeads]
    // totalManager: [totalManager, activeManager]
    // totalStaff: [totalStaff, activeStaff]
    name: 'dashboard',
    initialState: {
        successMessage: '',
        errorMessage: '',
        successTag: '',
        loader: false,
        totalLeads: [0,0],
        totalManager: [0,0],
        totalStaff: [0,0],
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
            
            .addCase(get_total_manager.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_total_manager.fulfilled, (state, { payload }) => {
                state.loader = false
                state.totalManager = payload.data
                state.successMessage = payload.message,
                state.successTag = payload.successTag
            })
            .addCase(get_total_manager.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.message
            })
            
            .addCase(get_total_staff.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_total_staff.fulfilled, (state, { payload }) => {
                state.loader = false
                state.totalStaff = payload.data
                state.successMessage = payload.message,
                state.successTag = payload.successTag
            })
            .addCase(get_total_staff.rejected, (state, { payload }) => {
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