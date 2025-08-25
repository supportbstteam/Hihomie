import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/store/uiSlice'
import customerReducer from './customer'
import settingReducer from './setting'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    customer: customerReducer,
    setting: settingReducer,
  },
})
