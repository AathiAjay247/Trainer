import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import courseReducer from '../features/courses/courseSlice';
import progressReducer from '../features/progress/progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    courses: courseReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
