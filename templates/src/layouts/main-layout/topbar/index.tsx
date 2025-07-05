import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; // Import Button
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProfileMenu from './ProfileMenu';
import { useViewMode } from 'contexts/ViewModeContext'; // Import useViewMode
import Logo from 'assets/images/Logo.png';
import React, { useEffect, useState } from 'react';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import PlantSelection from "./PlantSelection";
import hebeImg from "assets/images/hebeimg.jpeg";
import basilImg from "assets/images/Logo.png";
import Chip from "@mui/material/Chip";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

interface TopbarProps {
  expand: boolean;
  mobileOpen: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  drawerWidth: number;
  miniDrawerWidth: number;
}

const plantImages: Record<string, string> = {
  "Hebe andersonii": hebeImg,
  "Basil": basilImg,
};

const Topbar = ({
  expand,
  mobileOpen,
  setExpand,
  setMobileOpen,
  drawerWidth,
  miniDrawerWidth,
}: TopbarProps) => {
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [openPlantModal, setOpenPlantModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string>("Hebe andersonii");
  const [aiEnabled, setAiEnabled] = useState<boolean>(false); // Add state for AI enabled
  const navigate = useNavigate();
  const { isDeveloperMode, toggleViewMode } = useViewMode(); // Consume context
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogContent, setConfirmationDialogContent] = useState({ title: "", message: "", onConfirm: () => { } });
  // const [abnormalCountError, setAbnormalCountError] = useState<string | null>(null); // Optional: to display WS errors

  // WebSocket for abnormal count
  useEffect(() => {
    const token = localStorage.getItem("token");
    const wsUrl = `${import.meta.env.VITE_API_WS_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Abnormal count WebSocket connection established");
      // setAbnormalCountError(null);
    };

    socket.onmessage = (event) => {
      console.log("Abnormal count WebSocket message received:", event.data);
      try {
        const messageData = JSON.parse(event.data);

        if (typeof messageData.abnormal_count === 'number') {
          const newAbnormalCount = messageData.abnormal_count;

          // Update unseenCount based on the difference between new and current abnormalCount
          // 'abnormalCount' state variable holds the value *before* this message's update here.
          setUnseenCount(prevUnseen => {
            if (newAbnormalCount > abnormalCount) { 
              // If the new total is greater, add the difference to unseen
              return prevUnseen + (newAbnormalCount - abnormalCount);
            }
            // Optional: If newAbnormalCount < abnormalCount, some abnormals were resolved.
            // You might want to decrease prevUnseen, but carefully.
            // For now, unseen count only increases or stays the same if total decreases/stagnates.
            // Consider if clicking the notification bell (which sets unseenCount to 0)
            // is the only way unseenCount should decrease.
            return prevUnseen;
          });

          setAbnormalCount(newAbnormalCount); // Update the total abnormal count state

        } else if (messageData.type === "sensor_data" && typeof messageData.is_abnormal === 'boolean') {
          // Alternative: If the WS sends every sensor reading, and we need to count them.
          // This would be more complex as Topbar would need to know which device/plant it's for
          // and potentially maintain a list of all abnormal items to get a "count".
          // This is NOT implemented here and relies on the `abnormal_count` field above.
          // console.log("Received individual sensor data, but Topbar expects aggregated abnormal_count.");
        }

      } catch (e) {
        console.error("Error parsing abnormal count WebSocket message:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("Abnormal count WebSocket error:", err);
      // setAbnormalCountError("WebSocket connection error for abnormal counts.");
    };

    socket.onclose = (event) => {
      console.log("Abnormal count WebSocket connection closed:", event.code, event.reason);
      // Potentially implement reconnection logic here
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, "Component unmounting abnormal count WebSocket");
        console.log("Abnormal count WebSocket closed on component unmount");
      }
    };
  }, []); // Empty dependency array: runs only on mount for WebSocket

  const handleDrawerExpand = () => {
    setExpand(!expand);
  };

  const handleMobileOpen = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = () => {
    setUnseenCount(0);
    navigate(paths.notification);
  };

  const handlePlantSelect = (plant: string | null, aiEnabled?: boolean) => {
    if (plant) {
      setSelectedPlant(plant);
      localStorage.setItem("selectedPlant", plant);

      // Set the AI enabled state
      setAiEnabled(aiEnabled || false);
      localStorage.setItem("aiEnabled", aiEnabled ? "true" : "false");
    }
    setOpenPlantModal(false);
  };

  // Load AI enabled state on component mount
  useEffect(() => {
    const savedAiState = localStorage.getItem("aiEnabled");
    if (savedAiState) {
      setAiEnabled(savedAiState === "true");
    }
  }, []);

  const handleToggleDeveloperMode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found.");
      // Handle missing token, e.g., redirect to login
      return;
    }

    if (!isDeveloperMode) {
      // Switching to Developer View
      setConfirmationDialogContent({
        title: "Enable Developer Mode?",
        message: "This will trigger the ESP32 into developer mode for data collection. Do you want to continue?",
        onConfirm: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/device-config/esp32-001/trigger-dev`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error('Failed to trigger developer mode.');
            }
            const disableAIRes = await fetch(`${import.meta.env.VITE_API_URL}/toggle-ai`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                enabled: false,
              }),
            });

            if (!disableAIRes.ok) {
              console.warn("AI could not be disabled automatically.");
            } else {
              console.log("AI disabled automatically when Developer Mode enabled.");
            }
            toggleViewMode(); // Actual toggle after successful API call
            console.log("Developer mode triggered");
          } catch (error) {
            console.error("Error triggering developer mode:", error);
            // Optionally, show an error message to the user
          }
          setConfirmationDialogOpen(false);
        },
      });
    } else {
      // Switching to User View
      setConfirmationDialogContent({
        title: "Disable Developer Mode?",
        message: "This will stop developer mode data collection on the ESP32. Do you want to continue?",
        onConfirm: async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/device-config/esp32-001/stop-dev`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error('Failed to stop developer mode.');
            }
            toggleViewMode(); // Actual toggle after successful API call
            console.log("Developer mode stopped");
          } catch (error) {
            console.error("Error stopping developer mode:", error);
            // Optionally, show an error message to the user
          }
          setConfirmationDialogOpen(false);
        },
      });
    }
    setConfirmationDialogOpen(true);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        right: 0,
        width: {
          xs: 1,
          lg: expand ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)`,
        },
      }}
    >
      <Stack px={3} py={2} alignItems="center" justifyContent="space-between">
        <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <ButtonBase
            component={Link}
            href="/"
            disableRipple
            sx={{ lineHeight: 0, display: { xs: 'none', sm: 'block', lg: 'none' } }}
          >
            <Image src={Logo} alt="logo" height={40} width={40} />
          </ButtonBase>

          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="expand drawer"
              onClick={handleDrawerExpand}
              edge="start"
              sx={{ display: { xs: 'none', lg: 'flex' } }}
            >
              <IconifyIcon icon={expand ? 'line-md:menu-fold-left' : 'line-md:menu-fold-right'} />
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="expand drawer"
              onClick={handleMobileOpen}
              edge="start"
              sx={{ display: { xs: 'flex', lg: 'none' } }}
            >
              <IconifyIcon icon="solar:hamburger-menu-outline" />
            </IconButton>
          </Toolbar>

          <Toolbar sx={{ ml: -1.5, display: { xm: 'block', md: 'none' } }}>
            <IconButton edge="start" color="inherit" aria-label="search">
              <IconifyIcon icon="prime:search" />
            </IconButton>
          </Toolbar>

          <TextField
            variant="filled"
            placeholder="Search"
            sx={{ width: 300, display: { xs: 'none', md: 'flex' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="prime:search" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack spacing={{ xs: 1, sm: 2 }} alignItems="center" direction="row">
          {/* AI Indicator Chip - shown when AI is enabled */}
          {aiEnabled && (
            <Chip

              label="AI"
              color="secondary"
              size="small"
              sx={{ mr: 1 }}
            />
          )}

          <IconButton onClick={() => setOpenPlantModal(true)} sx={{ ml: 2 }}>
            <Avatar src={plantImages[selectedPlant]} sx={{ width: 48, height: 48 }} />
          </IconButton>

          <Dialog open={openPlantModal} onClose={() => setOpenPlantModal(false)}>
            <PlantSelection open={openPlantModal} onClose={handlePlantSelect} />
          </Dialog>

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleToggleDeveloperMode} // Updated onClick handler
            sx={{ mr: 1, minWidth: '120px' }}
          >
            {isDeveloperMode ? "Developer View" : "User View"}
          </Button>

          {/* Confirmation Dialog */}
          <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{confirmationDialogContent.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {confirmationDialogContent.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmationDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {
                confirmationDialogContent.onConfirm();
              }} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <IconButton onClick={handleNotificationClick}>
            <Badge
              color="error"
              badgeContent={unseenCount}
              sx={{ '& .MuiBadge-badge': { top: 6, right: 2 } }}
            >
              <IconifyIcon icon="mdi:bell-outline" />
            </Badge>
          </IconButton>
          <ProfileMenu />
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default Topbar;