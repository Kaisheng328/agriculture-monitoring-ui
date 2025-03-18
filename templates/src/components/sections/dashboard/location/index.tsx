
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ActionMenu from "components/common/ActionMenu";
import DeviceLocation from "./RealTimeLocation";

const actions = [
  { id: 1, icon: "mage:refresh", title: "Refresh" },
  { id: 2, icon: "solar:export-linear", title: "Export" },
  { id: 3, icon: "mage:share", title: "Share" },
];

const GoogleMap = () => {
  return (
    <Paper sx={{ px: 3, py: 3, height: "auto", borderRadius: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" color="text.secondary">
          Google Map
        </Typography>

        <ActionMenu actions={actions} />
      </Stack>

      {/* Device Location Component */}
      <DeviceLocation deviceId={3} />
    </Paper>
  );
};

export default GoogleMap;
