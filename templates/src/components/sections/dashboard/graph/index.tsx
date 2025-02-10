import { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography, Stack, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MetricGraph from './metricGraph';
import CombinedGraph from './combinedGraph';

const LineGraph = () => {
  const [historyData, setHistoryData] = useState<
    { timestamp: string; temperature: number; humidity: number; soil_moisture: number; is_abnormal: boolean}[]
  >([]);
  const [filteredData, setFilteredData] = useState(historyData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setHistoryData(data.reverse());
      setError(null);
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const filtered = historyData.filter((item) => {
        const itemDate = new Date(item.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' });
        const selectedDateString = selectedDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
        return itemDate === selectedDateString;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(historyData);
    }
  }, [selectedDate, historyData]);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleSyncClick = () => {
    fetchHistoryData();
  };

  if (loading) {
    return (
      <Typography variant="body1" align="center" mt={2}>
        Loading data...
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
      <Stack mt={-0.5} px={3.75} alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.secondary" zIndex={1000}>
          Line Graph
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                },
              }}
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={handleSyncClick}>
            Sync
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Temperature Graph */}
          <Grid item xs={12} md={4}>
            <MetricGraph
              title="Temperature"
              data={filteredData.map((item) => ({
                timestamp: new Date(item.timestamp).toLocaleString(),
                value: item.temperature,
              }))}
              color="#ff7043"
            />
          </Grid>

          {/* Humidity Graph */}
          <Grid item xs={12} md={4}>
            <MetricGraph
              title="Humidity"
              data={filteredData.map((item) => ({
                timestamp: new Date(item.timestamp).toLocaleString(),
                value: item.humidity,
              }))}
              color="#42a5f5"
            />
          </Grid>

          {/* Soil Moisture Graph */}
          <Grid item xs={12} md={4}>
            <MetricGraph
              title="Soil Moisture"
              data={filteredData.map((item) => ({
                timestamp: new Date(item.timestamp).toLocaleString(),
                value: item.soil_moisture,
              }))}
              color="#66bb6a"
            />
          </Grid>

          {/* Combined Graph */}
          <Grid item xs={12}>
            <CombinedGraph data={filteredData} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default LineGraph;
