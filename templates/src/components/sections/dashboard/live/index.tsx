import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ActionMenu from 'components/common/ActionMenu';
import RealTimeData from './RealTimeData';

const actions = [
  {
    id: 1,
    icon: 'mage:refresh',
    title: 'Refresh',
  },
  {
    id: 2,
    icon: 'solar:export-linear',
    title: 'Export',
  },
  {
    id: 3,
    icon: 'mage:share',
    title: 'Share',
  },
];

const RealTime = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual WebSocket server URL
    // You might want to use an environment variable, e.g., import.meta.env.VITE_WS_URL
    const wsUrl = "ws://localhost:8080/ws"; 
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setLoading(false); // Set loading to false once connection is open
                       // Or, you might want to set it to false after the first message
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const messageData = JSON.parse(event.data);
        // Assuming the server sends the data object directly
        // If it's nested, you'll need to adjust e.g., messageData.payload
        setRealTimeData(messageData);
        setError(null); // Clear any previous errors on successful message
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setLoading(false);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      if (!event.wasClean) {
        // setError("WebSocket connection closed unexpectedly. Attempting to reconnect...");
        // You might want to implement reconnection logic here
      }
      // setLoading(false); // Keep loading false or handle appropriately
    };

    // Cleanup on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, "Component unmounting");
        console.log("WebSocket connection closed on component unmount");
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  if (loading) {
    return (
      <Typography variant="body1" align="center" mt={2}>
        Connecting to real-time service...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center" mt={2}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ px: 0, height: 'auto' }}>
      <Stack mt={-0.5} px={3.75} alignItems="center" justifyContent="space-between" direction="row">
        <Typography variant="h6" color="text.secondary" zIndex={1000}>
          Real-Time Data
        </Typography>
        <ActionMenu actions={actions} />
      </Stack>

      {realTimeData ? (
        <RealTimeData
          data={realTimeData}
          sx={{ mt: 2, mx: 'auto', width: 'auto', maxWidth: 600 }}
        />
      ) : (
        !loading && <Typography variant="body2" align="center" mt={2}>Waiting for data...</Typography>
      )}
    </Paper>
  );
};

export default RealTime;