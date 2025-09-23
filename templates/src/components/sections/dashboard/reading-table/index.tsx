import { useRef, useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Stack,
  Paper,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import DataTable from './DataTable';
import ActionModal from 'components/common/ActionModal';

interface DataTableRef {
  fetchData: () => void;
}

type ModalView = 'initial' | 'selectPlant' | 'training' | 'results';

interface Model {
  plant_name: string;
}

interface ModelMetrics {
  MAE: number;
  MSE: number;
  RMSE: number;
  "R²": number;
}

// Next, define the interface for the 'all_results' object.
interface AllResults {
  "Tuned Gradient Boosting": ModelMetrics;
  "Tuned Random Forest": ModelMetrics;
  [key: string]: ModelMetrics;
  // You could add other model types here if they exist
}

// Then, the interface for the 'training_data' object.
interface TrainingData {
  success: boolean;
  message: string;
  model_path: string;
  r2_score: number;
  rmse: number;
  mae: number;
  best_model: string;
  training_time: string;
  training_duration_seconds: number;
  created_at: string;
  completed_at: string;
  created_readable: string;
  data_points: number;
  original_data_points: number;
  all_results: AllResults;
}

// Finally, the top-level interface for the entire response.
interface TrainingResult {
  message: string;
  plant_name: string;
  training_data: TrainingData;
}

const History = () => {
  const [searchText, setSearchText] = useState('');
  const dataTableRef = useRef<DataTableRef | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('initial');
  const [plants, setPlants] = useState<string[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modalView === 'selectPlant') {
      fetchPlants();
    }
  }, [modalView]);

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/models`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch plants.');
      const data = await response.json();
      const plantNames = [...new Set(data.models.map((model: Model) => model.plant_name))];
      setPlants(plantNames as string[]);
    } catch (err: unknown) {
      setError('Failed to fetch plants.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSyncClick = () => {
    if (dataTableRef.current) dataTableRef.current.fetchData();
  };

  const handleFetchData = () => {
    if (dataTableRef.current) dataTableRef.current.fetchData();
  };

  const handleDownloadCsv = () => {
    const downloadUrl = `${import.meta.env.VITE_API_URL}/download-csv`;
    const token = localStorage.getItem("token");
    fetch(downloadUrl, {
      method: "GET",
      headers: {
        "Content-Type": "text/csv",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sensor_data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Download failed:", error));
    closeModal();
  };

  const handleTrainModelClick = () => {
    setModalView('selectPlant');
  };

  const handlePlantSelection = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPlant(event.target.value);
  };

  const handleStartTraining = async () => {
    setModalView('training');
    setError(null);
    setTrainingResult(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/train-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ plant_name: selectedPlant }),
      });
      if (!response.ok) throw new Error('Failed to train model.');
      const result = await response.json();
      setTrainingResult(result);
      setModalView('results');
    } catch (err: unknown) {
      setError('Request failed. Please try again.');
      setModalView('selectPlant');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalView('initial');
    setError(null);
    setSelectedPlant('');
    setTrainingResult(null);
  };

  const renderModalContent = () => {
    switch (modalView) {
      case 'initial':
        return (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleTrainModelClick}>Train Model</Button>
            <Button variant="contained" onClick={handleDownloadCsv}>Download CSV</Button>
          </Stack>
        );
      case 'selectPlant':
        return (
          <Box>
            {error && <Alert severity="error">{error}</Alert>}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Select a plant to train</FormLabel>
              <RadioGroup value={selectedPlant} onChange={handlePlantSelection}>
                {plants.map((plant) => (
                  <FormControlLabel key={plant} value={plant} control={<Radio />} label={plant} />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartTraining}
              disabled={!selectedPlant}
              sx={{ mt: 2 }}
            >
              Start Training
            </Button>
          </Box>
        );
      case 'training':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Training model, please wait...</Typography>
          </Box>
        );
      case 'results':
        return (
          <Box sx={{ mt: 2 }}>
            {trainingResult && trainingResult.training_data.success ? (
              <>
                <Typography variant="h6">Training Results for {trainingResult.plant_name}</Typography>
                <Typography variant="body1" color="success.main">
                  Status: Training Successful
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  {trainingResult.training_data.message}
                </Typography>

                <Typography variant="h6">Best Model: {trainingResult.training_data.best_model}</Typography>
                <Box sx={{ pl: 2 }}>
                  {/* You need to dynamically get the best model's metrics */}
                  <Typography>
                    MAE: {trainingResult.training_data.all_results[trainingResult.training_data.best_model]?.MAE.toFixed(4)}
                  </Typography>
                  <Typography>
                    R²: {trainingResult.training_data.all_results[trainingResult.training_data.best_model]?.['R²'].toFixed(4)}
                  </Typography>
                  <Typography>
                    RMSE: {trainingResult.training_data.all_results[trainingResult.training_data.best_model]?.RMSE.toFixed(4)}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Training Duration: {trainingResult.training_data.training_time}
                </Typography>
                <Typography variant="subtitle1">
                  Data Points Used: {trainingResult.training_data.data_points}
                </Typography>

                <Button variant="contained" onClick={closeModal} sx={{ mt: 3 }}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Training Status</Typography>
                <Typography color="error.main" sx={{ mt: 1 }}>
                  Status: Training Failed
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Message: {trainingResult?.training_data.message || 'An unexpected error occurred.'}
                </Typography>
                <Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
                  Close
                </Button>
              </>
            )}
          </Box>
        );
    }
  };

  return (
    <Paper sx={{ height: 'auto', overflow: 'hidden' }}>
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
          <Button variant="contained" onClick={handleSyncClick}>Sync</Button>
          <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>Train</Button>
        </Stack>
      </Stack>

      <Box mt={{ xs: 1.5, sm: 0.75 }} flex={1}>
        <DataTable ref={dataTableRef} searchText={searchText} onFetchData={handleFetchData} />
      </Box>

      <ActionModal
        open={isModalOpen}
        onClose={closeModal}
        title="Choose an action"
      >
        {renderModalContent()}
      </ActionModal>
    </Paper>
  );
};

export default History;
