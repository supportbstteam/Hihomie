import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../lib/api/api"

export const customerAdd = createAsyncThunk(
   'customerAdd',
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post('/customer', object, { withCredentials: true })
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

export const customerUpdate = createAsyncThunk(
   'customerUpdate',
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.put('/customer', object, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)

      }
   }
)

export const cardUpdate = createAsyncThunk(
   'cardUpdate',
   async ({ userId, to }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post('/customer/card', {

            userId, to

         }, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)

      }
   }
)


export const cardDelete = createAsyncThunk(
   'cardDelete',
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/customer/${id}`, { withCredentials: true });
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
      customer: [],
   },
   reducers: {

      messageClear: (state, _) => {
         state.errorMessage = "";
         state.successMessage = "";
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
         .addCase(get_customer.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_customer.fulfilled, (state, { payload }) => {
            state.customer = payload.customer;
            state.loader = false;
         })

         // Update customer
         .addCase(customerUpdate.pending, (state) => {
            state.loader = true;
         })
         .addCase(customerUpdate.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(customerUpdate.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
         })
         .addCase(cardDelete.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.customer = state.customer.filter(
               (cust) => cust._id !== payload._id  // remove deleted one
            );
         })
   }
})
export const { messageClear } = customerReducer.actions
export default customerReducer.reducer;