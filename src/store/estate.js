import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api/api";

export const create_property = createAsyncThunk(
    'create_property',
    async (object, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/estate/property`, object, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const estateReducer = createSlice({
    name: "estate",
    initialState: {
        loader: false, // Added loader state
        successMessage: '',
        errorMessage: '',
        successTag: '',
        properties: [], // Optional: To store the list of properties
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
            state.successTag = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(create_property.pending, (state) => {
                state.loader = true;
                state.errorMessage = "";
                state.successMessage = ""; // Clear old success messages
                state.successTag = "";      // Reset the tag
            })
            .addCase(create_property.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message || "Property created successfully!";
                state.successTag = "PROPERTY_CREATED";
                if (payload.data) {
                    // Use unshift to put the newest property at the top of the list
                    state.properties.unshift(payload.data);
                }
            })
            .addCase(create_property.rejected, (state, { payload }) => {
                state.loader = false;
                // Use optional chaining to safely access payload
                state.errorMessage = payload?.message || "Failed to create property";
                state.successTag = "";
            });
    }
});

export default estateReducer.reducer;
export const { messageClear } = estateReducer.actions;