import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../lib/api/api"

export const customerAdd = createAsyncThunk(
   'customerAdd',
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post('/customer', object, { withCredentials: true })
         console.log(data)
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)

      }
   }
)


export const customerReducer = createSlice({

   name: 'customer',
   initialState: {
      successMessage: '',
      errorMessage: '',
      loader: false,
      customer : [],
      totalCategory : 0
   },
   reducers: {

      messageClear: (state, _) => {
         state.errorMessage = "";
      }

   },
   extraReducers: (builder) => {

      builder
         .addCase(customerAdd.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(customerAdd.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(customerAdd.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.customer = [...state.customer, payload.customer]
         })
        //  .addCase(get_category.fulfilled, (state, { payload }) => {
        //     state.totalCategory = payload.totalCategory;
        //     state.categorys = payload.category;
        //  })
   }
})
export const { messageClear } = customerReducer.actions
export default customerReducer.reducer;