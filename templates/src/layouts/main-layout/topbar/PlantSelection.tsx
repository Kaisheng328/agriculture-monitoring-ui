import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  Typography,
  Box
} from "@mui/material";
import { useState } from 'react';

const plants = ["Hebe andersonii", "Basil", "Aloe Vera", "Snake Plant", "Rosemary"];

interface PlantSelectionProps {
  open: boolean;
  onClose: (selectedPlant: string | null, aiEnabled?: boolean) => void;
}

const PlantSelection = ({ open, onClose }: PlantSelectionProps) => {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const handleSelectPlant = (plant: string) => {
    setSelectedPlant(plant);
  };

  const handleConfirm = () => {
    if (selectedPlant) {
      onClose(selectedPlant, aiEnabled);
    }
  };

  const handleCancel = () => {
    setAiEnabled(false);
    setSelectedPlant(null);
    onClose(null);
  };

  const toggleAI = () => {
    setAiEnabled(!aiEnabled);
  };

  // Don't render anything if dialog is not open
  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      aria-labelledby="plant-selection-dialog-title"
      // Make sure focus is properly trapped within the dialog
      disableEnforceFocus={false}
      // Proper focus management
      autoFocus
      // Ensure accessibility
      aria-modal="true"
      role="dialog"
    >
      <DialogTitle id="plant-selection-dialog-title">Select Your Plant</DialogTitle>
      <DialogContent>
        <List>
          {plants.map((plant) => (
            <ListItem key={plant} disablePadding>
              <ListItemButton 
                onClick={() => handleSelectPlant(plant)}
                selected={selectedPlant === plant}
              >
                <ListItemText primary={plant} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        {selectedPlant && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                sx={{ 
                  mr: 1, 
                  fontWeight: 'bold', 
                  color: aiEnabled ? 'primary.main' : 'text.disabled'
                }}
                component="span"
              >
                AI
              </Typography>
              <Typography component="span">Enable AI for {selectedPlant}</Typography>
            </Box>
            <Switch
              checked={aiEnabled}
              onChange={toggleAI}
              inputProps={{ 
                'aria-label': `Enable AI for ${selectedPlant}`,
                'aria-checked': aiEnabled
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedPlant}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlantSelection;