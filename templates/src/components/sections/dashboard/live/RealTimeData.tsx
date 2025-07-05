import { Typography, Box, SxProps } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';

interface RealTimeDataProps {
  data: {
    timestamp: string;
    temperature: number;
    humidity: number;
    soil_moisture: number;
    is_abnormal: boolean;
  };
  sx?: SxProps;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.spacing(1),
}));

const RealTimeData = ({ data}: RealTimeDataProps) => {

  return (
    <Box sx={{ p:4 }}>
    <Grid container spacing={15}>
      {/* Temperature Box */}
      <Grid item xs={12} md={4}>
        <Item>
          <Typography variant="h6" color="text.secondary">
            Temperature
          </Typography>
          <Typography variant="h4" color="secondary">
            {data.temperature} °C
          </Typography>
        </Item>
      </Grid>

      {/* Humidity Box */}
      <Grid item xs={12} md={4}>
        <Item>
          <Typography variant="h6" color="text.secondary">
            Humidity
          </Typography>
          <Typography variant="h4" color="warning.main">
            {data.humidity} %
          </Typography>
        </Item>
      </Grid>

      {/* Soil Moisture Box */}
      <Grid item xs={12} md={4}>
        <Item>
          <Typography variant="h6" color="text.secondary">
            Soil Moisture
          </Typography>
          <Typography variant="h4" color="red.main">
            {data.soil_moisture} %
          </Typography>
        </Item>
      </Grid>
    </Grid>

    {/* Last Updated */}
    <Typography
      variant="caption"
      display="block"
      textAlign="center"
      color="text.secondary"
      sx={{ mt: 'auto' }}
    >
    Last Updated: {new Date(data.timestamp).toLocaleString('en-MY', { 
  timeZone: 'Asia/Kuala_Lumpur',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})}
    </Typography>
  </Box>
  );
};

export default RealTimeData;
