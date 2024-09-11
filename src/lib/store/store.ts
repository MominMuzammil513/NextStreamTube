import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../store/features/uiSlice'  // Import the new reducer
import videoPlayerSlice from './features/videoPlayerSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,  // Add the new reducer
      videoPlayer: videoPlayerSlice,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']