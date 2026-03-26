# Learning Management System (LMS) - User Guide

## Overview
This is a feature-rich, role-based Learning Management System built with React, TypeScript, Redux, and Material UI. It facilitates course creation, student assignment, and progress tracking across three distinct user roles: **Admin**, **Instructor**, and **Student**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed.

### Installation
1.  Open a terminal in the project root.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

---

## 🔑 Authentication
The system uses `localStorage` to persist users and data. You can **Sign Up** a new account or **Login** with existing credentials.

### Roles
- **Admin**: Full access to Users, Courses, and System Stats.
- **Instructor**: Can create courses and assign students. Can view Admin-created courses.
- **Student**: Targeted view of assigned courses and learning progress.

---

## 👨‍💼 Admin Guide

### 1. Dashboard
- View system-wide statistics:
  - **Total Courses**
  - **Total Students**
  - **Total Instructors**

### 2. User Management
- Navigate to **"User Mgmt"** in the sidebar.
- **View**: See all registered users and their roles.
- **Actions**:
  - **Edit**: Update user details.
  - **Delete**: Remove users from the system.

### 3. Course Management
- Navigate to **"Courses"**.
- **Create**: Click "Create Course".
  - **Modules & Lessons**: Add expandable modules and lessons.
  - **Content**: Add text or URLs (URLs become clickable links).
  - **Status**: Set to **"Approved"** to make it visible to students.
  - **Assignment**: Select students from the "Assign Students" list.
- **Edit/Delete**: Manage any course in the system.

---

## 👨‍🏫 Instructor Guide

### 1. Dashboard
- **My Courses**: Count of courses you manage.
- **Total Students Enrolled**: Unique count of students assigned to your courses.

### 2. Course Management
- **View**: access your own courses AND courses created by Admins.
- **Create/Edit**: Full course editor access.
  - **Note**: Ensure the Status is set to **"Approved"** for student visibility.
- **Assign Students**: Use the assignment list in the Course Editor to enroll students.

---

## 👨‍🎓 Student Guide

### 1. Dashboard
- Track your learning journey:
  - **Assigned Courses**: Total courses assigned to you.
  - **Completed Courses**: Courses where you finished all lessons.
  - **Pending Courses**: Courses still in progress.

### 2. My Courses
- Navigate to **"Courses"**.
- **Filter**: You only see courses that are **Assigned** to you AND **Approved** by an Admin/Instructor.
- **Status Indicators**:
  - **Start**: Begin a new course.
  - **Review**: Re-visit a completed course (Green highlight).

### 3. Learning (Course Player)
- Click "Start" on a course.
- **Content**: Read text or click links (e.g., YouTube videos) which open in new tabs.
- **Progress**: Click **"Mark as Completed"** after finishing a lesson.
- **Auto-Completion**: The course status automatically updates to **"Completed"** when all lessons are finished.

---

## 🛠 Features Summary
| Feature | Admin | Instructor | Student |
| :--- | :---: | :---: | :---: |
| **Dashboard Stats** | System Overview | Instructor Specific | Personal Progress |
| **Manage Users** | ✅ | ❌ | ❌ |
| **Create Courses** | ✅ | ✅ | ❌ |
| **Approve Courses** | ✅ | ✅ | ❌ |
| **Assign Students** | ✅ | ✅ | ❌ |
| **View Content** | ✅ | ✅ | ✅ |
| **Track Progress** | N/A | N/A | ✅ |

---

## 💾 Data Persistence
- All data (Users, Courses, Progress) is saved to your browser's **LocalStorage**.
- **Note**: Clearing browser cache will reset the application data.
