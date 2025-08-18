import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/store/uiSlice'
import customerReducer from './customer'

export const store = configureStore({
  reducer: { 
    ui: uiReducer,
    customer: customerReducer, 
  },
})
