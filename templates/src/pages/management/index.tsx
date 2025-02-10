import Management from 'components/sections/management/index'
import { Box, Typography} from '@mui/material';
const ManagementPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Management
      </Typography>
      <div>
      <Management />
    </div>
    </Box>
  );
};

export default ManagementPage;
