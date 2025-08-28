import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/store/uiSlice'
import customerReducer from './customer'
import settingReducer from './setting'
import  categoryReducer  from './category'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    customer: customerReducer,
    setting: settingReducer,
    category : categoryReducer,
  },
})
