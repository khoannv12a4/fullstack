'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { useCreateUser } from '@/hooks/useUsers';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ open, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    profile: {
      firstName: '',
      lastName: '',
    },
  });

  const createUserMutation = useCreateUser();

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('profile.')) {
      const profileField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'user',
          profile: {
            firstName: '',
            lastName: '',
          },
        });
        onClose();
      },
    });
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      profile: {
        firstName: '',
        lastName: '',
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.profile.firstName}
                onChange={(e) => handleInputChange('profile.firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.profile.lastName}
                onChange={(e) => handleInputChange('profile.lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}