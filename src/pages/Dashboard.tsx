import React from 'react';
import { Typography, Paper, Grid, Card, CardContent, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const StatCard: React.FC<{ title: string; value: number | string; color?: string }> = ({ title, value, color = 'primary.main' }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ color }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const courses = useSelector((state: RootState) => state.courses.list);
    const users = useSelector((state: RootState) => state.users.list);
    const progressList = useSelector((state: RootState) => state.progress.list);

    const renderStudentStats = () => {
        const assignedCourses = courses.filter(c => c.enrolledStudentIds?.includes(user?.id || ''));
        const completedCourses = assignedCourses.filter(c => {
            const progress = progressList.find(p => p.courseId === c.id && p.userId === user?.id);
            return progress?.isCompleted;
        });
        const pendingCount = assignedCourses.length - completedCourses.length;

        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Assigned Courses" value={assignedCourses.length} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Completed Courses" value={completedCourses.length} color="success.main" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Pending Courses" value={pendingCount} color="warning.main" />
                </Grid>
            </Grid>
        );
    };

    const renderInstructorStats = () => {
        const myCourses = courses.filter(c => c.instructorId === user?.id);
        const myStudentIds = new Set<string>();
        myCourses.forEach(c => c.enrolledStudentIds?.forEach(id => myStudentIds.add(id)));

        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <StatCard title="My Courses" value={myCourses.length} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <StatCard title="Total Students Enrolled" value={myStudentIds.size} color="secondary.main" />
                </Grid>
            </Grid>
        );
    };

    const renderAdminStats = () => {
        const totalCourses = courses.length;
        const totalStudents = users.filter(u => u.role === 'Student').length;
        const totalInstructors = users.filter(u => u.role === 'Instructor').length;

        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Total Courses" value={totalCourses} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Total Students" value={totalStudents} color="info.main" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Total Instructors" value={totalInstructors} color="secondary.main" />
                </Grid>
            </Grid>
        );
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Welcome, {user?.name}!</Typography>
                <Typography variant="body2" color="textSecondary">Role: {user?.role}</Typography>
            </Paper>

            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Overview</Typography>

            {user?.role === 'Student' && renderStudentStats()}
            {user?.role === 'Instructor' && renderInstructorStats()}
            {user?.role === 'Admin' && (
                <>
                    {renderAdminStats()}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Trainer System Stats</Typography>
                        {/* Admin also sees aggregated student/instructor stats could go here, but sticking to basics first */}
                    </Box>
                </>
            )}
        </div>
    );
};

export default Dashboard;
