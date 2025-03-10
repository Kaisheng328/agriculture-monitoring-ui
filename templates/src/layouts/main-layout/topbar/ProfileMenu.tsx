import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';


interface MenuItems {
  id: number;
  title: string;
  icon: string;
  action?: () => void; // Add action for handling clicks
}

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username and token from localStorage when the component mounts
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    
    setUsername(storedUsername);
    setIsLoggedIn(!!storedToken); // Convert to boolean (true if token exists)
  }, []);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
    navigate('//'); // Redirect to login page
    window.location.reload();
  };
  
  const handleLogin = () => {
    navigate('/auth/signin'); // Redirect to login page
  };

  // Base menu items that are always shown
  const getMenuItems = (): MenuItems[] => {
    const items: MenuItems[] = [
      {
        id: 1,
        title: 'Notifications',
        icon: 'mdi:bell-outline',
      }
    ];

    // Conditionally add login or logout based on authentication status
    if (isLoggedIn) {
      items.push({
        id: 3,
        title: 'Logout',
        icon: 'mdi:logout',
        action: handleLogout
      });
    } else {
      items.push({
        id: 2,
        title: 'Login',
        icon: 'mdi:login',
        action: handleLogin
      });
    }

    return items;
  };

  return (
    <>
      <ButtonBase
        sx={{ ml: 1 }}
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          sx={{
            height: 44,
            width: 44,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
          '& .MuiMenu-paper': { p: '0 !important' },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.main' } }}>
            <Avatar sx={{ mr: 1, height: 42, width: 42 }} />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {username || 'Guest'} {/* Display username or 'Guest' if null */}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {getMenuItems().map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => {
                handleProfileMenuClose();
                if (item.action) item.action(); // Execute the action if available
              }}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {item.title}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;