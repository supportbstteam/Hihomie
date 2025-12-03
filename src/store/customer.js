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

export const add_due_date = createAsyncThunk(
   'add_due_date',
   async ({ dueDateForm, cardId }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post(`/customer/${cardId}/due-date`, dueDateForm, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const get_due_date = createAsyncThunk(
   'get_due_date',
   async (cardId, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/customer/${cardId}/due-date`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const delete_due_date = createAsyncThunk(
   'delete_due_date',
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/customer/${id}/due-date`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const save_bank = createAsyncThunk(
   'save_bank',
   async ({ bankData, cardId }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.put(`/customer/${cardId}/bank`, bankData, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const get_documents = createAsyncThunk(
   'get_documents',
   async (cardId, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/customer/${cardId}/documents`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const delete_document = createAsyncThunk(
   'delete_document',
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/customer/${id}/documents`, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
)

export const bulk_assignment = createAsyncThunk(
   'bulk_assignment',
   async ( leads , { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post(`/customer/bulk-assignment`, { leads }, { withCredentials: true })
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
      comments: [],
      dueDate: [],
      documents: [],
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

         .addCase(add_due_date.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(add_due_date.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(get_due_date.fulfilled, (state, { payload }) => {
            state.dueDate = payload.dueDates;
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(get_due_date.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(delete_due_date.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(delete_due_date.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(save_bank.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(save_bank.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(get_documents.fulfilled, (state, { payload }) => {
            state.documents = payload.documents;
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(get_documents.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })

         .addCase(delete_document.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message; // if backend sends a message
            state.loader = false;
         })
         .addCase(delete_document.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
         })
      
         .addCase(bulk_assignment.pending, (state, { payload }) => { 
            state.loader = true;
         })
         .addCase(bulk_assignment.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message;
            state.loader = false;
          })
         .addCase(bulk_assignment.rejected, (state, { payload }) => { 
            state.loader = false;
            state.errorMessage = payload.error;
         })
   }
})
export const { messageClear } = customerReducer.actions
export default customerReducer.reducer;