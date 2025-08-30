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


export const delete_leadStatusDelete = createAsyncThunk(
   "customer/delete_leadStatusDelete",
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/setting/leadStatus`, {
            data: { id }, // body goes here
            withCredentials: true,
         });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const update_statusData = createAsyncThunk(
   "customer/update_statusData",
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.put(
            `/setting/leadStatus/status`,
            object,  // send object directly as body
            { withCredentials: true } // config separately
         );
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const get_leadStatusDataForList = createAsyncThunk(
   "customer/get_leadStatusDataForList",
   async (_, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/setting/leadListStatus`, { withCredentials: true });
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
      leadStatusList : [],
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
            const { sourceCol, destCol } = payload;

            state.leadStatus = state.leadStatus.map(col => {
               if (col._id === sourceCol._id) return sourceCol;
               if (col._id === destCol._id) return destCol;
               return col;
            });
            state.loader = false;
         })


         .addCase(update_statusData.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(update_statusData.rejected, (state, { payload }) => {

            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(update_statusData.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.leadStatus = state.leadStatus.map(item =>
               item._id === payload.data._id ? payload.data : item
            );
         })


         .addCase(delete_leadStatusDelete.pending, (state) => {
            state.loader = true;
         })
         .addCase(delete_leadStatusDelete.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;

            // ✅ Delete ke baad table se row hata do
            state.leadStatus = state.leadStatus.filter(
               (item) => item._id !== payload.deleted._id   // payload me id return karna zaroori hai
            );
         })
         .addCase(delete_leadStatusDelete.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.message || "Something went wrong";
         })

         .addCase(get_leadStatusDataForList.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_leadStatusDataForList.fulfilled, (state, { payload }) => {
            state.leadStatusList = payload.cards;
            state.loader = false;
         })
   }
})
export const { messageClear } = settingReducer.actions
export default settingReducer.reducer;