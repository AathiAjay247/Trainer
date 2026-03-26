import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Instructor' | 'Student';
    password?: string; // stored in plain text as requested for mock
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
}

// Helper to get users from localStorage
const getStoredUsers = (): User[] => {
    const users = localStorage.getItem('lms_users');
    return users ? JSON.parse(users) : [];
};

// Helper to get current session from localStorage
const getStoredSession = (): User | null => {
    const session = localStorage.getItem('lms_current_user');
    return session ? JSON.parse(session) : null;
};

const initialState: AuthState = {
    user: getStoredSession(),
    isAuthenticated: !!getStoredSession(),
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup: (state, action: PayloadAction<User>) => {
            const newUser = action.payload;
            const existingUsers = getStoredUsers();

            if (existingUsers.find(u => u.email === newUser.email)) {
                state.error = 'User already exists';
                return;
            }

            // Add to "DB"
            const updatedUsers = [...existingUsers, { ...newUser, id: Date.now().toString() }];
            localStorage.setItem('lms_users', JSON.stringify(updatedUsers));

            // Auto login after signup? User didn't specify, but usually yes. 
            // "store the creadentilas in localstorage" -> assume we just store them for login.
            // But let's keep it simple: Signup -> Redirect to Login or Auto Login.
            // User said: "below the signup button add the link to navigate the sign in page".
            // Let's just register and let them login.
            state.error = null;
        },
        login: (state, action: PayloadAction<{ email: string, password: string, role: string }>) => {
            const { email, password, role } = action.payload;
            const users = getStoredUsers();
            const user = users.find(u => u.email === email && u.password === password && u.role === role);

            if (user) {
                state.user = user;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('lms_current_user', JSON.stringify(user));
            } else {
                state.error = 'Invalid credentials or role';
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('lms_current_user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { signup, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
