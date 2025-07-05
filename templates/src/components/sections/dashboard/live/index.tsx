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
  const [error, setError] = useState<string | null>(null); // Added type for error state

  // Fetch initial historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch(`${import.meta.env.VITE_API_URL}/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const historyData = await response.json();

        if (historyData && historyData.length > 0) {
          setRealTimeData(historyData[0]);
        }

      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); // Empty dependency array: runs only on mount

  // WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const wsUrl = `${import.meta.env.VITE_API_WS_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");

      setLoading(false);
      setError(null);
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        const raw = JSON.parse(event.data);

        // If it's a notification (with a `data` field), use the actual sensor data inside
        const messageData = raw.data ? raw.data : raw;

        // Now we have a clean SensorData object regardless of wrapping
        setRealTimeData(messageData);
        setError(null);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };


    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("WebSocket connection error. Please try refreshing.");
      setLoading(false); // Stop loading on error
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      if (!event.wasClean) {
        setError("WebSocket connection closed. Attempting to reconnect...");
      }
      setLoading(false); 
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, "Component unmounting");
        console.log("WebSocket connection closed on component unmount");
      }
    };
  }, []); // Empty dependency array: runs only on mount and unmount for WebSocket

  // Conditional rendering based on loading, error, and data states
  let content;
  if (loading) {
    content = (
      <Typography variant="body1" align="center" mt={2}>
        Loading initial data and connecting to real-time service...
      </Typography>
    );
  } else if (error) {
    content = (
      <Typography variant="body1" color="error" align="center" mt={2}>
        Error: {error}
        {realTimeData && <Typography variant="caption" display="block">(showing last known data)</Typography>}
      </Typography>
    );
  } else if (!realTimeData) {
    content = (
      <Typography variant="body2" align="center" mt={2}>
        Waiting for data...
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

      {/* Render RealTimeData if data exists, even if there was an error (to show stale data) */}
      {realTimeData && (
        <RealTimeData
          data={realTimeData} // data prop expects a single object, not an array
          sx={{ mt: 2, mx: 'auto', width: 'auto', maxWidth: 600 }}
        />
      )}
      {/* Display loading/error/waiting messages if no data is available to render */}
      {!realTimeData && content}
      {/* If there's an error but we have stale data, the error message is shown above by 'content' variable logic */}
    </Paper>
  );
};

export default RealTime;