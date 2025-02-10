import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Notification {
    timestamp: string;
    type: string;
  }

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/abnormal-history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? ( // Check if there are no notifications
        <Typography variant="body2" color="textSecondary">
          No notifications available.
        </Typography>
      ) : (
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`Abnormal ${notification.type}`}
              secondary={`Time: ${new Date(notification.timestamp).toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' })}`}
            />
          </ListItem>
        ))}
      </List>
      )}
    </Box>
  );
};

export default Notification;
