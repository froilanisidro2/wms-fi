import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Receipt,
  Assessment,
  Business,
  Settings,
  Add
} from '@mui/icons-material';
import ASNManagement from './ASNManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wms-tabpanel-${index}`}
      aria-labelledby={`wms-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `wms-tab-${index}`,
    'aria-controls': `wms-tabpanel-${index}`,
  };
}

// Philippine-themed color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
    },
    secondary: {
      main: '#FFC72C',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
  },
});

// Simple Dashboard Component
const SimpleDashboard = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      🇵🇭 Philippine WMS Dashboard
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Card sx={{ minWidth: 200, bgcolor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">₱2,456,780</Typography>
          <Typography variant="body2">Total Inventory Value</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'success.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">1,247</Typography>
          <Typography variant="body2">Items in Stock</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'warning.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">8</Typography>
          <Typography variant="body2">Low Stock Alerts</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'error.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">3</Typography>
          <Typography variant="body2">Expired Items</Typography>
        </CardContent>
      </Card>
    </Box>

    <Typography variant="h6" gutterBottom>Recent Activities</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ASN-20241115-001</TableCell>
            <TableCell>Received 500kg Rice Premium</TableCell>
            <TableCell>Juan dela Cruz</TableCell>
            <TableCell>10:30 AM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SO-20241115-002</TableCell>
            <TableCell>Shipped order to Metro Retail</TableCell>
            <TableCell>Maria Santos</TableCell>
            <TableCell>09:15 AM</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Simple Inbound Component
const SimpleInbound = () => {
  const [showWorkflowDemo, setShowWorkflowDemo] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  const [showOptimizedView, setShowOptimizedView] = useState(false);
  const [spreadsheetType, setSpreadsheetType] = useState<'ag-grid' | 'mui-datagrid' | 'simple-table'>('ag-grid');
  
  // Enhanced state for smart grid management
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyDrafts, setShowOnlyDrafts] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  
  // ASN Grid data for spreadsheet-style entry
  const [asnGridData, setAsnGridData] = useState<ASNRow[]>([
    {
      ID: 1,
      ASN_CODE: 'ASN-20251118-001',
      ASN_STATUS: 'In Progress',
      SUPPLIER: 'ABC Trading Corp',
      PO_NO: 'PO-20251118-001',
      CREATE_TIME: '2025-11-18 08:00:00',
      UPDATE_TIME: '2025-11-18 14:30:00',
      ITEM_CODE: 'RICE-001',
      ITEM_DESCRIPTION: 'Premium Jasmine Rice 25kg',
      ITEM_QTY_KG: 25.0,
      UOM: 'KG',
      ACTUAL_QTY: 24.8,
      ITEM_WEIGHT_KG: 25.0,
      PALLET_CONFIG: '4x4',
      PALLET_ID: 'PLT-001',
      MFG_DATE: '2025-10-15',
      EXP_DATE: '2026-10-15',
      BATCH_NO: 'BATCH-20251015-001',
      SORTED_QTY: 24.8,
      SHORTAGE_QTY: 0.2,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_VOLUME: 0.042,
      ITEM_COST: 45.50,
      GOODS_REMARKS: 'Good condition'
    },
    {
      ID: 2,
      ASN_CODE: 'ASN-20251118-002',
      ASN_STATUS: 'Receiving',
      SUPPLIER: 'Metro Food Supply',
      PO_NO: 'PO-20251118-002',
      CREATE_TIME: '2025-11-18 09:30:00',
      UPDATE_TIME: '2025-11-18 13:45:00',
      ITEM_CODE: 'OIL-002',
      ITEM_DESCRIPTION: 'Sunflower Cooking Oil 1L',
      ITEM_QTY_KG: 1.0,
      UOM: 'L',
      ACTUAL_QTY: 1.0,
      ITEM_WEIGHT_KG: 0.92,
      PALLET_CONFIG: '5x5',
      PALLET_ID: 'PLT-002',
      MFG_DATE: '2025-11-01',
      EXP_DATE: '2026-11-01',
      BATCH_NO: 'BATCH-20251101-002',
      SORTED_QTY: 1.0,
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_VOLUME: 0.001,
      ITEM_COST: 3.25,
      GOODS_REMARKS: 'Perfect condition'
    },
    {
      ID: 3,
      ASN_CODE: 'ASN-20251118-003',
      ASN_STATUS: 'Complete',
      SUPPLIER: 'Fresh Market Ltd',
      PO_NO: 'PO-20251118-003',
      CREATE_TIME: '2025-11-18 10:00:00',
      UPDATE_TIME: '2025-11-18 17:15:00',
      ITEM_CODE: 'SUGAR-003',
      ITEM_DESCRIPTION: 'White Sugar 50kg',
      ITEM_QTY_KG: 50.0,
      UOM: 'KG',
      ACTUAL_QTY: 50.0,
      ITEM_WEIGHT_KG: 50.0,
      PALLET_CONFIG: '3x3',
      PALLET_ID: 'PLT-003',
      MFG_DATE: '2025-11-10',
      EXP_DATE: '2027-11-10',
      BATCH_NO: 'BATCH-20251110-003',
      SORTED_QTY: 50.0,
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_VOLUME: 0.035,
      ITEM_COST: 28.75,
      GOODS_REMARKS: 'Excellent quality'
    },
    // Add empty rows for new entries
    ...Array(10).fill(null).map((_, index) => ({
      ID: 4 + index,
      ASN_CODE: '',
      ASN_STATUS: '',
      SUPPLIER: '',
      PO_NO: '',
      CREATE_TIME: '',
      UPDATE_TIME: '',
      ITEM_CODE: '',
      ITEM_DESCRIPTION: '',
      ITEM_QTY_KG: undefined,
      UOM: '',
      ACTUAL_QTY: undefined,
      ITEM_WEIGHT_KG: undefined,
      PALLET_CONFIG: '',
      PALLET_ID: '',
      MFG_DATE: '',
      EXP_DATE: '',
      BATCH_NO: '',
      SORTED_QTY: undefined,
      SHORTAGE_QTY: undefined,
      MORE_QTY: undefined,
      DAMAGE_QTY: undefined,
      ITEM_VOLUME: undefined,
      ITEM_COST: undefined,
      GOODS_REMARKS: ''
    }))
  ]);

  // AG Grid column definitions for ASN spreadsheet with comprehensive inbound fields
  const asnColumnDefs = [
    { field: 'ID', headerName: 'ID', width: 60, editable: true, type: 'numericColumn' },
    { field: 'ASN_CODE', headerName: 'ASN Code', width: 130, editable: true },
    { field: 'ASN_STATUS', headerName: 'ASN Status', width: 120, editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Draft', 'In Progress', 'Receiving', 'Complete', 'On Hold'] }
    },
    { field: 'SUPPLIER', headerName: 'Supplier', width: 150, editable: true },
    { field: 'PO_NO', headerName: 'PO No', width: 120, editable: true },
    { field: 'CREATE_TIME', headerName: 'Create Time', width: 150, editable: true },
    { field: 'UPDATE_TIME', headerName: 'Update Time', width: 150, editable: true },
    { field: 'ITEM_CODE', headerName: 'Item Code', width: 120, editable: true },
    { field: 'ITEM_DESCRIPTION', headerName: 'Item Description', width: 200, editable: true },
    { field: 'ITEM_QTY_KG', headerName: 'Item Qty (KG)', width: 120, editable: true, type: 'numericColumn' },
    { field: 'UOM', headerName: 'UOM', width: 80, editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['KG', 'L', 'PCS', 'BOX', 'CASE'] }
    },
    { field: 'ACTUAL_QTY', headerName: 'Actual Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'ITEM_WEIGHT_KG', headerName: 'Item Weight (KG)', width: 140, editable: true, type: 'numericColumn' },
    { field: 'PALLET_CONFIG', headerName: 'Pallet Config', width: 120, editable: true },
    { field: 'PALLET_ID', headerName: 'Pallet ID', width: 120, editable: true },
    { field: 'MFG_DATE', headerName: 'MFG Date', width: 120, editable: true },
    { field: 'EXP_DATE', headerName: 'EXP Date', width: 120, editable: true },
    { field: 'BATCH_NO', headerName: 'Batch No', width: 130, editable: true },
    { field: 'SORTED_QTY', headerName: 'Sorted Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'SHORTAGE_QTY', headerName: 'Shortage Qty', width: 130, editable: true, type: 'numericColumn' },
    { field: 'MORE_QTY', headerName: 'More Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'DAMAGE_QTY', headerName: 'Damage Qty', width: 130, editable: true, type: 'numericColumn' },
    { field: 'ITEM_VOLUME', headerName: 'Item Volume', width: 120, editable: true, type: 'numericColumn' },
    { field: 'ITEM_COST', headerName: 'Item Cost', width: 120, editable: true, type: 'numericColumn' },
    { field: 'GOODS_REMARKS', headerName: 'Goods Remarks', width: 200, editable: true }
  ];

  // Function to generate unique pallet ID with timestamp
  const generatePalletId = (index = 0) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `PLT-${year}${month}${day}${hour}${minute}${second}${index.toString().padStart(2, '0')}`;
  };

  // Function to add rows to the top of the grid
  const handleAddRows = () => {
    setShowAddRowDialog(true);
  };

  // Function to confirm adding rows
  const confirmAddRows = () => {
    const maxId = Math.max(...asnGridData.map(row => row.ID || 0));
    const newRows = Array.from({ length: rowsToAdd }, (_, index) => ({
      ID: maxId + 1 + index,
      ASN_CODE: `ASN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(maxId + 1 + index).padStart(3, '0')}`,
      ASN_STATUS: 'Draft',
      SUPPLIER: '',
      PO_NO: '',
      CREATE_TIME: new Date().toLocaleString(),
      UPDATE_TIME: new Date().toLocaleString(),
      ITEM_CODE: '',
      ITEM_DESCRIPTION: '',
      ITEM_QTY_KG: undefined,
      UOM: 'KG',
      ACTUAL_QTY: undefined,
      ITEM_WEIGHT_KG: undefined,
      PALLET_CONFIG: '',
      PALLET_ID: generatePalletId(index),
      MFG_DATE: '',
      EXP_DATE: '',
      BATCH_NO: '',
      SORTED_QTY: undefined,
      SHORTAGE_QTY: undefined,
      MORE_QTY: undefined,
      DAMAGE_QTY: undefined,
      ITEM_VOLUME: undefined,
      ITEM_COST: undefined,
      GOODS_REMARKS: ''
    }));
    
    // Add new rows at the beginning of the array
    setAsnGridData([...newRows, ...asnGridData]);
    setShowAddRowDialog(false);
    setRowsToAdd(1);
  };

  // Function to save grid data
  const handleSaveASNGrid = () => {
    console.log('Saving ASN Grid Data:', asnGridData);
    alert('ASN data saved successfully!');
  };

  // Function to handle multi-cell paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.trim().split('\n');
      const newData = [...asnGridData];
      
      rows.forEach((row, rowIndex) => {
        const cells = row.split('\t'); // Excel/Google Sheets use tab-separated values
        if (rowIndex < newData.length) {
          // Map cells to the appropriate fields based on column order
          const currentRow = newData[rowIndex];
          if (cells[0]) currentRow.ASN_CODE = cells[0];
          if (cells[1]) currentRow.ASN_STATUS = cells[1];
          if (cells[2]) currentRow.SUPPLIER = cells[2];
          if (cells[3]) currentRow.PO_NO = cells[3];
          if (cells[4]) currentRow.CREATE_TIME = cells[4];
          if (cells[5]) currentRow.UPDATE_TIME = cells[5];
          if (cells[6]) currentRow.ITEM_CODE = cells[6];
          if (cells[7]) currentRow.ITEM_DESCRIPTION = cells[7];
          if (cells[8]) currentRow.ITEM_QTY_KG = parseFloat(cells[8]) || currentRow.ITEM_QTY_KG;
          if (cells[9]) currentRow.UOM = cells[9];
          if (cells[10]) currentRow.ACTUAL_QTY = parseFloat(cells[10]) || currentRow.ACTUAL_QTY;
          if (cells[11]) currentRow.ITEM_WEIGHT_KG = parseFloat(cells[11]) || currentRow.ITEM_WEIGHT_KG;
          if (cells[12]) currentRow.PALLET_CONFIG = cells[12];
          if (cells[13]) currentRow.PALLET_ID = cells[13];
          if (cells[14]) currentRow.MFG_DATE = cells[14];
          if (cells[15]) currentRow.EXP_DATE = cells[15];
          if (cells[16]) currentRow.BATCH_NO = cells[16];
          if (cells[17]) currentRow.SORTED_QTY = parseFloat(cells[17]) || currentRow.SORTED_QTY;
          if (cells[18]) currentRow.SHORTAGE_QTY = parseFloat(cells[18]) || currentRow.SHORTAGE_QTY;
          if (cells[19]) currentRow.MORE_QTY = parseFloat(cells[19]) || currentRow.MORE_QTY;
          if (cells[20]) currentRow.DAMAGE_QTY = parseFloat(cells[20]) || currentRow.DAMAGE_QTY;
          if (cells[21]) currentRow.ITEM_VOLUME = parseFloat(cells[21]) || currentRow.ITEM_VOLUME;
          if (cells[22]) currentRow.ITEM_COST = parseFloat(cells[22]) || currentRow.ITEM_COST;
          if (cells[23]) currentRow.GOODS_REMARKS = cells[23];
        }
      });
      
      setAsnGridData(newData);
      alert(`Pasted ${rows.length} rows successfully!`);
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

  // Filter data based on status
  const filteredData = asnGridData.filter(row => {
    if (showOnlyDrafts) return row.ASN_STATUS === 'Draft';
    if (statusFilter === 'all') return true;
    return row.ASN_STATUS === statusFilter;
  });

  // Toggle row selection
  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Bulk operations for selected rows
  const handleBulkConfirm = () => {
    const newData = [...asnGridData];
    selectedRows.forEach(id => {
      const rowIndex = newData.findIndex(row => row.ID === id);
      if (rowIndex !== -1 && newData[rowIndex].ASN_STATUS === 'Draft') {
        newData[rowIndex] = { ...newData[rowIndex], ASN_STATUS: 'In Progress', UPDATE_TIME: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      }
    });
    setAsnGridData(newData);
    setSelectedRows([]);
    alert(`Confirmed ${selectedRows.length} rows successfully!`);
  };

  const handleBulkDelete = () => {
    const newData = asnGridData.filter(row => !selectedRows.includes(row.ID || 0));
    setAsnGridData(newData);
    setSelectedRows([]);
    alert(`Deleted ${selectedRows.length} rows successfully!`);
  };



  return (
    <Box>
      <Typography variant="h4" gutterBottom>📤 Inbound Process - ASN Workflow</Typography>
      <Typography paragraph>
        Complete ASN workflow from creation to inventory insertion with receiving and putaway processes.
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">ASN Workflow Progress</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="1. ASN Creation" color="success" />
            <Chip label="2. Physical Receiving" color="info" />
            <Chip label="3. Putaway Process" color="warning" />
            <Chip label="4. Inventory Insertion" color="default" />
          </Box>

        </CardContent>
      </Card>



      {/* AG Grid ASN Management */}
      <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>ASN Management - Custom Excel-like Table</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddRows}
                >
                  Add Rows
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
                  onClick={handleSaveASNGrid}
                >
                  Save ASNs
                </Button>
              </Box>
            </Box>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              🎯 Enhanced Excel-like table: Click cells to edit, use checkboxes to select rows, filter by status, Ctrl+V to paste from Excel!
              <br />📋 Visual Indicators: Orange border = Draft, Green border = Complete, Blue background = Selected
            </Alert>
            
            <Box 
              onKeyDown={handleKeyDown}
              tabIndex={0}
              sx={{ 
                height: 400, 
                width: '100%', 
                overflow: 'auto',
                border: 1,
                borderColor: 'divider',
                outline: 'none',
                '&:focus': {
                  borderColor: 'primary.main',
                  borderWidth: 2
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse'
                },
                '& th, & td': {
                  border: 1,
                  borderColor: 'divider',
                  padding: '4px 8px',
                  minWidth: '100px'
                },
                '& th': {
                  backgroundColor: 'grey.100',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                },
                '& input': {
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  padding: '2px',
                  fontSize: '14px'
              }
            }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>☑</th>
                    <th>ID</th>
                    <th>ASN Code</th>
                    <th>ASN Status</th>
                    <th>Supplier</th>
                    <th>PO No</th>
                    <th>Create Time</th>
                    <th>Update Time</th>
                    <th>Item Code</th>
                    <th>Item Description</th>
                    <th>Item Qty (KG)</th>
                    <th>UOM</th>
                    <th>Actual Qty</th>
                    <th>Item Weight (KG)</th>
                    <th>Pallet Config</th>
                    <th>Pallet ID</th>
                    <th>MFG Date</th>
                    <th>EXP Date</th>
                    <th>Batch No</th>
                    <th>Sorted Qty</th>
                    <th>Shortage Qty</th>
                    <th>More Qty</th>
                    <th>Damage Qty</th>
                    <th>Item Volume</th>
                    <th>Item Cost</th>
                    <th>Goods Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, filteredIndex) => {
                    // Find the original index in asnGridData for state updates
                    const originalIndex = asnGridData.findIndex(originalRow => originalRow.ID === row.ID);
                    const isDraft = row.ASN_STATUS === 'Draft';
                    const isSelected = selectedRows.includes(row.ID || 0);
                    const bgColor = isSelected ? '#e3f2fd' : 
                                   isDraft ? '#fff3e0' : 
                                   filteredIndex % 2 === 0 ? '#fafafa' : 'white';
                    
                    return (
                      <tr key={row.ID} style={{ 
                        backgroundColor: bgColor,
                        borderLeft: isDraft ? '4px solid #ff9800' : 
                                   row.ASN_STATUS === 'Complete' ? '4px solid #4caf50' : 
                                   '4px solid transparent'
                      }}>
                        {/* Selection Checkbox */}
                        <td>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleRowSelection(row.ID || 0)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      {/* ID */}
                      <td><input type="number" value={row.ID || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ID: parseInt(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* ASN Code */}
                      <td><input type="text" value={row.ASN_CODE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ASN_CODE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* ASN Status */}
                      <td><select value={row.ASN_STATUS || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ASN_STATUS: e.target.value };
                        setAsnGridData(newData);
                      }} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="Draft">Draft</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Receiving">Receiving</option>
                        <option value="Complete">Complete</option>
                        <option value="On Hold">On Hold</option>
                      </select></td>
                      
                      {/* Supplier */}
                      <td><input type="text" value={row.SUPPLIER || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, SUPPLIER: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* PO No */}
                      <td><input type="text" value={row.PO_NO || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, PO_NO: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Create Time */}
                      <td><input type="text" value={row.CREATE_TIME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, CREATE_TIME: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Update Time */}
                      <td><input type="text" value={row.UPDATE_TIME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, UPDATE_TIME: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Code */}
                      <td><input type="text" value={row.ITEM_CODE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_CODE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Description */}
                      <td><input type="text" value={row.ITEM_DESCRIPTION || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_DESCRIPTION: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Qty (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_QTY_KG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_QTY_KG: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* UOM */}
                      <td><select value={row.UOM || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, UOM: e.target.value };
                        setAsnGridData(newData);
                      }} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="KG">KG</option>
                        <option value="L">L</option>
                        <option value="PCS">PCS</option>
                        <option value="BOX">BOX</option>
                        <option value="CASE">CASE</option>
                      </select></td>
                      
                      {/* Actual Qty */}
                      <td><input type="number" step="0.01" value={row.ACTUAL_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ACTUAL_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Weight (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_WEIGHT_KG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_WEIGHT_KG: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Pallet Config */}
                      <td><input type="text" value={row.PALLET_CONFIG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, PALLET_CONFIG: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Pallet ID */}
                      <td><input type="text" value={row.PALLET_ID || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, PALLET_ID: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* MFG Date */}
                      <td><input type="date" value={row.MFG_DATE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, MFG_DATE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* EXP Date */}
                      <td><input type="date" value={row.EXP_DATE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, EXP_DATE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Batch No */}
                      <td><input type="text" value={row.BATCH_NO || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, BATCH_NO: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Sorted Qty */}
                      <td><input type="number" step="0.01" value={row.SORTED_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, SORTED_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Shortage Qty */}
                      <td><input type="number" step="0.01" value={row.SHORTAGE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, SHORTAGE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* More Qty */}
                      <td><input type="number" step="0.01" value={row.MORE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, MORE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Damage Qty */}
                      <td><input type="number" step="0.01" value={row.DAMAGE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, DAMAGE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Volume */}
                      <td><input type="number" step="0.001" value={row.ITEM_VOLUME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_VOLUME: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Cost */}
                      <td><input type="number" step="0.01" value={row.ITEM_COST || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, ITEM_COST: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Goods Remarks */}
                      <td><input type="text" value={row.GOODS_REMARKS || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[originalIndex] = { ...row, GOODS_REMARKS: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>

      {/* Add Rows Dialog */}
      <Dialog open={showAddRowDialog} onClose={() => setShowAddRowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Rows</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            New rows will be added at the top of the table with auto-generated ASN codes and unique pallet IDs.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Number of rows to add"
            type="number"
            fullWidth
            value={rowsToAdd}
            onChange={(e) => setRowsToAdd(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 50 }}
            helperText="Each row will get a unique pallet ID like PLT-202511191234567890"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddRowDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddRows} variant="contained">Add Rows</Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

// Simple Outbound Component  
const SimpleOutbound = () => (
  <Box>
    <Typography variant="h4" gutterBottom>🚚 Outbound Process - SO</Typography>
    <Typography paragraph>
      Sales Order management with FIFO/FEFO allocation strategy.
    </Typography>

    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">SO Header</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined">SO-20241115-001</Button>
          <Button variant="outlined">Customer: Metro Retail</Button>
          <Button variant="outlined">Total: ₱15,450.00</Button>
        </Box>
      </CardContent>
    </Card>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Ordered Qty</TableCell>
            <TableCell>Allocated Qty</TableCell>
            <TableCell>Strategy</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ITM-001</TableCell>
            <TableCell>Rice Premium 25kg</TableCell>
            <TableCell>25</TableCell>
            <TableCell>25</TableCell>
            <TableCell>FIFO</TableCell>
            <TableCell>Allocated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-002</TableCell>
            <TableCell>Cooking Oil 1L</TableCell>
            <TableCell>15</TableCell>
            <TableCell>15</TableCell>
            <TableCell>FEFO</TableCell>
            <TableCell>Allocated</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Simple Inventory Component
const SimpleInventory = () => (
  <Box>
    <Typography variant="h4" gutterBottom>📦 Inventory Management</Typography>
    <Typography paragraph>
      Real-time inventory monitoring across all warehouse locations.
    </Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>On Hand</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ITM-001</TableCell>
            <TableCell>Rice Premium 25kg</TableCell>
            <TableCell>A-01-001</TableCell>
            <TableCell>150.000</TableCell>
            <TableCell>125.000</TableCell>
            <TableCell>BATCH-20240801</TableCell>
            <TableCell>2025-08-01</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-002</TableCell>
            <TableCell>Cooking Oil 1L</TableCell>
            <TableCell>B-02-001</TableCell>
            <TableCell>25.000</TableCell>
            <TableCell>5.000</TableCell>
            <TableCell>BATCH-20241201</TableCell>
            <TableCell>2025-12-01</TableCell>
            <TableCell>Low Stock</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-003</TableCell>
            <TableCell>Sugar White 50kg</TableCell>
            <TableCell>C-01-001</TableCell>
            <TableCell>80.000</TableCell>
            <TableCell>65.000</TableCell>
            <TableCell>BATCH-20241120</TableCell>
            <TableCell>2026-11-20</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Item Master Setup Component
const ItemMasterSetup = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      item_code: 'PARACETAMOL-500MG',
      item_name: 'Paracetamol 500mg Tablets',
      category: 'Pharmaceutical',
      subcategory: 'Analgesic',
      unit_of_measure: 'TABLETS',
      min_stock: 100,
      max_stock: 1000,
      reorder_level: 200,
      is_active: true,
      doh_registered: true,
      regulatory_code: 'DOH-REG-001'
    },
    {
      id: 2,
      item_code: 'RICE-PREMIUM-25KG',
      item_name: 'Premium Rice 25kg Sack',
      category: 'Food',
      subcategory: 'Grains',
      unit_of_measure: 'SACK',
      min_stock: 50,
      max_stock: 500,
      reorder_level: 100,
      is_active: true,
      doh_registered: false,
      regulatory_code: 'NFA-REG-002'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">📦 Item Master Management</Typography>
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)}
        >
          + Add New Item
        </Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Item Categories Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Pharmaceutical (1)" color="primary" />
            <Chip label="Food (1)" color="secondary" />
            <Chip label="Medical Devices (0)" color="default" />
            <Chip label="Personal Care (0)" color="default" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell>Min Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Regulatory</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.item_code}</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.unit_of_measure}</TableCell>
                <TableCell>{item.min_stock}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.is_active ? "Active" : "Inactive"} 
                    color={item.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.doh_registered ? "DOH Registered" : "NFA Registered"} 
                    color={item.doh_registered ? "success" : "info"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Supplier Setup Component
const SupplierSetup = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      supplier_code: 'SUPP001',
      supplier_name: 'Philippine Medical Supplies Inc.',
      business_type: 'Corporation',
      tin_number: '123-456-789-000',
      contact_person: 'Maria Santos',
      email: 'maria@medisupplies.ph',
      phone: '+63-2-8123-4567',
      address: 'Makati City, Metro Manila',
      doh_license: 'DOH-LIC-001',
      is_active: true,
      rating: 'A'
    },
    {
      id: 2,
      supplier_code: 'SUPP002',
      supplier_name: 'Metro Food Distributors',
      business_type: 'Partnership',
      tin_number: '987-654-321-000',
      contact_person: 'Juan Dela Cruz',
      email: 'juan@metrofood.ph',
      phone: '+63-2-8987-6543',
      address: 'Quezon City, Metro Manila',
      doh_license: 'NFA-LIC-002',
      is_active: true,
      rating: 'B+'
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏭 Supplier Management</Typography>
        <Button variant="contained">+ Add New Supplier</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Supplier Performance Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Suppliers: 2" color="primary" />
            <Chip label="Active: 2" color="success" />
            <Chip label="A-Rated: 1" color="info" />
            <Chip label="DOH Licensed: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Code</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>TIN Number</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.supplier_code}</TableCell>
                <TableCell>{supplier.supplier_name}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{supplier.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">{supplier.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{supplier.tin_number}</TableCell>
                <TableCell>{supplier.doh_license}</TableCell>
                <TableCell>
                  <Chip label={supplier.rating} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={supplier.is_active ? "Active" : "Inactive"} 
                    color={supplier.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Customer Setup Component
const CustomerSetup = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      customer_code: 'CUST001',
      customer_name: 'Mercury Drug Corporation',
      business_type: 'Retail Pharmacy',
      tin_number: '111-222-333-000',
      contact_person: 'Anna Reyes',
      email: 'anna@mercurydrug.ph',
      phone: '+63-2-8111-2222',
      billing_address: 'Taguig City, Metro Manila',
      delivery_address: 'Multiple Locations',
      credit_limit: 2000000,
      credit_terms: 30,
      is_active: true
    },
    {
      id: 2,
      customer_code: 'CUST002',
      customer_name: 'SM Supermarket',
      business_type: 'Retail Chain',
      tin_number: '444-555-666-000',
      contact_person: 'Robert Tan',
      email: 'robert@sm.ph',
      phone: '+63-2-8444-5555',
      billing_address: 'Ortigas, Pasig City',
      delivery_address: 'Multiple Stores',
      credit_limit: 5000000,
      credit_terms: 45,
      is_active: true
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">👥 Customer Management</Typography>
        <Button variant="contained">+ Add New Customer</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Customer Portfolio Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Customers: 2" color="primary" />
            <Chip label="Active: 2" color="success" />
            <Chip label="Pharmacy: 1" color="info" />
            <Chip label="Retail Chain: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Code</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Business Type</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Credit Limit</TableCell>
              <TableCell>Credit Terms</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.customer_code}</TableCell>
                <TableCell>{customer.customer_name}</TableCell>
                <TableCell>{customer.business_type}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{customer.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">{customer.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>₱{customer.credit_limit.toLocaleString()}</TableCell>
                <TableCell>{customer.credit_terms} days</TableCell>
                <TableCell>
                  <Chip 
                    label={customer.is_active ? "Active" : "Inactive"} 
                    color={customer.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Warehouse Setup Component
const WarehouseSetup = () => {
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      warehouse_code: 'WH001',
      warehouse_name: 'Metro Manila Distribution Center',
      address: 'Laguna Technopark, Santa Rosa, Laguna',
      manager: 'Carlos Rodriguez',
      total_locations: 1250,
      active_locations: 1180,
      capacity_utilization: 85,
      temperature_controlled: true,
      is_active: true
    },
    {
      id: 2,
      warehouse_code: 'WH002',
      warehouse_name: 'Cebu Regional Warehouse',
      address: 'Mactan Economic Zone, Lapu-Lapu City, Cebu',
      manager: 'Elena Fernandez',
      total_locations: 800,
      active_locations: 720,
      capacity_utilization: 72,
      temperature_controlled: false,
      is_active: true
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏢 Warehouse Configuration</Typography>
        <Button variant="contained">+ Add New Warehouse</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Warehouse Network Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Warehouses: 2" color="primary" />
            <Chip label="Total Locations: 2,050" color="info" />
            <Chip label="Active: 2" color="success" />
            <Chip label="Temperature Controlled: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse Code</TableCell>
              <TableCell>Warehouse Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Locations</TableCell>
              <TableCell>Utilization</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.warehouse_code}</TableCell>
                <TableCell>{warehouse.warehouse_name}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.manager}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{warehouse.active_locations}/{warehouse.total_locations}</Typography>
                    <Typography variant="caption" color="textSecondary">Active/Total</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${warehouse.capacity_utilization}%`} 
                    color={warehouse.capacity_utilization > 80 ? "warning" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {warehouse.temperature_controlled && (
                    <Chip label="❄️ Climate Controlled" color="info" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={warehouse.is_active ? "Active" : "Inactive"} 
                    color={warehouse.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Simple Setup Component
const SimpleSetup = () => {
  const [activeSetupTab, setActiveSetupTab] = useState(0);

  const setupTabs = [
    { label: 'Items', icon: '📦' },
    { label: 'Suppliers', icon: '🏭' },
    { label: 'Customers', icon: '👥' },
    { label: 'Warehouses', icon: '🏢' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>⚙️ System Setup & Configuration</Typography>
      <Typography paragraph>
        Configure master data for your Philippine WMS system including items, suppliers, customers, and warehouse locations.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeSetupTab} 
          onChange={(e, newValue) => setActiveSetupTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
        >
          {setupTabs.map((tab, index) => (
            <Tab 
              key={index}
              label={`${tab.icon} ${tab.label}`} 
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Paper>

      <TabPanel value={activeSetupTab} index={0}>
        <ItemMasterSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={1}>
        <SupplierSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={2}>
        <CustomerSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={3}>
        <WarehouseSetup />
      </TabPanel>
    </Box>
  );
};

interface ASNRow {
  ID?: number;
  ASN_CODE?: string;
  ASN_STATUS?: string;
  SUPPLIER?: string;
  PO_NO?: string;
  CREATE_TIME?: string;
  UPDATE_TIME?: string;
  ITEM_CODE?: string;
  ITEM_DESCRIPTION?: string;
  ITEM_QTY_KG?: number;
  UOM?: string;
  ACTUAL_QTY?: number;
  ITEM_WEIGHT_KG?: number;
  PALLET_CONFIG?: string;
  PALLET_ID?: string;
  MFG_DATE?: string;
  EXP_DATE?: string;
  BATCH_NO?: string;
  SORTED_QTY?: number;
  SHORTAGE_QTY?: number;
  MORE_QTY?: number;
  DAMAGE_QTY?: number;
  ITEM_VOLUME?: number;
  ITEM_COST?: number;
  GOODS_REMARKS?: string;
}

function SimpleWMS() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WMS Philippines - Warehouse Management System
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {new Date().toLocaleDateString('en-PH', { 
              timeZone: 'Asia/Manila',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 2 }}>
        <Paper elevation={1}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="WMS navigation tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                icon={<Assessment />} 
                label="Dashboard" 
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<Receipt />} 
                label="Inbound (ASN)" 
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                icon={<LocalShipping />} 
                label="Outbound (SO)" 
                iconPosition="start"
                {...a11yProps(2)} 
              />
              <Tab 
                icon={<Inventory />} 
                label="Inventory" 
                iconPosition="start"
                {...a11yProps(3)} 
              />
              <Tab 
                icon={<Settings />} 
                label="Setup" 
                iconPosition="start"
                {...a11yProps(4)} 
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <SimpleDashboard />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SimpleInbound />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <SimpleOutbound />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <SimpleInventory />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <SimpleSetup />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default SimpleWMS;