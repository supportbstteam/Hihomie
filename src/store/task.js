import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api/api"

export const get_tasks = createAsyncThunk(
    'get_tasks',
    async ({date, manager_id}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/manager/tasks?date=${date}&manager_id=${manager_id}`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_admin_tasks = createAsyncThunk(
    'get_admin_tasks',
    async (date, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/admin/tasks?date=${date}`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const set_task = createAsyncThunk(
    'set_task',
    async ({object}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/manager/tasks`, object, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const update_task = createAsyncThunk(
    'update_task',
    async ({object}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/manager/tasks`, object, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const delete_task = createAsyncThunk(
    'delete_task',
    async ({ object }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/manager/tasks`, { data: object, withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_notes = createAsyncThunk(
    'get_notes',
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/notes?userId=${userId}`, { withCredentials: true })
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)




export const taskReducer = createSlice({
    name: "task",
    initialState: {
        successMessage: '',
        errorMessage: '',
        successTag: '',
        loader: false,
        tasks: [],
        admin_tasks: [],
        notes: [],
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
            state.successTag = "";
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(get_tasks.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_tasks.fulfilled, (state, action) => {
                state.tasks = action.payload
                state.loader = false
            })
            .addCase(get_tasks.rejected, (state, _) => {
                state.loader = false
            })
        
            .addCase(set_task.pending, (state, _) => {
                state.loader = true
            })
            .addCase(set_task.fulfilled, (state, action) => {
                state.loader = false
                state.successMessage = action.payload.message
            })
            .addCase(set_task.rejected, (state, _) => {
                state.loader = false
            })
        
            .addCase(update_task.pending, (state, _) => {
                state.loader = true
            })
            .addCase(update_task.fulfilled, (state, action) => {
                state.loader = false
                state.successMessage = action.payload.message
            })
            .addCase(update_task.rejected, (state, _) => {
                state.loader = false
            })

            .addCase(delete_task.pending, (state, _) => {
                state.loader = true
            })
            .addCase(delete_task.fulfilled, (state, action) => {
                state.loader = false
                state.successMessage = action.payload.message
            })
            .addCase(delete_task.rejected, (state, _) => {
                state.loader = false
            })

            .addCase(get_admin_tasks.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_admin_tasks.fulfilled, (state, action) => {
                state.admin_tasks = action.payload
                state.loader = false
            })
            .addCase(get_admin_tasks.rejected, (state, _) => {
                state.loader = false
            })
        
            .addCase(get_notes.pending, (state, _) => {
                state.loader = true
            })
            .addCase(get_notes.fulfilled, (state, action) => {
                state.notes = action.payload
                state.loader = false
            })
            .addCase(get_notes.rejected, (state, _) => {
                state.loader = false
            })
    }
})

export const { messageClear } = taskReducer.actions
export default taskReducer.reducer
