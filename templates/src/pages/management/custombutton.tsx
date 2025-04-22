import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// Define interface for user data
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminManagementButtons = () => {
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [demoteOpen, setDemoteOpen] = useState(false);
  const [regularUsers, setRegularUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  useEffect(() => {
    // Check if current user is admin
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // First get the user ID from profile endpoint
        const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`HTTP error! Status: ${profileResponse.status}`);
        }

        const userId = await profileResponse.json();
        
        // Then get all users to find the current user's role
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error(`HTTP error! Status: ${usersResponse.status}`);
        }

        const allUsers = await usersResponse.json() as User[];
        
        // Find the current user and check if they're an admin
        const currentUser = allUsers.find(user => user.id === userId);
        if (currentUser) {
          setIsAdmin(currentUser.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkUserRole();
  }, []);

  const handlePromoteOpen = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json() as User[];
      // Filter out users who are already admins
      setRegularUsers(userData.filter(user => user.role !== 'admin'));
      setPromoteOpen(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error'
      });
    }
  };

  const handleDemoteOpen = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json() as User[];
      
      // Get the current user's ID
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!profileResponse.ok) {
        throw new Error(`HTTP error! Status: ${profileResponse.status}`);
      }
      
      const currentUserId = await profileResponse.json();
      
      // Filter to only include admins, excluding the current user
      setAdminUsers(userData.filter(user => user.role === 'admin' && user.id !== currentUserId));
      setDemoteOpen(true);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch admin users',
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setPromoteOpen(false);
    setDemoteOpen(false);
  };

  const promoteUser = async (email: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/promote-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      setSnackbar({
        open: true,
        message: `Successfully promoted ${email} to admin`,
        severity: 'success'
      });
      // Remove the promoted user from the list
      setRegularUsers(regularUsers.filter(user => user.email !== email));
    } catch (error) {
      console.error('Error promoting user:', error);
      setSnackbar({
        open: true,
        message: `Failed to promote user: ${'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const demoteUser = async (email: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/promote-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      setSnackbar({
        open: true,
        message: `Successfully demoted ${email} to regular user`,
        severity: 'success'
      });
      // Remove the demoted user from the list
      setAdminUsers(adminUsers.filter(user => user.email !== email));
    } catch (error) {
      console.error('Error demoting user:', error);
      setSnackbar({
        open: true,
        message: `Failed to demote user: ${'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Only render the buttons if the user is an admin
  if (!isAdmin) return null;

  return (
    <Box mt={2} mb={3}>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePromoteOpen}
        >
          Promote User to Admin
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleDemoteOpen}
        >
          Demote Admin to User
        </Button>
      </Stack>

      {/* Promote Dialog */}
      <Dialog open={promoteOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Select User to Promote to Admin</DialogTitle>
        <DialogContent>
          {regularUsers.length > 0 ? (
            <List>
              {regularUsers.map((user) => (
                <ListItem 
                  key={user.id} 
                  divider
                  onClick={() => promoteUser(user.email)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText 
                    primary={user.username || user.email} 
                    secondary={user.email} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No eligible users found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Demote Dialog */}
      <Dialog open={demoteOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Select Admin to Demote to Regular User</DialogTitle>
        <DialogContent>
          {adminUsers.length > 0 ? (
            <List>
              {adminUsers.map((user) => (
                <ListItem 
                  key={user.id} 
                  divider
                  onClick={() => demoteUser(user.email)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText 
                    primary={user.username || user.email} 
                    secondary={user.email} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No other admin users found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminManagementButtons;