import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Progress {
    userId: string;
    courseId: string;
    completedLessonIds: string[];
    isCompleted: boolean;
}

interface ProgressState {
    list: Progress[];
}

const getStoredProgress = (): Progress[] => {
    const progress = localStorage.getItem('lms_progress');
    return progress ? JSON.parse(progress) : [];
};

const initialState: ProgressState = {
    list: getStoredProgress(),
};

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        markLessonComplete: (state, action: PayloadAction<{ userId: string; courseId: string; lessonId: string; totalLessons: number }>) => {
            const { userId, courseId, lessonId, totalLessons } = action.payload;
            let userProgress = state.list.find(p => p.userId === userId && p.courseId === courseId);

            if (!userProgress) {
                userProgress = { userId, courseId, completedLessonIds: [], isCompleted: false };
                state.list.push(userProgress);
            }

            if (!userProgress.completedLessonIds.includes(lessonId)) {
                userProgress.completedLessonIds.push(lessonId);
            }

            if (userProgress.completedLessonIds.length === totalLessons) {
                userProgress.isCompleted = true;
            }

            localStorage.setItem('lms_progress', JSON.stringify(state.list));
        },
        resetProgress: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
            state.list = state.list.filter(p => !(p.userId === action.payload.userId && p.courseId === action.payload.courseId));
            localStorage.setItem('lms_progress', JSON.stringify(state.list));
        }
    },
});

export const { markLessonComplete, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
