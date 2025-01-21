import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import ActionMenu from 'components/common/ActionMenu';
import { formatNumber } from 'helpers/formatNumber';

const actions = [
  { id: 1, icon: 'mage:refresh', title: 'Refresh' },
  { id: 2, icon: 'solar:export-linear', title: 'Export' },
  { id: 3, icon: 'mage:share', title: 'Share' },
];

interface RowData {
  timestamp: string; // Assuming timestamp is a string
  temperature: number;
  humidity: number;
  soil_moisture: number;
}

const columns: GridColDef[] = [
  {
    field: 'timestamp',
    headerName: 'Timestamp',
    flex: 2,
    minWidth: 180,
    renderCell: (params) => (
      <Typography variant="caption">{new Date(params.value).toLocaleString()}</Typography>
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
    renderHeader: () => <ActionMenu actions={actions} />,
    renderCell: () => <ActionMenu actions={actions} />,
  },
];

interface TaskOverviewTableProps {
  searchText: string;
  onFetchData: () => void; // Required
}

const DataTable = forwardRef(({ searchText }: TaskOverviewTableProps, ref) => {
  const apiRef = useGridApiRef<GridApi>();
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/history', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  // Expose fetchData to the parent via the ref
  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  useEffect(() => {
    if (apiRef.current && searchText.trim()) {
      const filteredRows = rows.filter((row) =>
        new Date(row.timestamp).toLocaleString().includes(searchText.trim())
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
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      slots={{
        pagination: DataGridFooter,
      }}
      checkboxSelection
      pageSizeOptions={[10, 20, 50]}
    />
  );
});

export default DataTable;