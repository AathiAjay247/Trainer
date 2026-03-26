import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { addUser, updateUser, deleteUser, syncUsers } from '../features/users/userSlice';
import type { User } from '../features/auth/authSlice';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminUsers: React.FC = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.list);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        name: '', email: '', role: 'Student', password: ''
    });

    useEffect(() => {
        dispatch(syncUsers());
    }, [dispatch]);

    const handleOpen = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData(user);
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'Student', password: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = () => {
        if (editingUser) {
            dispatch(updateUser({ ...editingUser, ...formData } as User));
        } else {
            dispatch(addUser({
                id: Date.now().toString(),
                avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
                ...formData
            } as User));
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>User Management</Typography>
            <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add User</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(user)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Name" fullWidth
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense" label="Email" fullWidth
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        select margin="dense" label="Role" fullWidth
                        value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Instructor">Instructor</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense" label="Password" fullWidth
                        value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
