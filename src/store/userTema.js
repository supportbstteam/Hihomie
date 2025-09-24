import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../lib/api/api"

export const add_team = createAsyncThunk(
   'team/AddTeam',
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.post('/team', object, { withCredentials: true })
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)

      }
   }
)


export const get_teamData = createAsyncThunk(
   "team/get_teamData",
   async (_, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/team`, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const get_userById = createAsyncThunk(
   "user/get_userById",
   async({ id }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/user/${id}`, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const update_userById = createAsyncThunk(
   "user/update_userById",
   async ({ id, object }, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.patch(`/user/${id}`, object, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const delete_teamData = createAsyncThunk(
   "team/delete_teamData",
   async (id, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.delete(`/team`, {
            data: { id }, // body goes here
            withCredentials: true,
         });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const update_team = createAsyncThunk(
   "team/update_team",
   async (object, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.put(
            `/team`,
            object,  // send object directly as body
            { withCredentials: true } // config separately
         );
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);

export const assign_to_team = createAsyncThunk(
   'assign_to_team',
   async ({object, colId, cardId}, { rejectWithValue, fulfillWithValue }) => {
      try {
        const { data } = await api.post(`/team/card/${colId}/${cardId}`, object, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response.data)
      }
   }
);

export const get_assignTeam = createAsyncThunk(
   "team/get_assignTeam",
   async ({cardId, colId}, { rejectWithValue, fulfillWithValue }) => {
      try {
         const { data } = await api.get(`/team/card/${colId}/${cardId}`, { withCredentials: true });
         return fulfillWithValue(data);
      } catch (error) {
         return rejectWithValue(error.response?.data || "Something went wrong");
      }
   }
);


export const userTeamReducer = createSlice({

   name: 'userTeam',
   initialState: {
      successMessage: '',
      errorMessage: '',
      loader: false,
      team: [],
      assignTeam: [],
      userById: '',
   },
   reducers: {

      messageClear: (state, _) => {
         state.errorMessage = "";
         state.successMessage = "";
      }

   },
   extraReducers: (builder) => {

      builder
         .addCase(add_team.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(add_team.rejected, (state, { payload }) => {

            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(add_team.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.team = [...state.team, payload.data]
         })

          .addCase(assign_to_team.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(assign_to_team.rejected, (state, { payload }) => {

            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(assign_to_team.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.assignTeam = [...state.assignTeam, payload.data]
         })
         

         .addCase(get_teamData.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_teamData.fulfilled, (state, { payload }) => {
            state.team = payload.data;
            state.loader = false;
         })

         .addCase(update_team.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(update_team.rejected, (state, { payload }) => {

            state.loader = false;
            state.errorMessage = payload.error;
         })
         .addCase(update_team.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.team = state.team.map(item =>
               item._id === payload.data._id ? payload.data : item
            );
         })


         .addCase(delete_teamData.pending, (state) => {
            state.loader = true;
         })
         .addCase(delete_teamData.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;

            state.team = state.team.filter(
               (item) => item._id !== payload.deleted._id   // payload me id return karna zaroori hai
            );
         })
         .addCase(delete_teamData.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.message || "Something went wrong";
         })

         .addCase(get_assignTeam.pending, (state, { payload }) => {
            state.loader = true;
         })
         .addCase(get_assignTeam.fulfilled, (state, { payload }) => {
            state.assignTeam = payload.data;
            state.loader = false;
            state.successMessage = payload.message;
         })
      
         .addCase(get_userById.pending, (state, _) => {
            state.loader = true;
         })
         .addCase(get_userById.fulfilled, (state, { payload }) => {
            state.userById = payload.data;
            state.loader = false;
            state.successMessage = payload.message;
         })
         .addCase(get_userById.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.message || "Something went wrong";
         })
      
         .addCase(update_userById.pending, (state, _) => {
            state.loader = true;
         })
         .addCase(update_userById.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            state.userById = payload.data;
         })
         .addCase(update_userById.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.message || "Something went wrong";
         })
   }
})
export const { messageClear } = userTeamReducer.actions
export default userTeamReducer.reducer;