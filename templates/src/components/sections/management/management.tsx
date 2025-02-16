import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import { formatNumber } from 'helpers/formatNumber';
import ActionMenu from 'components/common/ActionMenu';


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
}

const ManagementTable = forwardRef(({ searchText }: TaskOverviewTableProps, ref) => {
  const apiRef = useGridApiRef<GridApi>();
  const [rows, setRows] = useState<ManagementData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch(`${import.meta.env.VITE_API_URL}/history`, {
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
        headers: { 'Content-Type': 'application/json',
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
    minWidth: 100,
    renderCell: (params) => (
      <ActionMenu
        actions={[{ id: params.row.id, icon: 'mage:refresh', title: 'Delete', onClick: () => handleDelete(params.row.id) }]}
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
    apiRef.current.setRows(rows); // Reset rows when search is cleared
  }
}, [searchText, rows]);

useEffect(() => {
  fetchData();
}, []);

  return (
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
  );
});

export default ManagementTable;
