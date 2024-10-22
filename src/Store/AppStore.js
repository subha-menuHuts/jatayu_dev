import { configureStore } from '@reduxjs/toolkit'
import { commonReducer, locationReducer } from './Reducers'

export const store = configureStore({
  reducer: {
    common:commonReducer,
    location:locationReducer
  },
})