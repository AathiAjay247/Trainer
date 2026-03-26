import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz';
    content: string;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    instructorId: string;
    description: string;
    status: 'Approved' | 'Pending';
    modules: Module[];
    enrolledStudentIds: string[];
}

interface CoursesState {
    list: Course[];
}

const getStoredCourses = (): Course[] => {
    const courses = localStorage.getItem('lms_courses');
    return courses ? JSON.parse(courses) : [];
};

const initialState: CoursesState = {
    list: getStoredCourses(),
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        addCourse: (state, action: PayloadAction<Course>) => {
            state.list.push(action.payload);
            localStorage.setItem('lms_courses', JSON.stringify(state.list));
        },
        updateCourse: (state, action: PayloadAction<Course>) => {
            const index = state.list.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
                localStorage.setItem('lms_courses', JSON.stringify(state.list));
            }
        },
        deleteCourse: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(c => c.id !== action.payload);
            localStorage.setItem('lms_courses', JSON.stringify(state.list));
        },
        enrollStudent: (state, action: PayloadAction<{ courseId: string, studentId: string }>) => {
            const { courseId, studentId } = action.payload;
            const course = state.list.find(c => c.id === courseId);
            if (course && !course.enrolledStudentIds.includes(studentId)) {
                course.enrolledStudentIds.push(studentId);
                localStorage.setItem('lms_courses', JSON.stringify(state.list));
            }
        }
    },
});

export const { addCourse, updateCourse, deleteCourse, enrollStudent } = courseSlice.actions;
export default courseSlice.reducer;
