import { createSlice } from "@reduxjs/toolkit";

const calculatorSlice = createSlice({
    name: "calculator",
    initialState: {
        tab: "mortgage"
    },
    reducers: {
        setTab: (state, action) => {
            state.tab = action.payload
        }
    }
})

export const { setTab } = calculatorSlice.actions
export default calculatorSlice.reducer
