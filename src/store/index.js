import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/store/uiSlice'
import customerReducer from './customer'
import settingReducer from './setting'
import categoryReducer from './category'
import userTeamReducer from './userTema'
import dashboardReducer from './dashboard'
import calculatorReducer from './calculator'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    customer: customerReducer,
    setting: settingReducer,
    category: categoryReducer,
    team: userTeamReducer,
    dashboard: dashboardReducer,
    calculator: calculatorReducer,
  },
})

