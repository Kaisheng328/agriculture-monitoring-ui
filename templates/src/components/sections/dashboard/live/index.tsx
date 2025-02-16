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
    const fetchData = async () => {
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const historyData = await response.json();
        if (historyData && historyData.length > 0) {
          const newestData = historyData.reduce((latest: typeof historyData[0], current: typeof historyData[0]) => {
            return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
          }, historyData[0]);
        
          setRealTimeData(newestData);
        } else {
          throw new Error('No data found in history response.');
        }
      } catch (err) {
        setError(error)
      } finally {
        setLoading(false);
      }
    };
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Typography variant="body1" align="center" mt={2}>
        Loading real-time data...
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
    <Paper sx={{ px: 0, height: 250 }}>
      <Stack mt={-0.5} px={3.75} alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.secondary" zIndex={1000}>
          Real-Time Data
        </Typography>

        <ActionMenu actions={actions} />
      </Stack>

      {realTimeData && (
        <RealTimeData
          data={realTimeData}
          sx={{ mt: 2, mx: 'auto', width: 'auto', maxWidth: 600 }}
        />
      )}
    </Paper>
  );
};

export default RealTime;