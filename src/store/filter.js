import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        filters: {
            id: "",
            gestor: "",
            estado: "",
            full_name: "",
            phone: "",
            contacted: "",
            contract_signed: "",
            document_submitted: "",
            bank: "",
            lead_type: "",
            from_date: "",
            to_date: "",
        }
    },
    reducers: {
        setFilters: (state, action) => { state.filters = action.payload },
    },
})

export const { setFilters } = filterSlice.actions
export default filterSlice.reducer
