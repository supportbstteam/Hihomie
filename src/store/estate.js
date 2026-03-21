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

export const get_properties = createAsyncThunk(
    'get_properties',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/estate/property`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            rejectWithValue(error.response.data);
        }
    }
);

export const get_property = createAsyncThunk(
    'get_property',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/estate/property/${id}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const update_property = createAsyncThunk(
    'update_property',
    async ({ id, object }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/estate/property/${id}`, object, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const delete_property = createAsyncThunk(
    'delete_property',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Using params object in Axios
            const { data } = await api.delete('/estate/property', {
                params: { id },
                withCredentials: true
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_tags = createAsyncThunk(
    'get_tags',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/estate/tags`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const estateReducer = createSlice({
    name: "estate",
    initialState: {
        loader: false,
        successMessage: '',
        errorMessage: '',
        successTag: '',
        properties: [],
        property: {},
        tags: [],
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
            })

            .addCase(get_properties.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_properties.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.properties = payload.data;
            })
            .addCase(get_properties.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Failed to fetch properties";
            })

            .addCase(get_property.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_property.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.property = payload.data;
            })
            .addCase(get_property.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Failed to fetch property";
            })

            .addCase(update_property.pending, (state) => {
                state.loader = true;
            })
            .addCase(update_property.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message || "Property updated successfully!";
                state.successTag = "PROPERTY_UPDATED";
            })
            .addCase(update_property.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Failed to update property";
                state.successTag = "";
            })

            .addCase(delete_property.pending, (state) => {
                state.loader = true;
            })
            .addCase(delete_property.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message || "Property deleted successfully!";
                state.successTag = "PROPERTY_DELETED";
            })
            .addCase(delete_property.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Failed to delete property";
                state.successTag = "";
            })

            .addCase(get_tags.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_tags.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.tags = payload.data;
            })
            .addCase(get_tags.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Failed to fetch tags";
            });
    }
});

export default estateReducer.reducer;
export const { messageClear } = estateReducer.actions;