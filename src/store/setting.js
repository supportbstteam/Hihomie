import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../lib/api/api"

export const AddStatusData = createAsyncThunk(
   'AddStatusData',
   async (object, { rejectWithValue, fulfillWithValue }) => {

      try {
         const { data } = await api.post('/setting/leadStatus', object, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)

      }
   }
)


export const get_leadStatusData = createAsyncThunk(
   "customer/get_leadStatusData",
   async (_, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/setting/leadStatus`, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const get_leadStatusCardUpdate = createAsyncThunk(
   "customer/get_leadStatusCardUpdate",
   async ({ sourceColId, destColId, cardId }, { rejectWithValue, fulfillWithValue }) => {
      try {
         console.log("hello");
         console.log("Source Column ID:", sourceColId);
         console.log("Destination Column ID:", destColId);
         console.log("Card ID:", cardId);

         const { data } = await api.put(
            `/setting/leadStatus`,
            {
               sourceColId,
               destColId,
               cardId,
            },
            {
               withCredentials: true,
            }
         );

         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);



export const settingReducer = createSlice({

   name: 'setting',
   initialState: {
      successMessage: '',
      errorMessage: '',
      loader: false,
      leadStatus: [],
   },
   reducers: {

      messageClear: (state, _) => {
         state.errorMessage = "";
         state.successMessage = "";
      }

   },
   extraReducers: (builder) => {

      builder
         .addCase(AddStatusData.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(AddStatusData.rejected, (state, { payload }) => {

            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(AddStatusData.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.leadStatus = [...state.leadStatus, payload.data]
         })
         .addCase(get_leadStatusData.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_leadStatusData.fulfilled, (state, { payload }) => {
            state.leadStatus = payload.data;
            state.loader = false;
         })
         .addCase(get_leadStatusCardUpdate.fulfilled, (state, { payload }) => {
            state.leadStatus = payload.data;
            state.loader = false;
         })
   }
})
export const { messageClear } = settingReducer.actions
export default settingReducer.reducer;