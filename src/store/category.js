import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../lib/api/api"

export const AddCategorys = createAsyncThunk(
    'AddCategory',
    async (object, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.post('category', object, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)

        }
    }
)

export const get_category = createAsyncThunk(
    "customer/get_category",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`category`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const category_update = createAsyncThunk(
    "customer/category_update",
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.put(`/category`, formData, { withCredentials: true }
            );

            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const delete_category = createAsyncThunk(
    "customer/delete_category",
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/category`, {
                data: { id }, // body goes here
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const categoryReducer = createSlice({

    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        category: [],
    },
    reducers: {

        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }

    },
    extraReducers: (builder) => {

        builder
            .addCase(AddCategorys.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(AddCategorys.rejected, (state, { payload }) => {

                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(AddCategorys.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.category = [...state.category, payload.data]
            })
            .addCase(get_category.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.category = payload.data;
                state.loader = false;
            })

            .addCase(category_update.pending, (state) => {
                state.loader = true;
            })

            .addCase(category_update.rejected, (state, { payload }) => {

                state.loader = false;
                state.errorMessage = payload.error;
            })

            .addCase(category_update.fulfilled, (state, { payload }) => {
                state.category = state.category.map((cat) =>
                    cat._id === payload.data._id ? payload.data : cat
                );
                state.loader = false;
                state.successMessage = payload.message;
            })

            

            .addCase(delete_category.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;

                // ✅ Delete ke baad table se row hata do
                state.category = state.category.filter(
                    (item) => item._id !== payload.deleted._id   // payload me id return karna zaroori hai
                );
            })
            .addCase(delete_category.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message || "Something went wrong";
            })
    }
})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer;