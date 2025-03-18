import Grid from '@mui/material/Grid';
import History from 'components/sections/dashboard/reading-table';
import RealTime from 'components/sections/dashboard/live';
import Graph from 'components/sections/dashboard/graph';
import Map from 'components/sections/dashboard/location'
const Dashboard = () => {
  return (
    <Grid container px={3.75} spacing={3.75}>
      <Grid item xs={12}>
        <RealTime />
      </Grid>
      <Grid item xs={12}>
        <Map />
      </Grid>
      <Grid item xs={12}>
        <History />
      </Grid>
      <Grid item xs={12}>
        <Graph />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
