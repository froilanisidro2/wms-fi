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
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Receipt,
  Assessment,
  Business,
  Settings,
  Add,
  Delete,
  Search,
  Clear
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [lastAddedRowsCount, setLastAddedRowsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [asnBatchCounter, setAsnBatchCounter] = useState(1); // Track ASN batch number
  const [defaultSupplier, setDefaultSupplier] = useState('');
  const [defaultPONumber, setDefaultPONumber] = useState('');
  
  // Focus tracking for paste functionality
  const [focusedCell, setFocusedCell] = useState<{rowIndex: number, columnIndex: number} | null>(null);
  
  // Print preview state
  const [printPreview, setPrintPreview] = useState<{visible: boolean, data: ASNRow | null}>({visible: false, data: null});
  
  // Putaway form state
  const [putawayForm, setPutawayForm] = useState<{visible: boolean, data: ASNRow | null, selectedBin: string, scannerActive: boolean}>({visible: false, data: null, selectedBin: '', scannerActive: false});
  
  // QR Scanner state
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  // Available bin locations
  const availableBins = [
    'A01-01-01', 'A01-01-02', 'A01-01-03', 'A01-02-01', 'A01-02-02',
    'A02-01-01', 'A02-01-02', 'A02-02-01', 'A02-02-02', 'A02-03-01',
    'B01-01-01', 'B01-01-02', 'B01-02-01', 'B01-02-02', 'B01-03-01',
    'B02-01-01', 'B02-01-02', 'B02-02-01', 'B02-02-02', 'B02-03-01',
    'C01-01-01', 'C01-01-02', 'C01-02-01', 'C01-02-02', 'C01-03-01'
  ];
  
  // Suppliers data for autocomplete
  const suppliers = [
    {
      id: 1,
      supplier_code: 'SUPP001',
      supplier_name: 'Philippine Medical Supplies Inc.'
    },
    {
      id: 2,
      supplier_code: 'SUPP002',
      supplier_name: 'Metro Food Distributors'
    },
    {
      id: 3,
      supplier_code: 'SUPP003',
      supplier_name: 'ABC Trading Corp'
    },
    {
      id: 4,
      supplier_code: 'SUPP004',
      supplier_name: 'Fresh Market Ltd'
    }
  ];
  
  // ASN Grid data for spreadsheet-style entry
  const [asnGridData, setAsnGridData] = useState<ASNRow[]>([
    {
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
      SHORTAGE_QTY: 0.2,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 45.50,
      GOODS_REMARKS: 'Good condition',
      isSaved: true // Existing record, already in database
    },
    {
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
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 3.25,
      GOODS_REMARKS: 'Perfect condition',
      isSaved: true // Existing record, already in database
    },
    {
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
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 28.75,
      GOODS_REMARKS: 'Excellent quality',
      isSaved: true // Existing record, already in database
    }
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
    { field: 'SHORTAGE_QTY', headerName: 'Shortage Qty', width: 130, editable: true, type: 'numericColumn' },
    { field: 'MORE_QTY', headerName: 'More Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'DAMAGE_QTY', headerName: 'Damage Qty', width: 130, editable: true, type: 'numericColumn' },
    { field: 'ITEM_COST', headerName: 'Item Cost', width: 120, editable: true, type: 'numericColumn' },
    { field: 'GOODS_REMARKS', headerName: 'Goods Remarks', width: 200, editable: true }
  ];

  // Helper function to get today's date string
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return { fullDate: `${year}${month}${day}`, shortDate: `${year.toString().slice(-2)}${month}${day}` };
  };

  // Function to get next ASN increment for today
  const getNextASNIncrement = () => {
    const { fullDate } = getTodayDateString();
    const todayASNs = asnGridData.filter(row => 
      row.ASN_CODE && row.ASN_CODE.startsWith(`ASN${fullDate}`)
    );
    
    if (todayASNs.length === 0) return 1;
    
    // Extract the highest increment from existing ASN codes for today
    const increments = todayASNs.map(row => {
      const match = row.ASN_CODE?.match(/ASN\d{8}(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
    
    return Math.max(...increments) + 1;
  };

  // Function to get next Pallet increment for today
  const getNextPalletIncrement = () => {
    const { shortDate } = getTodayDateString();
    const todayPallets = asnGridData.filter(row => 
      row.PALLET_ID && row.PALLET_ID.startsWith(`PLT${shortDate}`)
    );
    
    if (todayPallets.length === 0) return 1;
    
    // Extract the highest increment from existing pallet IDs for today
    const increments = todayPallets.map(row => {
      const match = row.PALLET_ID?.match(/PLT\d{6}(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
    
    return Math.max(...increments) + 1;
  };

  // Function to generate ASN Code: ASN+YYYYMMDD+batch_number
  const generateASNCode = () => {
    const { fullDate } = getTodayDateString();
    return `ASN${fullDate}${asnBatchCounter}`;
  };

  // Function to generate Pallet ID: PLT+YYMMDD+increment
  const generatePalletId = (startingIncrement = 0) => {
    const { shortDate } = getTodayDateString();
    const baseIncrement = getNextPalletIncrement();
    const increment = baseIncrement + startingIncrement;
    return `PLT${shortDate}${increment}`;
  };

  // Function to add rows directly to the top of the grid
  const handleAddRows = () => {
    // Generate single ASN code for this batch
    const batchASNCode = generateASNCode();
    
    const newRows = Array.from({ length: rowsToAdd }, (_, index) => {
      const uniquePalletId = generatePalletId(index);
      return {
        ASN_CODE: batchASNCode, // Same ASN code for all rows in this batch
        ASN_STATUS: 'Draft',
        SUPPLIER: defaultSupplier, // Use default supplier
        PO_NO: defaultPONumber,   // Use default PO number
        CREATE_TIME: new Date().toLocaleString(),
        UPDATE_TIME: new Date().toLocaleString(),
        ITEM_CODE: '',
        ITEM_DESCRIPTION: '',
        ITEM_QTY_KG: undefined,
        UOM: 'KG',
        ACTUAL_QTY: undefined,
        ITEM_WEIGHT_KG: undefined,
        PALLET_CONFIG: '',
        PALLET_ID: uniquePalletId, // Unique pallet ID for each row
        MFG_DATE: '',
        EXP_DATE: '',
        BATCH_NO: '',
        SHORTAGE_QTY: undefined,
        MORE_QTY: undefined,
        DAMAGE_QTY: undefined,
        ITEM_COST: undefined,
        GOODS_REMARKS: '',
        isSaved: false, // New record, not saved in database yet
        _tempId: `${Date.now()}-${index}` // Temporary unique identifier for proper indexing
      };
    });
    
    // Add new rows at the beginning of the array
    setAsnGridData([...newRows, ...asnGridData]);
    setLastAddedRowsCount(rowsToAdd); // Track how many rows were added
    setAsnBatchCounter(prev => prev + 1); // Increment batch counter for next add operation
    setRowsToAdd(1);
  };

  // Function to remove the last added rows
  const handleRemoveRows = () => {
    if (lastAddedRowsCount === 0) {
      alert('No recently added rows to remove!');
      return;
    }
    
    const rowsToRemoveCount = Math.min(lastAddedRowsCount, asnGridData.length);
    
    if (rowsToRemoveCount > 0) {
      // Since new rows are added at the beginning, remove from the beginning
      const newData = asnGridData.slice(rowsToRemoveCount);
      setAsnGridData(newData);
      setLastAddedRowsCount(0); // Reset the counter
      alert(`Removed ${rowsToRemoveCount} recently added rows successfully!`);
    } else {
      alert('No rows to remove!');
    }
  };

  // Function to save grid data
  const handleSaveASNGrid = () => {
    // Mark all rows as saved in database
    const updatedData = asnGridData.map(row => ({
      ...row,
      isSaved: true,
      UPDATE_TIME: new Date().toLocaleString() // Update the modification time
    }));
    
    setAsnGridData(updatedData);
    console.log('Saving ASN Grid Data:', updatedData);
    alert('ASN data saved successfully! All records are now marked as saved in database.');
  };

  // Function to handle multi-cell paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.trim().split('\n');
      const newData = [...asnGridData];
      
      // Define column mapping for paste operations
      const columnFields = [
        'ASN_STATUS', 'CREATE_TIME', 'UPDATE_TIME', 'ASN_CODE', 'SUPPLIER', 'PO_NO',
        'ITEM_CODE', 'ITEM_DESCRIPTION', 'ITEM_QTY_KG', 'UOM', 'ACTUAL_QTY',
        'ITEM_WEIGHT_KG', 'PALLET_CONFIG', 'PALLET_ID', 'MFG_DATE', 'EXP_DATE',
        'BATCH_NO', 'SHORTAGE_QTY', 'MORE_QTY', 'DAMAGE_QTY', 'ITEM_COST', 'GOODS_REMARKS'
      ];
      
      // Determine starting position - use focused cell if available, otherwise start from beginning
      const startRowIndex = focusedCell?.rowIndex || 0;
      const startColumnIndex = focusedCell?.columnIndex || 0;
      
      rows.forEach((row, pasteRowIndex) => {
        const cells = row.split('\t'); // Excel/Google Sheets use tab-separated values
        const targetRowIndex = startRowIndex + pasteRowIndex;
        
        if (targetRowIndex < newData.length) {
          const currentRow = newData[targetRowIndex];
          
          cells.forEach((cellValue, pasteCellIndex) => {
            const targetColumnIndex = startColumnIndex + pasteCellIndex;
            
            if (targetColumnIndex < columnFields.length && cellValue.trim()) {
              const fieldName = columnFields[targetColumnIndex];
              
              // Handle different field types
              if (['ITEM_QTY_KG', 'ACTUAL_QTY', 'ITEM_WEIGHT_KG', 'SHORTAGE_QTY', 
                   'MORE_QTY', 'DAMAGE_QTY', 'ITEM_COST'].includes(fieldName)) {
                const numValue = parseFloat(cellValue);
                if (!isNaN(numValue)) {
                  (currentRow as any)[fieldName] = numValue;
                }
              } else {
                (currentRow as any)[fieldName] = cellValue;
              }
            }
          });
          
          // Mark row as unsaved since it has been modified with pasted data
          currentRow.isSaved = false;
        }
      });
      
      setAsnGridData(newData);
      alert(`Pasted ${rows.length} rows starting from ${focusedCell ? `row ${startRowIndex + 1}, column ${startColumnIndex + 1}` : 'beginning'}!`);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Please copy data from Excel/Google Sheets first');
    }
  };

  // Print preview function
  const handlePrintPreview = (rowData: ASNRow) => {
    setPrintPreview({visible: true, data: rowData});
  };

  // Close print preview
  const closePrintPreview = () => {
    setPrintPreview({visible: false, data: null});
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Putaway form functions
  const handlePutawayForm = (rowData: ASNRow) => {
    setPutawayForm({visible: true, data: rowData, selectedBin: '', scannerActive: false});
  };

  // Close putaway form
  const closePutawayForm = () => {
    setPutawayForm({visible: false, data: null, selectedBin: '', scannerActive: false});
  };

  // Generate QR code data URL
  const generateQRCode = (data: string): string => {
    // Simple QR code generation using Google Charts API as fallback
    const encodedData = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedData}`;
  };

  // Generate pallet QR data
  const generatePalletQRData = (rowData: ASNRow): string => {
    return JSON.stringify({
      type: "pallet",
      pallet_id: rowData.PALLET_ID,
      asn_code: rowData.ASN_CODE,
      item_code: rowData.ITEM_CODE,
      quantity: rowData.ITEM_QTY_KG,
      uom: rowData.UOM,
      supplier: rowData.SUPPLIER
    });
  };

  // Scanner functions
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraPermission(true);
      setPutawayForm({...putawayForm, scannerActive: true});
      
      // In a real implementation, you'd use a QR scanner library like 'react-qr-scanner'
      // For demo purposes, we'll simulate scanning
      setTimeout(() => {
        // Simulate successful scan of bin A01-01-01
        const scannedBinData = JSON.stringify({
          type: "bin_location",
          bin_id: "A01-01-01",
          zone: "A",
          capacity: "1000kg",
          status: "available"
        });
        handleQRScan(scannedBinData);
      }, 2000);
      
    } catch (err) {
      setCameraPermission(false);
      alert('Camera permission denied or not available. Please use manual selection.');
    }
  };

  const handleQRScan = (scannedData: string) => {
    try {
      const data = JSON.parse(scannedData);
      if (data.type === 'bin_location') {
        setPutawayForm({...putawayForm, selectedBin: data.bin_id, scannerActive: false});
        alert(`Bin location scanned: ${data.bin_id}`);
      } else {
        alert('Invalid QR code. Please scan a bin location QR code.');
      }
    } catch (err) {
      alert('Unable to read QR code data.');
    }
  };

  const stopScanner = () => {
    setPutawayForm({...putawayForm, scannerActive: false});
  };
    if (!putawayForm.selectedBin) {
      alert('Please select a bin location.');
      return;
    }
    
    // Update the row with the selected bin location
    const updatedData = asnGridData.map(row => {
      if (row.ASN_CODE === putawayForm.data?.ASN_CODE && row.PALLET_ID === putawayForm.data?.PALLET_ID) {
        return {
          ...row,
          PALLET_CONFIG: `${putawayForm.selectedBin} - ${row.PALLET_CONFIG || 'Standard'}`,
          UPDATE_TIME: new Date().toLocaleString(),
          isSaved: false
        };
      }
      return row;
    });
    
    setAsnGridData(updatedData);
    alert(`Item successfully put away to bin: ${putawayForm.selectedBin}`);
    closePutawayForm();
  };

  // Generate QR code data URL
  const generateQRCode = (data: string): string => {
    // Simple QR code generation using Google Charts API as fallback
    const encodedData = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedData}`;
  };

  // Generate pallet QR data
  const generatePalletQRData = (rowData: ASNRow): string => {
    return JSON.stringify({
      type: "pallet",
      pallet_id: rowData.PALLET_ID,
      asn_code: rowData.ASN_CODE,
      item_code: rowData.ITEM_CODE,
      quantity: rowData.ITEM_QTY_KG,
      uom: rowData.UOM,
      supplier: rowData.SUPPLIER
    });
  };

  // Scanner functions
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraPermission(true);
      setPutawayForm({...putawayForm, scannerActive: true});
      
      // In a real implementation, you'd use a QR scanner library like 'react-qr-scanner'
      // For demo purposes, we'll simulate scanning
      setTimeout(() => {
        // Simulate successful scan of bin A01-01-01
        const scannedBinData = JSON.stringify({
          type: "bin_location",
          bin_id: "A01-01-01",
          zone: "A",
          capacity: "1000kg",
          status: "available"
        });
        handleQRScan(scannedBinData);
      }, 2000);
      
    } catch (err) {
      setCameraPermission(false);
      alert('Camera permission denied or not available. Please use manual selection.');
    }
  };

  const handleQRScan = (scannedData: string) => {
    try {
      const data = JSON.parse(scannedData);
      if (data.type === 'bin_location') {
        setPutawayForm({...putawayForm, selectedBin: data.bin_id, scannerActive: false});
        alert(`Bin location scanned: ${data.bin_id}`);
      } else {
        alert('Invalid QR code. Please scan a bin location QR code.');
      }
    } catch (err) {
      alert('Unable to read QR code data.');
    }
  };

  const stopScanner = () => {
    setPutawayForm({...putawayForm, scannerActive: false});
  };

  // Function to handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle keyboard shortcuts if the event is not from an input field
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
      return;
    }
    
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      handlePaste();
    }
  };

  // Filter data based on status and search query
  const filteredData = asnGridData.filter(row => {
    // Status filter
    const statusMatch = showOnlyDrafts ? row.ASN_STATUS === 'Draft' : 
                       statusFilter === 'all' ? true : row.ASN_STATUS === statusFilter;
    
    // Search filter
    const searchMatch = searchQuery.length === 0 || 
                       Object.values(row).some(value => 
                         value && typeof value === 'string' && 
                         value.toLowerCase().includes(searchQuery.toLowerCase())
                       );
    
    return statusMatch && searchMatch;
  });

  // Helper function to update a row and mark it as unsaved
  const updateRowField = (originalIndex: number, field: string, value: any) => {
    const newData = [...asnGridData];
    newData[originalIndex] = { 
      ...newData[originalIndex], 
      [field]: value,
      isSaved: false, // Mark as unsaved when edited
      UPDATE_TIME: new Date().toLocaleString() // Update timestamp
    };
    setAsnGridData(newData);
  };

  // Toggle row selection
  const toggleRowSelection = (palletIdOrTempId: string, rowIndex?: number) => {
    // Use combination of PALLET_ID/tempId and row index for unique identification
    // since multiple rows can now share the same ASN_CODE
    const identifier = `${palletIdOrTempId || 'temp'}-${rowIndex}`;
    setSelectedRows(prev => 
      prev.includes(identifier) ? prev.filter(code => code !== identifier) : [...prev, identifier]
    );
  };

  // Search functionality
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      // Generate search suggestions from all data fields
      const suggestions = new Set<string>();
      asnGridData.forEach(row => {
        Object.values(row).forEach(value => {
          if (value && typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(value);
          }
        });
      });
      setSearchSuggestions(Array.from(suggestions).slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    
    const newData = asnGridData.filter((row, index) => {
      const rowIdentifier = `${row.ASN_CODE || 'temp'}-${index}`;
      return !selectedRows.includes(rowIdentifier);
    });
    
    setAsnGridData(newData);
    setSelectedRows([]);
    alert(`Deleted ${selectedRows.length} selected rows successfully!`);
  };

  // Bulk operations for selected rows
  const handleBulkConfirm = () => {
    const newData = [...asnGridData];
    selectedRows.forEach(asnCode => {
      const rowIndex = newData.findIndex(row => row.ASN_CODE === asnCode);
      if (rowIndex !== -1 && newData[rowIndex].ASN_STATUS === 'Draft') {
        newData[rowIndex] = { ...newData[rowIndex], ASN_STATUS: 'In Progress', UPDATE_TIME: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      }
    });
    setAsnGridData(newData);
    setSelectedRows([]);
    alert(`Confirmed ${selectedRows.length} rows successfully!`);
  };

  const handleBulkDelete = () => {
    const newData = asnGridData.filter(row => !selectedRows.includes(row.ASN_CODE || ''));
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
            </Box>
            
            {/* Default Values for New Rows */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Default Values:
              </Typography>
              <Autocomplete
                size="small"
                options={suppliers}
                getOptionLabel={(option) => option.supplier_name}
                value={suppliers.find(s => s.supplier_name === defaultSupplier) || null}
                onChange={(event, newValue) => {
                  setDefaultSupplier(newValue ? newValue.supplier_name : '');
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Default Supplier" sx={{ minWidth: '200px' }} />
                )}
                sx={{ minWidth: '250px' }}
              />
              <TextField
                size="small"
                label="Default PO Number"
                value={defaultPONumber}
                onChange={(e) => setDefaultPONumber(e.target.value)}
                sx={{ minWidth: '200px' }}
                placeholder="e.g., PO-20251119-001"
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: '300px' }}>
                These values will be automatically filled for all new rows added
              </Typography>
            </Box>
            
            {/* Search Bar and Action Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Bar with Autocomplete */}
              <Box sx={{ position: 'relative', minWidth: '300px' }}>
                <TextField
                  label="Search ASN Records"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton onClick={clearSearch} size="small">
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: '300px' }}
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        sx={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          borderRadius: 0,
                          justifyContent: 'flex-start',
                          textTransform: 'none'
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </Paper>
                )}
              </Box>

              {/* Conditional Action Dropdown or Add/Remove Buttons */}
              {selectedRows.length > 0 ? (
                <FormControl size="small" sx={{ minWidth: '120px' }}>
                  <InputLabel>Action</InputLabel>
                  <Select
                    label="Action"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value === 'delete') {
                        handleDeleteSelected();
                      }
                    }}
                  >
                    <MenuItem value="delete">
                      <Delete sx={{ mr: 1 }} />
                      Delete Selected ({selectedRows.length})
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <>
                  <TextField
                    size="small"
                    type="number"
                    value={rowsToAdd}
                    onChange={(e) => setRowsToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 50, style: { width: '60px' } }}
                    sx={{ width: '80px' }}
                  />
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
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleRemoveRows}
                    disabled={lastAddedRowsCount === 0}
                  >
                    Remove Last {lastAddedRowsCount} Row{lastAddedRowsCount !== 1 ? 's' : ''}
                  </Button>
                </>
              )}

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
            
            <Alert severity="success" sx={{ mb: 2 }}>
              🎯 Enhanced Excel-like table: Click cells to edit, use checkboxes to select rows, filter by status, Ctrl+V to paste from Excel!
              <br />📋 Visual Indicators: Orange border = Draft, Blue background = Receiving, Yellow border = PutAway, Green border = Completed
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
                    <th style={{ width: '70px' }}>☑💾</th>
                    <th>ASN Status</th>
                    <th>Create Time</th>
                    <th>Update Time</th>
                    <th>ASN Code</th>
                    <th>Supplier</th>
                    <th>PO No</th>
                    <th>Item Code</th>
                    <th>Item Description</th>
                    <th>Item Qty</th>
                    <th>ASN UOM</th>
                    <th>Actual Qty</th>
                    <th>Item Weight (KG)</th>
                    <th>Pallet Config</th>
                    <th>Pallet ID</th>
                    <th>MFG Date</th>
                    <th>EXP Date</th>
                    <th>Batch No</th>
                    <th>Shortage Qty</th>
                    <th>More Qty</th>
                    <th>Damage Qty</th>
                    <th>Item Cost</th>
                    <th>Goods Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, filteredIndex) => {
                    // Find the original index in asnGridData for state updates
                    // Use PALLET_ID as unique identifier since ASN_CODE can be duplicated
                    const originalIndex = asnGridData.findIndex(originalRow => 
                      originalRow.PALLET_ID === row.PALLET_ID ||
                      (originalRow._tempId && originalRow._tempId === row._tempId) ||
                      (originalRow === row) // Fallback for exact object match
                    );
                    
                    const isDraft = row.ASN_STATUS === 'Draft';
                    const isReceiving = row.ASN_STATUS === 'Receiving';
                    const isPutAway = row.ASN_STATUS === 'PutAway';
                    const isCompleted = row.ASN_STATUS === 'Completed';
                    const rowIdentifier = `${row.PALLET_ID || row._tempId || 'temp'}-${originalIndex}`;
                    const isSelected = selectedRows.includes(rowIdentifier);
                    
                    // Determine background color and border
                    let bgColor = filteredIndex % 2 === 0 ? '#fafafa' : 'white';
                    let borderStyle = '4px solid transparent';
                    
                    if (isSelected) {
                      bgColor = '#e3f2fd'; // Blue background for selected
                    }
                    
                    // Set border colors based on status
                    if (isDraft) {
                      borderStyle = '4px solid #ff9800'; // Orange border for Draft
                    } else if (isReceiving) {
                      borderStyle = '4px solid #2196f3'; // Blue border for Receiving
                    } else if (isPutAway) {
                      borderStyle = '4px solid #ffeb3b'; // Yellow border for PutAway
                    } else if (isCompleted) {
                      borderStyle = '4px solid #4caf50'; // Green border for Completed
                    }
                    
                    return (
                      <tr key={rowIdentifier} style={{ 
                        backgroundColor: bgColor,
                        borderLeft: borderStyle
                      }}>
                        {/* Selection Checkbox with Save Status */}
                        <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleRowSelection(row.PALLET_ID || row._tempId || '', originalIndex)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span 
                            style={{ 
                              fontSize: '12px', 
                              color: row.isSaved ? '#4caf50' : '#ff9800',
                              fontWeight: 'bold'
                            }}
                            title={row.isSaved ? 'Saved to database' : 'Not yet saved'}
                          >
                            {row.isSaved ? '✓' : '●'}
                          </span>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: row.ASN_STATUS === 'Receiving' ? 'pointer' : 'not-allowed',
                              color: row.ASN_STATUS === 'Receiving' ? '#1976d2' : '#ccc',
                              fontSize: '14px',
                              padding: '2px',
                              opacity: row.ASN_STATUS === 'Receiving' ? 1 : 0.5
                            }}
                            disabled={row.ASN_STATUS !== 'Receiving'}
                            onClick={() => {
                              if (row.ASN_STATUS === 'Receiving') {
                                handlePrintPreview(row);
                              }
                            }}
                            title={row.ASN_STATUS === 'Receiving' ? 'Print ASN' : 'Print only available for Receiving status'}
                          >
                            🖨️
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: row.ASN_STATUS === 'PutAway' ? 'pointer' : 'not-allowed',
                              color: row.ASN_STATUS === 'PutAway' ? '#ff9800' : '#ccc',
                              fontSize: '14px',
                              padding: '2px',
                              marginLeft: '2px',
                              opacity: row.ASN_STATUS === 'PutAway' ? 1 : 0.5
                            }}
                            disabled={row.ASN_STATUS !== 'PutAway'}
                            onClick={() => {
                              if (row.ASN_STATUS === 'PutAway') {
                                handlePutawayForm(row);
                              }
                            }}
                            title={row.ASN_STATUS === 'PutAway' ? 'PutAway Process' : 'PutAway only available for PutAway status'}
                          >
                            📦
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: row.ASN_STATUS === 'Completed' ? 'pointer' : 'not-allowed',
                              color: row.ASN_STATUS === 'Completed' ? '#4caf50' : '#ccc',
                              fontSize: '14px',
                              padding: '2px',
                              marginLeft: '2px',
                              opacity: row.ASN_STATUS === 'Completed' ? 1 : 0.5
                            }}
                            disabled={row.ASN_STATUS !== 'Completed'}
                            onClick={() => {
                              if (row.ASN_STATUS === 'Completed') {
                                alert(`Issuance Gatepass for ASN: ${row.ASN_CODE}`);
                              }
                            }}
                            title={row.ASN_STATUS === 'Completed' ? 'Issuance Gatepass' : 'Gatepass only available for Completed status'}
                          >
                            📋
                          </button>
                        </td>
                      {/* ASN Status */}
                      <td><select value={row.ASN_STATUS || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ASN_STATUS', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 0})} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="Draft">Draft</option>
                        <option value="Receiving">Receiving</option>
                        <option value="PutAway">PutAway</option>
                        <option value="Completed">Completed</option>
                      </select></td>
                      
                      {/* Create Time */}
                      <td><input type="text" value={row.CREATE_TIME || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'CREATE_TIME', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 1})} /></td>
                      
                      {/* Update Time */}
                      <td><input type="text" value={row.UPDATE_TIME || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'UPDATE_TIME', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 2})} /></td>
                      
                      {/* ASN Code */}
                      <td><input type="text" value={row.ASN_CODE || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ASN_CODE', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 3})} /></td>
                      
                      {/* Supplier */}
                      <td><input type="text" value={row.SUPPLIER || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'SUPPLIER', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 4})} /></td>
                      
                      {/* PO No */}
                      <td><input type="text" value={row.PO_NO || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'PO_NO', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 5})} /></td>
                      
                      {/* Item Code */}
                      <td><input type="text" value={row.ITEM_CODE || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ITEM_CODE', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 6})} /></td>
                      
                      {/* Item Description */}
                      <td><input type="text" value={row.ITEM_DESCRIPTION || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ITEM_DESCRIPTION', e.target.value);
                      }} /></td>
                      
                      {/* Item Qty (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_QTY_KG || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ITEM_QTY_KG', parseFloat(e.target.value) || 0);
                      }} /></td>
                      
                      {/* UOM */}
                      <td><select value={row.UOM || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'UOM', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 9})} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="KG">KG</option>
                        <option value="L">L</option>
                        <option value="PCS">PCS</option>
                        <option value="BOX">BOX</option>
                        <option value="CASE">CASE</option>
                      </select></td>
                      
                      {/* Actual Qty */}
                      <td><input type="number" step="0.01" value={row.ACTUAL_QTY || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ACTUAL_QTY', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 10})} /></td>
                      
                      {/* Item Weight (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_WEIGHT_KG || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ITEM_WEIGHT_KG', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 11})} /></td>
                      
                      {/* Pallet Config */}
                      <td><input type="text" value={row.PALLET_CONFIG || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'PALLET_CONFIG', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 12})} /></td>
                      
                      {/* Pallet ID */}
                      <td><input type="text" value={row.PALLET_ID || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'PALLET_ID', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 13})} /></td>
                      
                      {/* MFG Date */}
                      <td><input type="date" value={row.MFG_DATE || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'MFG_DATE', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 14})} /></td>
                      
                      {/* EXP Date */}
                      <td><input type="date" value={row.EXP_DATE || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'EXP_DATE', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 15})} /></td>
                      
                      {/* Batch No */}
                      <td><input type="text" value={row.BATCH_NO || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'BATCH_NO', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 16})} /></td>
                      
                      {/* Shortage Qty */}
                      <td><input type="number" step="0.01" value={row.SHORTAGE_QTY || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'SHORTAGE_QTY', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 17})} /></td>
                      
                      {/* More Qty */}
                      <td><input type="number" step="0.01" value={row.MORE_QTY || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'MORE_QTY', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 18})} /></td>
                      
                      {/* Damage Qty */}
                      <td><input type="number" step="0.01" value={row.DAMAGE_QTY || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'DAMAGE_QTY', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 19})} /></td>
                      
                      {/* Item Cost */}
                      <td><input type="number" step="0.01" value={row.ITEM_COST || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'ITEM_COST', parseFloat(e.target.value) || 0);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 20})} /></td>
                      
                      {/* Goods Remarks */}
                      <td><input type="text" value={row.GOODS_REMARKS || ''} onChange={(e) => {
                        updateRowField(originalIndex, 'GOODS_REMARKS', e.target.value);
                      }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 21})} /></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>

        {/* Print Preview Modal */}
        {printPreview.visible && printPreview.data && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90%',
              overflow: 'auto'
            }}>
              {/* Print Preview Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', printDisplay: 'none' }}>
                <h2 style={{ margin: 0 }}>Print Preview</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handlePrint}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🖨️ Print
                  </button>
                  <button 
                    onClick={closePrintPreview}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#666',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Print Document */}
              <div id="print-content" style={{
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.4'
              }}>
                {/* Document Title */}
                <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
                  <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>ADVANCE SHIP NOTICE (ASN)</h1>
                  <div style={{ fontSize: '16px', color: '#666' }}>Receiving Document</div>
                </div>

                {/* ASN Header Information */}
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <tr>
                        <td style={{ padding: '8px 0', fontWeight: 'bold', width: '120px' }}>ASN Code:</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>{printPreview.data.ASN_CODE || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Supplier:</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>{printPreview.data.SUPPLIER || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', fontWeight: 'bold' }}>PO No:</td>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>{printPreview.data.PO_NO || 'N/A'}</td>
                      </tr>
                    </table>
                  </div>
                  
                  {/* QR Code Section */}
                  <div style={{ marginLeft: '20px', textAlign: 'center', minWidth: '170px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Pallet QR Code</div>
                    <img 
                      src={generateQRCode(generatePalletQRData(printPreview.data))}
                      alt="Pallet QR Code"
                      style={{ width: '150px', height: '150px', border: '1px solid #ddd' }}
                    />
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Scan for pallet info</div>
                  </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>Items to Receive:</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Item Code</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Item Description</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Item Qty</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>ASN UOM</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Actual Qty</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Pallet ID</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>MFG Date</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>EXP Date</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Batch No</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>{printPreview.data.ITEM_CODE || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>{printPreview.data.ITEM_DESCRIPTION || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{printPreview.data.ITEM_QTY_KG || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{printPreview.data.UOM || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>&nbsp;</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>{printPreview.data.PALLET_ID || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>&nbsp;</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '12px' }}>&nbsp;</td>
                        <td style={{ border: '1px solid #000', padding: '8px', fontSize: '12px' }}>&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signature Area */}
                <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                  <h3 style={{ margin: '0 0 30px 0', fontSize: '16px', fontWeight: 'bold' }}>Operator Verification:</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderBottom: '1px solid #000', height: '60px', marginBottom: '5px' }}></div>
                      <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Received By (Signature)</div>
                    </div>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderBottom: '1px solid #000', height: '60px', marginBottom: '5px' }}></div>
                      <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Date & Time</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
                  <p>This document serves as proof of receipt for the above mentioned items.</p>
                  <p>Please ensure all items are inspected before signing.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Putaway Form Modal */}
        {putawayForm.visible && putawayForm.data && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90%',
              overflow: 'auto'
            }}>
              {/* Putaway Form Header */}
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#ff9800' }}>📦 PutAway Process</h2>
                <div style={{ fontSize: '14px', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <strong>ASN:</strong> {putawayForm.data.ASN_CODE} | <strong>Item:</strong> {putawayForm.data.ITEM_CODE} - {putawayForm.data.ITEM_DESCRIPTION}
                </div>
              </div>

              {/* Item Information */}
              <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>Item Details:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div><strong>Pallet ID:</strong> {putawayForm.data.PALLET_ID}</div>
                  <div><strong>Quantity:</strong> {putawayForm.data.ITEM_QTY_KG} {putawayForm.data.UOM}</div>
                  <div><strong>Weight:</strong> {putawayForm.data.ITEM_WEIGHT_KG} KG</div>
                  <div><strong>Supplier:</strong> {putawayForm.data.SUPPLIER}</div>
                </div>
              </div>

              {/* Bin Location Selection */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Select Bin Location: *
                </label>
                
                {/* QR Scanner Interface */}
                {putawayForm.scannerActive ? (
                  <div style={{ 
                    border: '2px dashed #ff9800', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    textAlign: 'center', 
                    backgroundColor: '#fff8e1',
                    marginBottom: '15px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800', marginBottom: '5px' }}>Scanning for Bin QR Code...</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Point your camera at the bin location QR code</div>
                    <button 
                      onClick={stopScanner}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Cancel Scan
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select 
                      value={putawayForm.selectedBin}
                      onChange={(e) => setPutawayForm({...putawayForm, selectedBin: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">-- Select Available Bin --</option>
                      {availableBins.map(bin => (
                        <option key={bin} value={bin}>{bin}</option>
                      ))}
                    </select>
                    <button 
                      onClick={startScanner}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      📷 Scan QR
                    </button>
                  </div>
                )}
              </div>

              {/* Bin Location Guide */}
              <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
                <strong>Bin Format:</strong> Zone-Aisle-Level (e.g., A01-01-01)
                <br />
                <strong>Zone A:</strong> Fast-moving items | <strong>Zone B:</strong> Medium-moving | <strong>Zone C:</strong> Slow-moving
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button 
                  onClick={closePutawayForm}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={executePutaway}
                  disabled={!putawayForm.selectedBin}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: putawayForm.selectedBin ? '#ff9800' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: putawayForm.selectedBin ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  📦 Execute PutAway
                </button>
              </div>
            </div>
          </div>
        )}


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
  SHORTAGE_QTY?: number;
  MORE_QTY?: number;
  DAMAGE_QTY?: number;
  ITEM_COST?: number;
  GOODS_REMARKS?: string;
  isSaved?: boolean; // Track if record is saved in database
  _tempId?: string; // Temporary unique identifier for proper row indexing
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