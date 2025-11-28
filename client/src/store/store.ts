import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import listReducer from './slices/listSlice';
import cardReducer from './slices/cardSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    list: listReducer,
    card: cardReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
