import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../app/store';
import { markLessonComplete } from '../features/progress/progressSlice';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Button, Box, Divider, Alert, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const CoursePlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const course = useSelector((state: RootState) => state.courses.list.find(c => c.id === id));
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const progress = useSelector((state: RootState) => state.progress.list.find(p => p.userId === currentUser?.id && p.courseId === id));

    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    // Flatten lessons for easier navigation
    const allLessons = course?.modules.flatMap(m => m.lessons) || [];

    useEffect(() => {
        if (allLessons.length > 0 && !activeLessonId) {
            setActiveLessonId(allLessons[0].id);
        }
    }, [allLessons, activeLessonId]);

    if (!course || !currentUser) return <Typography>Course not found or unauthorized</Typography>;

    const activeLesson = allLessons.find(l => l.id === activeLessonId);
    const isCompleted = progress?.completedLessonIds.includes(activeLessonId || '');
    const isCourseCompleted = progress?.isCompleted;

    const handleComplete = () => {
        if (activeLesson) {
            dispatch(markLessonComplete({
                userId: currentUser.id,
                courseId: course.id,
                lessonId: activeLesson.id,
                totalLessons: allLessons.length
            }));
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {isCourseCompleted && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Congratulations! You have completed this course.
                </Alert>
            )}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 4, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                        {activeLesson ? (
                            <>
                                <Typography variant="h5" gutterBottom>{activeLesson.title}</Typography>
                                <Chip label={activeLesson.type.toUpperCase()} size="small" sx={{ mb: 2, width: 'fit-content' }} />
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1" component="div" sx={{ flexGrow: 1, whiteSpace: 'pre-wrap' }}>
                                    {activeLesson.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                        part.match(/https?:\/\/[^\s]+/) ? (
                                            <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                                {part}
                                            </a>
                                        ) : (
                                            part
                                        )
                                    ) || "No content available."}
                                </Typography>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                    {!isCompleted ? (
                                        <Button variant="contained" onClick={handleComplete}>
                                            Mark as Completed
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" disabled>
                                            Completed
                                        </Button>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <Typography>Select a lesson to start</Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                            Course Content
                        </Typography>
                        {course.modules.map(module => (
                            <Box key={module.id}>
                                <Typography variant="subtitle2" sx={{ p: 1, bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                                    {module.title}
                                </Typography>
                                <List disablePadding>
                                    {module.lessons.map(lesson => {
                                        const isLessonCompleted = progress?.completedLessonIds.includes(lesson.id);
                                        return (
                                            <ListItem key={lesson.id} disablePadding>
                                                <ListItemButton
                                                    selected={activeLessonId === lesson.id}
                                                    onClick={() => setActiveLessonId(lesson.id)}
                                                >
                                                    <ListItemIcon>
                                                        {isLessonCompleted ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                                                    </ListItemIcon>
                                                    <ListItemText primary={lesson.title} secondary={lesson.type} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};



export default CoursePlayer;
