
import { Box, Typography } from '@mui/material';
import Management from 'components/sections/management/index';
import AdminPromotionButton from './custombutton'; 

const ManagementPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Management
      </Typography>
      <AdminPromotionButton />
      <div>
        <Management />
      </div>
    </Box>
  );
};

export default ManagementPage;