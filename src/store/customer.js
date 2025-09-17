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

export const forgot_password = createAsyncThunk(
   'forgot_password',
   async (email, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post(`/customer/forgotPassword/${email}`, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

export const reset_password = createAsyncThunk(
   'reset_password',
   async ({ password, token }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.put(`/customer/forgotPassword`, { password, token }, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

export const add_customer_comments = createAsyncThunk(
   'add_customer_comments',
   async ({ commentFormData, cardId }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post(`/customer/${cardId}/comments`, commentFormData, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const get_customer_comments = createAsyncThunk(
   'get_customer_comments',
   async (cardId, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/customer/${cardId}/comments`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const delete_comments = createAsyncThunk(
   'delete_comments',
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/customer/${id}/comments`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);




export const customerReducer = createSlice({

   name: 'customer',
   initialState: {
      successMessage: '',
      errorMessage: '',
      loader: false,
      customer: [],
      comments: [],
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
            console.log(state.customer)
            state.customer = [...state.customer, payload.customer]
         })
         .addCase(get_customer.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_customer.fulfilled, (state, { payload }) => {
            state.customer = payload.customer;
            console.log(state.customer)
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
            console.log(payload)
            state.successMessage = payload.message; // if backend sends a message
            // state.customer = state.customer.filter(
            //    (cust) => cust._id !== payload._id  // remove deleted one
            // );

            // Find the lead that contains the deleted card
            const leadIndex = state.customer.findIndex(
               (cust) => cust._id === payload.colId
            );

            if (leadIndex !== -1) {
               // Create a new array of cards without the deleted one
               const updatedCards = state.customer[leadIndex].cards.filter(
                  (card) => card._id !== payload.cardId
               );
               // Update the state with the new cards array
               state.customer[leadIndex] = {
                  ...state.customer[leadIndex],
                  cards: updatedCards,
               };
            }
         })

         .addCase(forgot_password.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(forgot_password.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(forgot_password.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })

         .addCase(reset_password.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(reset_password.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(reset_password.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })

         .addCase(add_customer_comments.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(add_customer_comments.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(get_customer_comments.fulfilled, (state, { payload }) => {
            state.comments = payload.comments;
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(get_customer_comments.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(delete_comments.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(delete_comments.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
   }
})
export const { messageClear } = customerReducer.actions
export default customerReducer.reducer;