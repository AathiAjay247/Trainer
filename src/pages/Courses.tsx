import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { deleteCourse } from '../features/courses/courseSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Courses: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courses = useSelector((state: RootState) => state.courses.list);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const users = useSelector((state: RootState) => state.users.list);
    const progressList = useSelector((state: RootState) => state.progress.list);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            dispatch(deleteCourse(id));
        }
    };

    const filteredCourses = courses.filter(course => {
        if (currentUser?.role === 'Admin') return true;
        if (currentUser?.role === 'Instructor') {
            const creator = users.find(u => u.id === course.instructorId);
            return course.instructorId === currentUser.id || creator?.role === 'Admin';
        }
        if (currentUser?.role === 'Student') return course.enrolledStudentIds?.includes(currentUser.id) && course.status === 'Approved';
        return false;
    });

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Courses
                {(currentUser?.role === 'Admin' || currentUser?.role === 'Instructor') && (
                    <Button variant="contained" sx={{ float: 'right' }} onClick={() => navigate('/courses/new')}>
                        Create Course
                    </Button>
                )}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Status</TableCell>
                            {(currentUser?.role === 'Admin' || currentUser?.role === 'Instructor') && (
                                <TableCell align="right">Assigned To</TableCell>
                            )}
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCourses.map((course) => {
                            const enrolledCount = course.enrolledStudentIds?.length || 0;
                            const enrolledNames = course.enrolledStudentIds?.map(id => users.find(u => u.id === id)?.name).filter(Boolean).join(', ');
                            const userProgress = progressList.find(p => p.courseId === course.id && p.userId === currentUser?.id);
                            const isCompleted = userProgress?.isCompleted;

                            return (
                                <TableRow
                                    key={course.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {course.title}
                                    </TableCell>
                                    <TableCell>{course.description}</TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={currentUser?.role === 'Student' && isCompleted ? 'Completed' : course.status}
                                            color={
                                                (currentUser?.role === 'Student' && isCompleted) || course.status === 'Approved'
                                                    ? 'success'
                                                    : 'warning'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    {(currentUser?.role === 'Admin' || currentUser?.role === 'Instructor') && (
                                        <TableCell align="right">
                                            {enrolledCount > 0 ? (
                                                <span title={enrolledNames}>{enrolledCount} Student{enrolledCount > 1 ? 's' : ''}</span>
                                            ) : (
                                                <span style={{ color: '#999' }}>None</span>
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell align="right">
                                        {currentUser?.role === 'Student' && (
                                            <Button
                                                variant="contained"
                                                color={isCompleted ? "success" : "primary"}
                                                startIcon={<PlayCircleOutlineIcon />}
                                                onClick={() => navigate(`/courses/${course.id}/learn`)}
                                            >
                                                {isCompleted ? "Review" : "Start"}
                                            </Button>
                                        )}
                                        {(currentUser?.role === 'Admin' ||
                                            (currentUser?.role === 'Instructor' && course.instructorId === currentUser?.id)) && (
                                                <>
                                                    <IconButton onClick={() => navigate(`/courses/${course.id}/edit`)}><EditIcon /></IconButton>
                                                    <IconButton onClick={() => handleDelete(course.id)} color="error"><DeleteIcon /></IconButton>
                                                </>
                                            )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredCourses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No courses found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Courses;
