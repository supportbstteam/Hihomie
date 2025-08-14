import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/store/uiSlice'

export const store = configureStore({
  reducer: { ui: uiReducer },
})
