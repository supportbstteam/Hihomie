import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api/api"

export const get_leads = createAsyncThunk(
    'get_leads',
    async (userStatus, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/leads?userStatus=${userStatus}`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const mailReducer = createSlice({
    name: "mailer",
    initialState: {
        leads: [],
        loader: false,
        successMessage: '',
        errorMessage: '',
        successTag: '',
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
            .addCase(get_leads.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_leads.fulfilled, (state, action) => {
                state.loader = false
                state.leads = action.payload.leads
                state.successMessage = action.payload.message
                state.successTag = "success"
            })
            .addCase(get_leads.rejected, (state, action) => {
                state.loader = false
                state.errorMessage = action.payload.message
                state.successTag = "error"
            })
    }
})

export default mailReducer.reducer
export const { messageClear } = mailReducer.actions