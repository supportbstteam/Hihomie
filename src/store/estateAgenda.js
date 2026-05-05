import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api/api";

export const create_agenda = createAsyncThunk(
  "agenda/create_agenda",
  async (agendaData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/estate/agenda", agendaData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const get_agendas = createAsyncThunk(
  "agenda/get_agendas",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const { data } = await api.get(`/estate/agenda?${params.toString()}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const agendaSlice = createSlice({
  name: "agenda",
  initialState: {
    loader: false,
    agendas: [],
    successMessage: "",
    errorMessage: "",
    successTag: "",
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
      state.successTag = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ── create_agenda ──
      .addCase(create_agenda.pending, (state) => {
        state.loader = true;
      })
      .addCase(create_agenda.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
        state.successTag = "AGENDA_CREATED";
      })
      .addCase(create_agenda.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.message || "Something went wrong";
      })

      // ── get_agendas ──
      .addCase(get_agendas.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_agendas.fulfilled, (state, action) => {
        state.loader = false;
        state.agendas = action.payload.data;
      })
      .addCase(get_agendas.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.message || "Failed to fetch agendas";
      });
  },
});

export const { messageClear } = agendaSlice.actions;
export default agendaSlice.reducer;