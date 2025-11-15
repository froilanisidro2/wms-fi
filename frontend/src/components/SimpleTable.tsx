import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface ASNRowData {
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

const SimpleTable: React.FC = () => {
  // Initial data
  const [data, setData] = useState<ASNRowData[]>([
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
    // Add empty rows
    ...Array.from({ length: 10 }, (_, index) => ({
      id: 3 + index,
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

  // Update cell value
  const updateCell = (id: number, field: keyof ASNRowData, value: any) => {
    setData(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Add new rows
  const addRows = () => {
    const maxId = Math.max(...data.map(row => row.id));
    const newRows = Array.from({ length: 10 }, (_, index) => ({
      id: maxId + 1 + index,
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
    setData([...data, ...newRows]);
  };

  // Function to handle multi-cell paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pasteRows = text.trim().split('\n');
      const newData = [...data];
      
      pasteRows.forEach((row, rowIndex) => {
        const cells = row.split('\t'); // Excel uses tab-separated values
        if (rowIndex < newData.length) {
          // Map cells to the appropriate fields based on column order
          const currentRow = newData[rowIndex];
          if (cells[0]) currentRow.id = parseInt(cells[0]) || currentRow.id;
          if (cells[1]) currentRow.asnNumber = cells[1];
          if (cells[2]) currentRow.vendor = cells[2];
          if (cells[3]) currentRow.lines = parseInt(cells[3]) || currentRow.lines;
          if (cells[4]) currentRow.currentStep = cells[4];
          if (cells[5]) currentRow.status = cells[5];
          if (cells[6]) currentRow.progress = parseInt(cells[6]) || currentRow.progress;
          if (cells[7]) currentRow.poNumber = cells[7];
          if (cells[8]) currentRow.expectedDate = cells[8];
          if (cells[9]) currentRow.createTime = cells[9];
          if (cells[10]) currentRow.updateTime = cells[10];
        }
      });
      
      setData([...newData]);
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
          <Typography variant="h6">ASN Management - Simple Table</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<Add />} onClick={addRows}>
              Add 10 Rows
            </Button>
            <Button variant="outlined" color="success" onClick={handlePaste}>
              Paste from Excel
            </Button>
            <Button variant="contained" color="success">
              Save ASNs
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Simple table with inline editing - Click any cell to edit directly! Press Ctrl+V to paste multiple rows from Excel.
        </Alert>

        <TableContainer 
          component={Paper} 
          onKeyDown={handleKeyDown}
          tabIndex={0}
          sx={{ 
            maxHeight: 600, 
            overflow: 'auto',
            outline: 'none',
            '&:focus': {
              borderColor: 'primary.main',
              borderWidth: 2
            }
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ASN Number</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Lines</TableCell>
                <TableCell>Current Step</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress %</TableCell>
                <TableCell>PO Number</TableCell>
                <TableCell>Expected Date</TableCell>
                <TableCell>Create Time</TableCell>
                <TableCell>Update Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <TextField
                      value={row.id}
                      size="small"
                      variant="standard"
                      type="number"
                      onChange={(e) => updateCell(row.id, 'id', parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.asnNumber}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'asnNumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.vendor}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'vendor', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.lines}
                      size="small"
                      variant="standard"
                      type="number"
                      onChange={(e) => updateCell(row.id, 'lines', parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.currentStep}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'currentStep', e.target.value)}
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="">-</MenuItem>
                      <MenuItem value="Created">Created</MenuItem>
                      <MenuItem value="Receiving">Receiving</MenuItem>
                      <MenuItem value="Putaway">Putaway</MenuItem>
                      <MenuItem value="Complete">Complete</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'status', e.target.value)}
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="">-</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Receiving">Receiving</MenuItem>
                      <MenuItem value="Complete">Complete</MenuItem>
                      <MenuItem value="On Hold">On Hold</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.progress}
                      size="small"
                      variant="standard"
                      type="number"
                      onChange={(e) => updateCell(row.id, 'progress', parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.poNumber}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'poNumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.expectedDate}
                      size="small"
                      variant="standard"
                      type="date"
                      onChange={(e) => updateCell(row.id, 'expectedDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.createTime}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'createTime', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.updateTime}
                      size="small"
                      variant="standard"
                      onChange={(e) => updateCell(row.id, 'updateTime', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default SimpleTable;