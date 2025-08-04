import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Alert } from '@mui/material';

interface Model {
  created_at: string;
  created_readable: string;
  data_points_used: number;
  model_type: string;
  performance: {
    MAE: number;
    MSE: number;
    RMSE: number;
    'R²': number;
  };
  plant_name: string;
  training_date: string;
  training_duration: string;
}

const AiModelDetailsPage = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/models`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch model details.');
        }

        const data = await response.json();
        setModels(data.models);
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        AI Model Details
      </Typography>
      {models.map((model, index) => (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }} key={index}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">{model.plant_name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Model Type</Typography>
              <Typography variant="body1">{model.model_type}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Training Date</Typography>
              <Typography variant="body1">{model.created_readable}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Data Points Used</Typography>
              <Typography variant="body1">{model.data_points_used}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Training Duration</Typography>
              <Typography variant="body1">{model.training_duration}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Performance</Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body1">MAE: {model.performance.MAE.toFixed(4)}</Typography>
                <Typography variant="body1">MSE: {model.performance.MSE.toFixed(4)}</Typography>
                <Typography variant="body1">RMSE: {model.performance.RMSE.toFixed(4)}</Typography>
                <Typography variant="body1">R²: {model.performance['R²'].toFixed(4)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default AiModelDetailsPage;
