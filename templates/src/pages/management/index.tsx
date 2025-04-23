
import { Box, Typography, Grid } from '@mui/material';
import Management from 'components/sections/management/index';
import AdminPromotionButton from './custombutton';

const ManagementPage = () => {
  return (
    <Box p={3}>
      <Grid container px={1.75} spacing={2.75}>
        <Typography variant="h5" gutterBottom>
          Management
        </Typography>
        <Grid item xs={12}>
          <AdminPromotionButton />
        </Grid>
        <Grid item xs={12}>
          <Management />
        </Grid>
      </Grid>    
    </Box>

  );
};

export default ManagementPage;