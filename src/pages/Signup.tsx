import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signup, clearError } from '../features/auth/authSlice';
import type { RootState } from '../app/store';
import { Container, Box, Typography, TextField, Button, Alert, MenuItem, Link, Paper } from '@mui/material';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Admin' | 'Instructor' | 'Student'>('Student');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state: RootState) => state.auth.error);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signup({
            id: '', // Generated in slice
            name,
            email,
            role,
            password,
            avatar: `https://i.pravatar.cc/150?u=${email}`
        }));
        if (!error) {
            navigate('/login');
        }
    };

    React.useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', width: '100%' }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        select
                        margin="normal"
                        required
                        fullWidth
                        id="role"
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Instructor">Instructor</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                    </TextField>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;
