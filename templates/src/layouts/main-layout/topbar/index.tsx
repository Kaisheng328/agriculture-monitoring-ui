import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
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
import { useViewMode } from 'contexts/ViewModeContext';
import { useDarkMode } from 'contexts/DarkModeContext';
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
  Box,
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
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isDeveloperMode, toggleViewMode } = useViewMode();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogContent, setConfirmationDialogContent] = useState({ 
    title: "", 
    message: "", 
    onConfirm: () => { } 
  });

  // WebSocket for abnormal count
  useEffect(() => {
    const token = localStorage.getItem("token");
    const wsUrl = `${import.meta.env.VITE_API_WS_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Abnormal count WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("Abnormal count WebSocket message received:", event.data);
      try {
        const messageData = JSON.parse(event.data);

        if (typeof messageData.abnormal_count === 'number') {
          const newAbnormalCount = messageData.abnormal_count;

          setUnseenCount(prevUnseen => {
            if (newAbnormalCount > abnormalCount) { 
              return prevUnseen + (newAbnormalCount - abnormalCount);
            }
            return prevUnseen;
          });

          setAbnormalCount(newAbnormalCount);
        }
      } catch (e) {
        console.error("Error parsing abnormal count WebSocket message:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("Abnormal count WebSocket error:", err);
    };

    socket.onclose = (event) => {
      console.log("Abnormal count WebSocket connection closed:", event.code, event.reason);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, "Component unmounting abnormal count WebSocket");
        console.log("Abnormal count WebSocket closed on component unmount");
      }
    };
  }, []);

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
      setAiEnabled(aiEnabled || false);
      localStorage.setItem("aiEnabled", aiEnabled ? "true" : "false");
    }
    setOpenPlantModal(false);
  };

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
      return;
    }

    if (!isDeveloperMode) {
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
            toggleViewMode();
            console.log("Developer mode triggered");
          } catch (error) {
            console.error("Error triggering developer mode:", error);
          }
          setConfirmationDialogOpen(false);
        },
      });
    } else {
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
            toggleViewMode();
            console.log("Developer mode stopped");
          } catch (error) {
            console.error("Error stopping developer mode:", error);
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
      <Toolbar
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Left Section - Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {/* Desktop menu button */}
          <IconButton
            color="inherit"
            aria-label="expand drawer"
            onClick={handleDrawerExpand}
            edge="start"
            sx={{ 
              display: { xs: 'none', lg: 'flex' },
              mr: 1
            }}
          >
            <IconifyIcon icon={expand ? 'line-md:menu-fold-left' : 'line-md:menu-fold-right'} />
          </IconButton>

          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="expand drawer"
            onClick={handleMobileOpen}
            edge="start"
            sx={{ 
              display: { xs: 'flex', lg: 'none' },
              mr: 1
            }}
          >
            <IconifyIcon icon="solar:hamburger-menu-outline" />
          </IconButton>

          {/* Logo - only show on sm screens */}
          <ButtonBase
            component={Link}
            href="/"
            disableRipple
            sx={{ 
              lineHeight: 0, 
              display: { xs: 'none', sm: 'block', lg: 'none' },
              mr: 2
            }}
          >
            <Image src={Logo} alt="logo" height={40} width={40} />
          </ButtonBase>
        </Box>

        {/* Center Section - Search */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: { xs: 1, sm: 2 } }}>
          {/* Mobile search icon */}
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="search"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <IconifyIcon icon="prime:search" />
          </IconButton>

          {/* Desktop search field */}
          <TextField
            variant="filled"
            placeholder="Search"
            size="small"
            sx={{ 
              width: { md: 250, lg: 300 },
              display: { xs: 'none', md: 'flex' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="prime:search" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right Section - Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: { xs: 0.5, sm: 1 } }}>
          {/* AI Indicator Chip */}
          {aiEnabled && (
            <Chip
              label="AI"
              color="secondary"
              size="small"
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                fontSize: '0.75rem',
                height: 24
              }}
            />
          )}

          {/* Plant Selection Avatar */}
          <IconButton 
            onClick={() => setOpenPlantModal(true)}
            sx={{ p: 0.5 }}
          >
            <Avatar 
              src={plantImages[selectedPlant]} 
              sx={{ 
                width: { xs: 36, sm: 44 }, 
                height: { xs: 36, sm: 44 } 
              }} 
            />
          </IconButton>

          {/* Developer Mode Toggle Button */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleToggleDeveloperMode}
            sx={{
              minWidth: { xs: 50, sm: 100 },
              px: { xs: 0.5, sm: 2 },
              py: { xs: 0.25, sm: 0.5 },
              fontSize: { xs: '0.65rem', sm: '0.875rem' },
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: { xs: 28, sm: 36 },
            }}
          >
            {isDeveloperMode ? "Dev" : "User"}
          </Button>

          {/* Dark Mode Toggle */}
          <IconButton onClick={toggleDarkMode} color="inherit">
            <IconifyIcon icon={isDarkMode ? 'solar:sun-bold' : 'solar:moon-bold'} />
          </IconButton>

          {/* Notification Bell */}
          <IconButton onClick={handleNotificationClick}>
            <Badge
              color="error"
              badgeContent={unseenCount}
              sx={{ '& .MuiBadge-badge': { top: 6, right: 2 } }}
            >
              <IconifyIcon icon="mdi:bell-outline" />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <ProfileMenu />
        </Box>
      </Toolbar>

      {/* Plant Selection Dialog */}
      <Dialog open={openPlantModal} onClose={() => setOpenPlantModal(false)}>
        <PlantSelection open={openPlantModal} onClose={handlePlantSelect} />
      </Dialog>

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
    </AppBar>
  );
};

export default Topbar;