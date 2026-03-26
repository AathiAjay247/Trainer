import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../auth/authSlice';

interface UsersState {
    list: User[];
}

// Helper to get users from localStorage (shared with authSlice)
const getStoredUsers = (): User[] => {
    const users = localStorage.getItem('lms_users');
    return users ? JSON.parse(users) : [];
};

const initialState: UsersState = {
    list: getStoredUsers(),
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        syncUsers: (state) => {
            state.list = getStoredUsers();
        },
        addUser: (state, action: PayloadAction<User>) => {
            state.list.push(action.payload);
            localStorage.setItem('lms_users', JSON.stringify(state.list));
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.list.findIndex(u => u.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
                localStorage.setItem('lms_users', JSON.stringify(state.list));
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(u => u.id !== action.payload);
            localStorage.setItem('lms_users', JSON.stringify(state.list));
        },
    },
});

export const { syncUsers, addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
