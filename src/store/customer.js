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



export const get_customer = createAsyncThunk(
  "customer/get_customer",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/customer`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const customerReducer = createSlice({

   name: 'customer',
   initialState: {
      successMessage: '',
      errorMessage: '',
      loader: false,
      customer : [],
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
            // state.customer = [...state.customer, payload.customer]
         })
         .addCase(get_customer.fulfilled, (state, { payload }) => {
            state.customer = payload;
         })
   }
})
export const { messageClear } = customerReducer.actions
export default customerReducer.reducer;