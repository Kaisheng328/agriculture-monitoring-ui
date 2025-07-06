import { useEffect, useRef, useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import ManagementTable from './management';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface DataTableRef {
  fetchData: () => void;
}

interface User {
  id: number;
  username: string;
  role: string;
}

const History = () => {
  const [searchText, setSearchText] = useState('');
  const dataTableRef = useRef<DataTableRef | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // For loading state of delete actions
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFetchData = () => {
    if (dataTableRef.current) {
      dataTableRef.current.fetchData();
    }
  };

  const handleSyncClick = () => {
    if (dataTableRef.current) {
      dataTableRef.current.fetchData();
    }
  };

  // Fetch role + users if admin
  useEffect(() => {
    const fetchRoleAndUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const profile = await profileRes.json();
        localStorage.setItem("user_role", profile.role);
        setIsAdmin(profile.role === 'admin');

        if (profile.role === 'admin') {
          const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (err) {
        console.error("Failed to fetch profile or users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndUsers();
  }, []);

  const handleDeleteMyRecords = async () => {
    if (!window.confirm("Are you sure you want to delete all your records? This action cannot be undone.")) {
      return;
    }
    setActionLoading(true);
    setFeedbackMessage(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delete/my-records`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage({ type: 'success', message: data.message || "Successfully deleted your records." });
        handleFetchData(); // Refresh data
      } else {
        setFeedbackMessage({ type: 'error', message: data.error || "Failed to delete records." });
      }
    } catch (error) {
      console.error("Delete My Records error:", error);
      setFeedbackMessage({ type: 'error', message: "An unexpected error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUserAccount = async (userIdToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${userIdToDelete} and all their records? This action cannot be undone.`)) {
      return;
    }
    setActionLoading(true);
    setFeedbackMessage(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/delete-user/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage({ type: 'success', message: data.message || `Successfully deleted user ${userIdToDelete}.` });
        // Refresh user list and potentially current user's data if they deleted themselves (though backend prevents this)
        const updatedUsers = users.filter(user => user.id.toString() !== userIdToDelete);
        setUsers(updatedUsers);
        // Potentially refresh all data tables if needed, or specific ones
        handleFetchData(); 
      } else {
        setFeedbackMessage({ type: 'error', message: data.error || "Failed to delete user account." });
      }
    } catch (error) {
      console.error("Delete User Account error:", error);
      setFeedbackMessage({ type: 'error', message: "An unexpected error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: 'auto', overflow: 'hidden' }}>
    <Box sx={{ px: 'auto' }}>
      {feedbackMessage && (
        <Typography color={feedbackMessage.type === 'success' ? 'green' : 'error'} sx={{ mb: 2 }}>
          {feedbackMessage.message}
        </Typography>
      )}
      {actionLoading && <CircularProgress size={24} sx={{ mb: 2 }} />}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        mt={-0.5}
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" color="text.secondary">
          Sensor Reading Table
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" color="error" onClick={() => handleDeleteMyRecords()} sx={{ mr: 1 }}>
            Delete My Records
          </Button>
          <TextField
            variant="filled"
            size="small"
            placeholder="Search here"
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 1, maxWidth: { xs: 260, sm: 240 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="prime:search" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSyncClick}>
            Sync
          </Button>
        </Stack>
      </Stack>

      <Box mt={{ xs: 1.5, sm: 0.75 }} flex={1}>
        {isAdmin ? (
          users.map((user) => (
            <Paper key={user.id} variant="outlined" sx={{ p: 2, mb: 4, borderColor: 'black', borderWidth: 5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {`User ${user.id} - ${user.username}`}
                </Typography>
                <Button variant="contained" color="error"
                  onClick={() => handleDeleteUserAccount(user.id.toString())} // Convert user.id to string
                >
                  Delete User Account
                </Button>
              </Stack>
              <ManagementTable
                searchText={searchText}
                onFetchData={handleFetchData}
                userId={user.id}
                title={`User ${user.id}`}
              />
            </Paper>
          ))
        ) : (
          <Box height={800}>
            <ManagementTable
              ref={dataTableRef}
              searchText={searchText}
              onFetchData={handleFetchData}
            />
          </Box>
        )}
      </Box>
    </Box>
    </Paper>
  );
};

export default History;
