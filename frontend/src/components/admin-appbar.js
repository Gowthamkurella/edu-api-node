import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, styled } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const UserHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider color
}));

const UserInfo = styled('div')(({ theme }) => ({
  marginLeft: '10px',
  color: theme.palette.text.secondary, // Use theme's secondary text color
}));

const CustomAppBar = ({ username }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
 
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Assuming the logout endpoint and method
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Adjusted for theme: logo placeholder replaced with a textual representation */}
          <Typography variant="h6" noWrap component={Link} to="/admin-dashboard" sx={{ textDecoration: 'none', color: 'inherit' }}>
            EduConnect Admin
          </Typography>
          {/* Other navigation buttons can be added here */}
        </Box>
        <IconButton
          onClick={handleMenu}
          size="large"
          edge="end"
          color="inherit"
        >
          <Avatar alt="Admin" src="/path-to-your-admin-avatar.jpg" /> {/* Update with actual path */}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <UserHeader>
            <Avatar alt="Admin" src="/path-to-your-admin-avatar.jpg" /> {/* Update with actual path */}
            <UserInfo>
              <Typography variant="subtitle1">{username || 'Admin'}</Typography>
              <Typography variant="body2">Administrator</Typography>
            </UserInfo>
          </UserHeader>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;