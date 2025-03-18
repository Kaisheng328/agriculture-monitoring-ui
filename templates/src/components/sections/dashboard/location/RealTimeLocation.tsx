import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const DeviceLocation = ({ deviceId }: { deviceId: number }) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/get-location/${deviceId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch location");

        const data = await response.json();
        setLocation(data);
      } catch (err) {
        setError("Failed to retrieve location");
      }
    };

    fetchLocation();
  }, [deviceId]);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : location ? (
        <iframe
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: "12px" }}
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.latitude},${location.longitude}`}
          allowFullScreen
        />
      ) : (
        <Typography>Loading location...</Typography>
      )}
    </Box>
  );
};


export default DeviceLocation;
