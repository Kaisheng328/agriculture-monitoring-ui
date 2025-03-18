import Guideline from 'components/sections/guideline/index'
import { Box, Typography} from '@mui/material';
const ManagementPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        User Guideline
      </Typography>
      <div>
      <Guideline />
    </div>
    </Box>
  );
};

export default ManagementPage;
