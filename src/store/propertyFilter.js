import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'propertyFilter',
    initialState: {
        filters: {
            ref: "",
            propertyFor: "",
            type: "",
            status: "",
            location: "",
            // price_min: "",
            // price_max: "",
        }
    },
    reducers: {
        setPropertyFilters: (state, action) => { state.filters = action.payload },
    },
})

export const { setPropertyFilters } = filterSlice.actions
export default filterSlice.reducer
