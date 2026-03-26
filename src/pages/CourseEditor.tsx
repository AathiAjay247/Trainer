import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../app/store';
import { addCourse, updateCourse } from '../features/courses/courseSlice';
import type { Course, Module, Lesson } from '../features/courses/courseSlice';
import { Container, TextField, Button, Typography, Box, Paper, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox, ListItemButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

const CourseEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const existingCourse = useSelector((state: RootState) => state.courses.list.find(c => c.id === id));
    const users = useSelector((state: RootState) => state.users.list);
    const students = users.filter(u => u.role === 'Student');

    const [title, setTitle] = useState(existingCourse?.title || '');
    const [description, setDescription] = useState(existingCourse?.description || '');
    const [status, setStatus] = useState<'Pending' | 'Approved'>(existingCourse?.status || 'Pending');
    const [modules, setModules] = useState<Module[]>(existingCourse?.modules || []);
    const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>(existingCourse?.enrolledStudentIds || []);

    const handleSaveCourse = () => {
        const courseData: Course = {
            id: isEditing ? id! : Date.now().toString(),
            title,
            description,
            instructorId: isEditing ? existingCourse!.instructorId : currentUser!.id,
            status: status,
            modules,
            enrolledStudentIds: enrolledStudentIds
        };

        if (isEditing) {
            dispatch(updateCourse(courseData));
        } else {
            dispatch(addCourse(courseData));
        }
        navigate('/courses');
    };

    const addModule = () => {
        setModules([...modules, { id: Date.now().toString(), title: '', lessons: [] }]);
    };

    const updateModuleTitle = (index: number, newTitle: string) => {
        const newModules = [...modules];
        newModules[index].title = newTitle;
        setModules(newModules);
    };

    const addLesson = (moduleIndex: number) => {
        const newModules = [...modules];
        newModules[moduleIndex].lessons.push({
            id: Date.now().toString(),
            title: '',
            type: 'text',
            content: ''
        });
        setModules(newModules);
    };

    const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: string) => {
        const newModules = [...modules];
        // @ts-ignore
        newModules[moduleIndex].lessons[lessonIndex][field] = value;
        setModules(newModules);
    };

    const handleToggleStudent = (studentId: string) => {
        setEnrolledStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>{isEditing ? 'Edit Course' : 'Create Course'}</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} sx={{ mb: 2 }} />
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={e => setStatus(e.target.value as 'Pending' | 'Approved')}
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <Typography variant="h5" gutterBottom>Modules</Typography>
            {modules.map((module, mIndex) => (
                <Accordion key={module.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <TextField
                            onClick={e => e.stopPropagation()}
                            value={module.title}
                            placeholder="Module Title"
                            onChange={e => updateModuleTitle(mIndex, e.target.value)}
                            size="small"
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {module.lessons.map((lesson, lIndex) => (
                                <ListItem key={lesson.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', border: '1px solid #eee', mb: 1, p: 2 }}>
                                    <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                                        <TextField
                                            label="Lesson Title"
                                            placeholder="Lesson Title"
                                            size="small"
                                            value={lesson.title}
                                            onChange={e => updateLesson(mIndex, lIndex, 'title', e.target.value)}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <FormControl size="small" sx={{ width: 100 }}>
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={lesson.type}
                                                label="Type"
                                                onChange={e => updateLesson(mIndex, lIndex, 'type', e.target.value)}
                                            >
                                                <MenuItem value="text">Text</MenuItem>
                                                <MenuItem value="video">Video</MenuItem>
                                                <MenuItem value="quiz">Quiz</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <TextField
                                        label="Content/URL"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={lesson.content}
                                        onChange={e => updateLesson(mIndex, lIndex, 'content', e.target.value)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Button startIcon={<AddIcon />} onClick={() => addLesson(mIndex)}>Add Lesson</Button>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addModule} sx={{ mt: 2, mb: 4 }}>Add Module</Button>

            <Typography variant="h5" gutterBottom>Assign Students</Typography>
            <Paper sx={{ p: 2, mb: 3, maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                    {students.map((student) => {
                        const isEnrolled = enrolledStudentIds.includes(student.id);
                        return (
                            <ListItem key={student.id} disablePadding>
                                <ListItemButton role={undefined} onClick={() => handleToggleStudent(student.id)} dense>
                                    <Checkbox
                                        edge="start"
                                        checked={isEnrolled}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText primary={student.name} secondary={student.email} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                    {students.length === 0 && <Typography variant="body2" color="textSecondary">No students found.</Typography>}
                </List>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={() => navigate('/courses')}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveCourse}>Save Course</Button>
            </Box>
        </Container>
    );
};

export default CourseEditor;
