import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
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
// import LanguageSelect from './LanguageSelect';
import Logo from 'assets/images/Logo.png';
import React, { useEffect, useState } from 'react';
import paths from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import PlantSelection from "./PlantSelection";
import hebeImg from "assets/images/hebeimg.jpeg"; // Example plant images
import basilImg from "assets/images/Logo.png"; 
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
  const [abnormalCount, setAbnormalCount] = useState(0); // Total abnormal notifications
  const [unseenCount, setUnseenCount] = useState(0); // Badge content for unseen notifications
  const [openPlantModal, setOpenPlantModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string>("Hebe andersonii");
  const navigate = useNavigate();

  const fetchAbnormalCount = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch(`${import.meta.env.VITE_API_URL}/abnormal-count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
      if (!response.ok) {
        throw new Error('Failed to fetch abnormal count');
      }
      const data = await response.json();
      setAbnormalCount(data.count);

      // Update unseen notifications if new ones exist
      setUnseenCount((prevUnseen) => {
        const newNotifications = data.count - (abnormalCount - prevUnseen); // Calculate new unseen count
        return newNotifications >= 0 ? newNotifications : 0;
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAbnormalCount(); // Initial fetch
    const intervalId = setInterval(fetchAbnormalCount, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, [abnormalCount]); // Depend on abnormalCount to keep fetching dynamically

  const handleDrawerExpand = () => {
    setExpand(!expand);
  };

  const handleMobileOpen = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = () => {
    setUnseenCount(0); // Reset badge content for unseen notifications
    navigate(paths.notification); // Navigate to the notifications page
  };
  const handlePlantSelect = (plant: string | null) => {
    if (plant) {
      setSelectedPlant(plant);
      localStorage.setItem("selectedPlant", plant); // Store plant in localStorage
    }
    setOpenPlantModal(false); // Close the pop-up after selection
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

        <Stack spacing={{ xs: 1, sm: 2 }} alignItems="center">
        <IconButton onClick={() => setOpenPlantModal(true)} sx={{ ml: 2 }}>
          <Avatar src={plantImages[selectedPlant]} sx={{ width: 48, height: 48 }} />
        </IconButton>

        {/* Plant Selection Pop-up */}
        <Dialog open={openPlantModal} onClose={() => setOpenPlantModal(false)}>
          <PlantSelection open={openPlantModal} onClose={handlePlantSelect} />
        </Dialog>
          {/* <LanguageSelect /> */}
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
