import { useState, useEffect, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import { formatNumber } from 'helpers/formatNumber';
import ActionMenu from 'components/common/ActionMenu';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface ManagementData {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  is_abnormal: boolean;
}

interface TaskOverviewTableProps {
  searchText: string;
  onFetchData: () => void; // Required
  userId?: number; // <- NEW optional userId
  title?: string;  // Optional title for admin view
}

const ManagementTable = forwardRef(({ searchText, userId }: TaskOverviewTableProps, ref) => {
  const apiRef = useGridApiRef<GridApi>();
  const [rows, setRows] = useState<ManagementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState<ManagementData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${import.meta.env.VITE_API_URL}/history`);

      // Add userId query param if provided (admin view)
      if (userId) {
        url.searchParams.append("user_id", userId.toString());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete record ID: ${id}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error(`Failed to delete record ID: ${id}`);

      // Remove deleted row from state
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleEdit = (id: number) => {
    const recordToEdit = rows.find(row => row.id === id);
    if (recordToEdit) {
      setEditData(recordToEdit);
      setOpenEditDialog(true);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditData(null);
  };

  // Type-safe input change handler for number fields
  const handleNumberInputChange = (
    field: 'temperature' | 'humidity' | 'soil_moisture',
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editData) {
      const value = e.target.value === '' ? 0 : Number(e.target.value);
      setEditData({
        ...editData,
        [field]: value
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editData) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          temperature: Number(editData.temperature),
          humidity: Number(editData.humidity),
          soil_moisture: Number(editData.soil_moisture)
        })
      });

      if (!response.ok) throw new Error(`Failed to update record ID: ${editData.id}`);

      // Update the modified row in the state
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === editData.id ? editData : row
        )
      );

      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Primary Key',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {formatNumber(params.value, { maximumFractionDigits: 1 })}
        </Typography>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      flex: 2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="caption">{new Date(params.value).toLocaleString('en-GB', { timeZone: 'UTC' })}</Typography>
      ),
    },
    {
      field: 'temperature',
      headerName: 'Temperature (°C)',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {formatNumber(params.value, { maximumFractionDigits: 1 })}
        </Typography>
      ),
    },
    {
      field: 'humidity',
      headerName: 'Humidity (%)',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {formatNumber(params.value, { maximumFractionDigits: 1 })}
        </Typography>
      ),
    },
    {
      field: 'soil_moisture',
      headerName: 'Soil Moisture (%)',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {formatNumber(params.value, { maximumFractionDigits: 1 })}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <ActionMenu
          actions={[
            { id: params.row.id, icon: 'mage:refresh', title: 'Delete', onClick: () => handleDelete(params.row.id) },
            { id: params.row.id, icon: 'mage:edit', title: 'Edit', onClick: () => handleEdit(params.row.id) }
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    if (apiRef.current && searchText.trim()) {
      const filteredRows = rows.filter((row) =>
        new Date(row.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' }).includes(searchText.trim())
      );
      apiRef.current.setRows(filteredRows);
    } else {
      apiRef.current?.setRows(rows); // Reset rows when search is cleared
    }
  }, [searchText, rows]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={columns}
        rows={rows}
        rowHeight={50}
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        slots={{
          pagination: DataGridFooter,
        }}
        checkboxSelection
        pageSizeOptions={[10, 20, 50]}
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Management Data</DialogTitle>
        <DialogContent>
          {editData && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Record ID: {editData.id}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Timestamp: {new Date(editData.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Temperature (°C)"
                    fullWidth
                    type="number"
                    value={editData.temperature}
                    onChange={(e) => handleNumberInputChange('temperature', e)}
                    inputProps={{ step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Humidity (%)"
                    fullWidth
                    type="number"
                    value={editData.humidity}
                    onChange={(e) => handleNumberInputChange('humidity', e)}
                    inputProps={{ step: 0.1, min: 0, max: 100 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Soil Moisture (%)"
                    fullWidth
                    type="number"
                    value={editData.soil_moisture}
                    onChange={(e) => handleNumberInputChange('soil_moisture', e)}
                    inputProps={{ step: 0.1, min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ManagementTable;