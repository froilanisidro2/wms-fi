import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowModel } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface ASNRow {
  id: number;
  asnNumber: string;
  vendor: string;
  lines: number;
  currentStep: string;
  status: string;
  progress: number;
  poNumber: string;
  expectedDate: string;
  createTime: string;
  updateTime: string;
}

const SimpleSpreadsheet: React.FC = () => {
  // Initial data with some sample ASNs and empty rows
  const [rows, setRows] = useState<GridRowsProp<ASNRow>>([
    {
      id: 1,
      asnNumber: 'ASN-20251115-001',
      vendor: 'ABC Trading Corp',
      lines: 3,
      currentStep: 'Putaway',
      status: 'In Progress',
      progress: 75,
      poNumber: 'PO-20251115-001',
      expectedDate: '2025-11-15',
      createTime: '2025-11-15 08:00:00',
      updateTime: '2025-11-15 14:30:00'
    },
    {
      id: 2,
      asnNumber: 'ASN-20251115-002',
      vendor: 'Metro Food Supply',
      lines: 5,
      currentStep: 'Receiving',
      status: 'Receiving',
      progress: 60,
      poNumber: 'PO-20251115-002',
      expectedDate: '2025-11-15',
      createTime: '2025-11-15 09:30:00',
      updateTime: '2025-11-15 13:45:00'
    },
    {
      id: 3,
      asnNumber: 'ASN-20251114-003',
      vendor: 'Fresh Market Ltd',
      lines: 4,
      currentStep: 'Complete',
      status: 'Complete',
      progress: 100,
      poNumber: 'PO-20251114-003',
      expectedDate: '2025-11-14',
      createTime: '2025-11-14 10:00:00',
      updateTime: '2025-11-14 17:15:00'
    },
    // Add empty rows for new entries
    ...Array.from({ length: 10 }, (_, index) => ({
      id: 4 + index,
      asnNumber: '',
      vendor: '',
      lines: 0,
      currentStep: '',
      status: '',
      progress: 0,
      poNumber: '',
      expectedDate: '',
      createTime: '',
      updateTime: ''
    }))
  ]);

  // Column definitions
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      editable: true,
      type: 'number'
    },
    {
      field: 'asnNumber',
      headerName: 'ASN Number',
      width: 140,
      editable: true
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      width: 150,
      editable: true
    },
    {
      field: 'lines',
      headerName: 'Lines',
      width: 80,
      editable: true,
      type: 'number'
    },
    {
      field: 'currentStep',
      headerName: 'Current Step',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Created', 'Receiving', 'Putaway', 'Complete']
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Draft', 'In Progress', 'Receiving', 'Complete', 'On Hold']
    },
    {
      field: 'progress',
      headerName: 'Progress %',
      width: 100,
      editable: true,
      type: 'number'
    },
    {
      field: 'poNumber',
      headerName: 'PO Number',
      width: 130,
      editable: true
    },
    {
      field: 'expectedDate',
      headerName: 'Expected Date',
      width: 120,
      editable: true,
      type: 'date'
    },
    {
      field: 'createTime',
      headerName: 'Create Time',
      width: 150,
      editable: true
    },
    {
      field: 'updateTime',
      headerName: 'Update Time',
      width: 150,
      editable: true
    }
  ];

  // Handle row updates
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row));
    setRows(updatedRows);
    return newRow;
  };

  // Add new rows
  const handleAddRows = () => {
    const currentMaxId = Math.max(...rows.map(row => row.id));
    const newRows = Array.from({ length: 10 }, (_, index) => ({
      id: currentMaxId + 1 + index,
      asnNumber: '',
      vendor: '',
      lines: 0,
      currentStep: '',
      status: '',
      progress: 0,
      poNumber: '',
      expectedDate: '',
      createTime: '',
      updateTime: ''
    }));
    setRows([...rows, ...newRows]);
  };

  // Save data
  const handleSaveData = () => {
    console.log('Saving data:', rows);
    alert('ASN data saved successfully!');
  };

  // Function to handle multi-cell paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pasteRows = text.trim().split('\n');
      const newRows = [...rows];
      
      pasteRows.forEach((row, rowIndex) => {
        const cells = row.split('\t'); // Excel uses tab-separated values
        if (rowIndex < newRows.length) {
          // Map cells to the appropriate fields based on column order
          const currentRow = newRows[rowIndex];
          if (cells[0]) currentRow.asnNumber = cells[0];
          if (cells[1]) currentRow.vendor = cells[1];
          if (cells[2]) currentRow.lines = parseInt(cells[2]) || currentRow.lines;
          if (cells[3]) currentRow.currentStep = cells[3];
          if (cells[4]) currentRow.status = cells[4];
          if (cells[5]) currentRow.progress = parseInt(cells[5]) || currentRow.progress;
          if (cells[6]) currentRow.poNumber = cells[6];
          if (cells[7]) currentRow.expectedDate = cells[7];
          if (cells[8]) currentRow.createTime = cells[8];
          if (cells[9]) currentRow.updateTime = cells[9];
        }
      });
      
      setRows([...newRows]);
      alert(`Pasted ${pasteRows.length} rows successfully!`);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Please copy data from Excel/Google Sheets first');
    }
  };

  // Function to handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      handlePaste();
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>ASN Management - DataGrid Style</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Add />}
              onClick={handleAddRows}
            >
              Add 10 Rows
            </Button>
            <Button 
              variant="outlined" 
              color="success"
              onClick={handlePaste}
            >
              Paste from Excel
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={handleSaveData}
            >
              Save ASNs
            </Button>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Excel-like data entry: Double-click cells to edit, use Tab/Enter to navigate, Ctrl+V to paste multiple rows from Excel!
        </Alert>

        <Box 
          onKeyDown={handleKeyDown}
          tabIndex={0}
          sx={{ 
            height: 500, 
            width: '100%',
            outline: 'none',
            '&:focus-within': {
              '& .MuiDataGrid-root': {
                border: '2px solid #1976d2'
              }
            }
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: '2px solid #1976d2'
              },
              '& .MuiDataGrid-cell--editing': {
                backgroundColor: '#e3f2fd'
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimpleSpreadsheet;