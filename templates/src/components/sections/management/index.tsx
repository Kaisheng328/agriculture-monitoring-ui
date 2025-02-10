import { useRef, useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import ManagementTable from './management';
import Button from '@mui/material/Button';

interface DataTableRef {
  fetchData: () => void;
}
const History = () => {
  const [searchText, setSearchText] = useState('');
  const dataTableRef = useRef<DataTableRef | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFetchData = () => {
    if (dataTableRef.current) {
      dataTableRef.current.fetchData(); // Trigger fetchData from DataTable
    }
  };
  const handleSyncClick = () => {
    if (dataTableRef.current) {
      dataTableRef.current.fetchData(); // Trigger fetchData from DataTable
    }
  };
  
  return (
    <Paper sx={{ height: { xs: 500, sm: 900 }, overflow: 'hidden' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        mt={-0.5}
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" color="text.secondary">
          Sensor Reading Table
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="filled"
            size="small"
            placeholder="Search here"
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 1, maxWidth: { xs: 260, sm: 240 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="prime:search" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSyncClick}>
            Sync
          </Button>
        </Stack>
      </Stack>

      <Box mt={{ xs: 1.5, sm: 0.75 }} height={800} flex={1}>
        <ManagementTable ref={dataTableRef} searchText={searchText} onFetchData={handleFetchData}/>
      </Box>
    </Paper>
  );
};

export default History;
