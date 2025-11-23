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
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
const SimpleInbound = ({ mode = 'inbound' }: { mode?: 'inbound' | 'outbound' }) => {
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
  const [dnBatchCounter, setDnBatchCounter] = useState(1); // Track DN batch number for outbound

  const [defaultSupplier, setDefaultSupplier] = useState(mode === 'outbound' ? 'Mercury Drug Corporation' : '');
  const [defaultPONumber, setDefaultPONumber] = useState('');
  
  // Outbound record generation states
  const [selectedBatchData, setSelectedBatchData] = useState(null);
  const [showRecordCountDialog, setShowRecordCountDialog] = useState(false);
  const [recordCountToGenerate, setRecordCountToGenerate] = useState(1);
  const [isGeneratingRecords, setIsGeneratingRecords] = useState(false);
  
  // Focus tracking for paste functionality
  const [focusedCell, setFocusedCell] = useState<{rowIndex: number, columnIndex: number} | null>(null);
  
  // Print preview state
  const [printPreview, setPrintPreview] = useState<{visible: boolean, data: ASNRow | null}>({visible: false, data: null});
  
  // Putaway form state
  const [putawayForm, setPutawayForm] = useState<{visible: boolean, data: ASNRow | null, selectedBin: string, scannerActive: boolean}>({visible: false, data: null, selectedBin: '', scannerActive: false});
  
  // QR Scanner state
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // Bin Setup state
  const [showBinSetup, setShowBinSetup] = useState(false);
  const [newBin, setNewBin] = useState({
    binCode: '',
    zone: '',
    aisle: '',
    level: '',
    capacity: '',
    maxWeight: '',
    binType: 'STORAGE',
    status: 'ACTIVE',
    temperature: 'AMBIENT',
    restricted: false,
    description: ''
  });
  
  // Bin locations with comprehensive properties
  const [binLocations, setBinLocations] = useState([
    {
      binCode: 'A01-01-01',
      zone: 'A',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 1000,
      maxWeight: 500,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Fast-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'A01-01-02',
      zone: 'A',
      aisle: '01',
      level: '01',
      position: '02',
      capacity: 1000,
      maxWeight: 500,
      currentWeight: 250,
      binType: 'STORAGE',
      status: 'OCCUPIED',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Fast-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: 'PALLET-001'
    },
    {
      binCode: 'B01-01-01',
      zone: 'B',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 800,
      maxWeight: 400,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Medium-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'C01-01-01',
      zone: 'C',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 600,
      maxWeight: 300,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'MAINTENANCE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Slow-moving storage bin - Under maintenance',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'COLD-01-01',
      zone: 'COLD',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 500,
      maxWeight: 300,
      currentWeight: 0,
      binType: 'COLD_STORAGE',
      status: 'ACTIVE',
      temperature: 'COLD',
      restricted: true,
      description: 'Cold storage for perishables',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    }
  ]);
  
  // Get available bins for putaway (excluding occupied/maintenance)
  const availableBins = binLocations
    .filter(bin => bin.status === 'ACTIVE' && !bin.occupiedBy)
    .map(bin => bin.binCode);
  
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

  // Customers data for outbound mode
  const customers = [
    {
      id: 1,
      customer_code: 'CUST001',
      customer_name: 'Mercury Drug Corporation'
    },
    {
      id: 2,
      customer_code: 'CUST002',
      customer_name: 'SM Supermarket'
    },
    {
      id: 3,
      customer_code: 'CUST003',
      customer_name: 'Robinsons Retail'
    },
    {
      id: 4,
      customer_code: 'CUST004',
      customer_name: 'Puregold Price Club'
    }
  ];
  
  // ASN Grid data for spreadsheet-style entry
  const [asnGridData, setAsnGridData] = useState<ASNRow[]>([
    {
      ASN_CODE: 'ASN-20251118-001',
      ASN_STATUS: 'Complete',
      SUPPLIER: 'ABC Trading Corp',
      PO_NO: 'PO-20251118-001',
      CREATE_TIME: '2025-11-18 08:00:00',
      UPDATE_TIME: '2025-11-18 14:30:00',
      ITEM_CODE: 'RICE-001',
      ITEM_DESCRIPTION: 'Premium Jasmine Rice 25kg',
      ITEM_QTY_KG: 25.0,
      UOM: 'KG',
      ACTUAL_QTY: 1000,
      ITEM_WEIGHT_KG: 25.0,
      PALLET_CONFIG: '4x4',
      PALLET_ID: 'PLT-001',
      MFG_DATE: '2025-10-15',
      EXP_DATE: '2026-10-15',
      BATCH_NO: 'BATCH-TEST-001',
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 2500.00,
      GOODS_REMARKS: 'Premium quality rice',
      isSaved: true
    },
    {
      ASN_CODE: 'ASN-20251118-002',
      ASN_STATUS: 'Complete',
      SUPPLIER: 'Metro Food Supply',
      PO_NO: 'PO-20251118-002',
      CREATE_TIME: '2025-11-18 09:30:00',
      UPDATE_TIME: '2025-11-18 13:45:00',
      ITEM_CODE: 'OIL-002',
      ITEM_DESCRIPTION: 'Sunflower Cooking Oil 1L Premium',
      ITEM_QTY_KG: 1.0,
      UOM: 'L',
      ACTUAL_QTY: 500,
      ITEM_WEIGHT_KG: 0.92,
      PALLET_CONFIG: '5x5',
      PALLET_ID: 'PLT-002',
      MFG_DATE: '2025-11-01',
      EXP_DATE: '2026-11-01',
      BATCH_NO: 'BATCH-TEST-001',
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 1625.00,
      GOODS_REMARKS: 'Premium cooking oil',
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
      ITEM_DESCRIPTION: 'Refined White Sugar 50kg Premium',
      ITEM_QTY_KG: 50.0,
      UOM: 'KG',
      ACTUAL_QTY: 100,
      ITEM_WEIGHT_KG: 50.0,
      PALLET_CONFIG: '3x3',
      PALLET_ID: 'PLT-003',
      MFG_DATE: '2025-11-10',
      EXP_DATE: '2027-11-10',
      BATCH_NO: 'BATCH-TEST-001',
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 5000.00,
      GOODS_REMARKS: 'Premium refined sugar',
      isSaved: true
    },
    {
      ASN_CODE: 'ASN-20251118-004',
      ASN_STATUS: 'Complete',
      SUPPLIER: 'ABC Trading Corp',
      PO_NO: 'PO-20251118-004',
      CREATE_TIME: '2025-11-18 11:00:00',
      UPDATE_TIME: '2025-11-18 18:20:00',
      ITEM_CODE: 'MED-004',
      ITEM_DESCRIPTION: 'Vitamin C Tablets 500mg',
      ITEM_QTY_KG: 10.0,
      UOM: 'KG',
      ACTUAL_QTY: 2000,
      ITEM_WEIGHT_KG: 10.0,
      PALLET_CONFIG: '2x2',
      PALLET_ID: 'PLT-004',
      MFG_DATE: '2025-11-08',
      EXP_DATE: '2027-11-08',
      BATCH_NO: 'BATCH-TEST-002',
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 8000.00,
      GOODS_REMARKS: 'High potency vitamin supplement',
      isSaved: true
    },
    {
      ASN_CODE: 'ASN-20251118-005',
      ASN_STATUS: 'Complete',
      SUPPLIER: 'Metro Food Supply',
      PO_NO: 'PO-20251118-005',
      CREATE_TIME: '2025-11-18 12:00:00',
      UPDATE_TIME: '2025-11-18 19:10:00',
      ITEM_CODE: 'FOOD-005',
      ITEM_DESCRIPTION: 'Corned Beef Premium 340g Can',
      ITEM_QTY_KG: 170.0,
      UOM: 'KG',
      ACTUAL_QTY: 500,
      ITEM_WEIGHT_KG: 170.0,
      PALLET_CONFIG: '4x5',
      PALLET_ID: 'PLT-005',
      MFG_DATE: '2025-11-12',
      EXP_DATE: '2027-05-12',
      BATCH_NO: 'BATCH-TEST-002',
      SHORTAGE_QTY: 0,
      MORE_QTY: 0,
      DAMAGE_QTY: 0,
      ITEM_COST: 8500.00,
      GOODS_REMARKS: 'Premium quality corned beef',
      isSaved: true
    }
  ]);

  // DN Grid data for outbound operations
  const [dnGridData, setDnGridData] = useState([
    {
      ID: 1,
      dn_code: 'DN20251123001',
      dr_number: 'DR-2024-001',
      customer: 'Mercury Drug Corporation',
      create_time: '2025-11-23 08:00:00',
      update_time: '2025-11-23 08:30:00',
      item_batch_no: 'BATCH-20251110-001',
      item_code: 'MED001',
      item_desc: 'Paracetamol 500mg Tablets',
      item_qty: 1000,
      pick_qty: 1000,
      picked_qty: 1000,
      item_mfg_date: '2025-11-01',
      item_exp_date: '2027-11-01',
      item_remarks: 'Good quality',
      intransit_qty: 1000,
      delivery_actual_qty: 950,
      delivery_shortage_qty: 50,
      delivery_more_qty: 0,
      delivery_damage_qty: 0,
      item_weight: 25.5,
      item_volume: 0.05,
      item_cost: 2500.00,
      driver: 'Juan Dela Cruz',
      plate_no: 'ABC-1234',
      route: 'Metro Manila',
      trucker: 'FastTrack Logistics',
      isSaved: true
    },
    {
      ID: 2,
      dn_code: 'DN20251123002',
      dr_number: 'DR-2024-002',
      customer: 'SM Supermarket',
      create_time: '2025-11-23 09:00:00',
      update_time: '2025-11-23 09:45:00',
      item_batch_no: 'BATCH-20251110-002',
      item_code: 'FOOD001',
      item_desc: 'Canned Sardines 155g',
      item_qty: 500,
      pick_qty: 500,
      picked_qty: 480,
      item_mfg_date: '2025-11-05',
      item_exp_date: '2026-11-05',
      item_remarks: 'Premium quality',
      intransit_qty: 480,
      delivery_actual_qty: 480,
      delivery_shortage_qty: 0,
      delivery_more_qty: 0,
      delivery_damage_qty: 20,
      item_weight: 74.4,
      item_volume: 0.12,
      item_cost: 1440.00,
      driver: 'Maria Santos',
      plate_no: 'XYZ-5678',
      route: 'Quezon City',
      trucker: 'QuickMove Express',
      isSaved: true
    }
  ]);

  // Get batch data from ASN records for outbound generation
  const getBatchDataFromASN = (batchCode) => {
    return asnGridData.filter(item => item.BATCH_NO === batchCode && item.ASN_STATUS === 'Complete');
  };

  // Handle batch selection for outbound record generation and auto-fill grid
  const handleBatchSelection = (batchCode) => {
    if (mode === 'outbound' && batchCode && defaultSupplier) {
      const batchData = getBatchDataFromASN(batchCode);
      console.log('Batch data found:', batchData); // Debug log
      if (batchData.length > 0) {
        // Auto-fill the DN grid with batch data
        const autoFilledRecords = batchData.map((batchItem, index) => {
          console.log('Processing batch item:', batchItem); // Debug log
          const today = new Date();
          const fullDate = today.getFullYear().toString() + 
                          (today.getMonth() + 1).toString().padStart(2, '0') + 
                          today.getDate().toString().padStart(2, '0');
          
          // Find existing DN codes for today to avoid duplicates
          const existingDNs = dnGridData.filter(row => 
            row.dn_code && row.dn_code.startsWith(`DN${fullDate}`)
          );
          const highestDNNumber = existingDNs.length > 0 ? 
            Math.max(...existingDNs.map(row => {
              const match = row.dn_code?.match(/DN\d{8}(\d+)$/);
              return match ? parseInt(match[1]) : 0;
            })) : 0;
          
          // Generate same DN code for all items in this batch (only increment once)
          const dnNumber = (highestDNNumber + 1).toString().padStart(3, '0');
          const dnCode = `DN${fullDate}${dnNumber}`;
          
          const newRecord = {
            ID: Date.now() + index,
            dn_code: dnCode,
            dr_number: '', // Blank DR number as requested
            customer: defaultSupplier,
            create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            update_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            item_batch_no: batchItem.BATCH_NO || '',
            item_code: batchItem.ITEM_CODE || '',
            item_desc: batchItem.ITEM_DESCRIPTION || '',
            item_qty: batchItem.ACTUAL_QTY || batchItem.ITEM_QTY_KG || 0,
            pick_qty: 0,
            picked_qty: 0,
            item_mfg_date: batchItem.MFG_DATE || '',
            item_exp_date: batchItem.EXP_DATE || '',
            item_remarks: batchItem.GOODS_REMARKS || 'Auto-filled from batch selection',
            in_transit: 0,
            delivered: 0,
            shortage: 0,
            excess: 0,
            damage: 0,
            item_weight: batchItem.ITEM_WEIGHT_KG || 0,
            item_volume: batchItem.ITEM_QTY_KG ? (batchItem.ITEM_QTY_KG * 0.001) : 0,
            item_cost: batchItem.ITEM_COST || 0,
            driver: '',
            plate_no: '',
            route: '',
            trucker: '',
            isSaved: false
          };
          console.log('Generated DN record:', newRecord); // Debug log
          return newRecord;
        });
        
        // Add auto-filled records to the TOP of existing DN grid data
        setDnGridData([...autoFilledRecords, ...dnGridData]);
        console.log('Added DN records to top of grid:', autoFilledRecords); // Debug log
        
        alert(`Auto-filled ${autoFilledRecords.length} DN records from batch ${batchCode}\\nItems: ${batchData.map(item => item.ITEM_CODE).join(', ')}`);
      } else {
        alert(`No items found for batch ${batchCode}`);
      }
    }
  };

  // Generate outbound records based on selected batch and count
  const generateOutboundRecords = () => {
    if (!selectedBatchData || recordCountToGenerate <= 0) return;

    setIsGeneratingRecords(true);
    const newRecords = [];
    const today = new Date();
    const fullDate = today.getFullYear().toString() + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0');

    // Find existing DN codes for today following ASN pattern
    const todayDNs = dnGridData.filter(row => 
      row.dn_code && row.dn_code.startsWith(`DN${fullDate}`)
    );

    // Find the highest DN number for today (following ASN pattern)
    let highestDNNumber = 0;
    todayDNs.forEach(row => {
      const match = row.dn_code?.match(/DN\d{8}(\d+)$/);
      if (match) {
        const dnNumber = parseInt(match[1]);
        if (dnNumber > highestDNNumber) {
          highestDNNumber = dnNumber;
        }
      }
    });

    // Generate a single DN code for all items in this batch
    const batchDNNumber = (highestDNNumber + 1).toString().padStart(3, '0');
    const batchDNCode = `DN${fullDate}${batchDNNumber}`; // Single DN code for the entire batch
    const batchDRNumber = `DR-${fullDate}-${batchDNNumber.padStart(3, '0')}`;

    // Create records for each item in the selected batch
    selectedBatchData.forEach((batchItem, batchIndex) => {
      for (let i = 1; i <= recordCountToGenerate; i++) {
        newRecords.push({
          ID: Date.now() + (batchIndex * recordCountToGenerate) + i,
          dn_code: batchDNCode, // Same DN code for all items in this batch
          dr_number: batchDRNumber,
          customer: defaultSupplier,
          create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          update_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          item_batch_no: batchItem.BATCH_NO || defaultPONumber,
          item_code: batchItem.ITEM_CODE || '',
          item_desc: batchItem.ITEM_DESCRIPTION || '',
          item_qty: batchItem.ACTUAL_QTY || batchItem.ITEM_QTY_KG || 0,
          pick_qty: 0,
          picked_qty: 0,
          item_mfg_date: batchItem.MFG_DATE || '',
          item_exp_date: batchItem.EXP_DATE || '',
          item_remarks: batchItem.GOODS_REMARKS || 'Generated from ASN batch',
          intransit_qty: 0,
          delivery_actual_qty: 0,
          delivery_shortage_qty: 0,
          delivery_more_qty: 0,
          delivery_damage_qty: 0,
          item_weight: batchItem.ITEM_WEIGHT_KG || 0,
          item_volume: batchItem.ITEM_QTY_KG ? (batchItem.ITEM_QTY_KG * 0.001) : 0, // Estimate volume
          item_cost: batchItem.ITEM_COST || 0,
          driver: '',
          plate_no: '',
          route: '',
          trucker: '',
          isSaved: false
        });
      }
    });

    // Add new records at the TOP of the DN grid
    setDnGridData([...newRecords, ...dnGridData]);
    
    // Reset states
    setShowRecordCountDialog(false);
    setSelectedBatchData(null);
    setRecordCountToGenerate(1);
    setIsGeneratingRecords(false);
    
    const totalRecords = newRecords.length;
    const itemCount = selectedBatchData.length;
    alert(`Successfully generated ${totalRecords} outbound records with DN Code: ${batchDNCode}\n(${recordCountToGenerate} per item × ${itemCount} items) for batch ${defaultPONumber}`);
  };
  const availableBatchNumbers = asnGridData
    .filter(item => item.ASN_STATUS === 'Complete')
    .map(item => item.BATCH_NO)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  // DN Grid column definitions for outbound operations
  const dnColumnDefs = [
    { field: 'ID', headerName: 'ID', width: 60, editable: true, type: 'numericColumn' },
    { field: 'dn_code', headerName: 'DN Code', width: 130, editable: true },
    { field: 'dr_number', headerName: 'DR Number', width: 120, editable: true },
    { field: 'customer', headerName: 'Customer', width: 150, editable: true },
    { field: 'create_time', headerName: 'Create Time', width: 150, editable: true },
    { field: 'update_time', headerName: 'Update Time', width: 150, editable: true },
    { field: 'item_batch_no', headerName: 'Batch No', width: 130, editable: true },
    { field: 'item_code', headerName: 'Item Code', width: 120, editable: true },
    { field: 'item_desc', headerName: 'Item Description', width: 180, editable: true },
    { field: 'item_qty', headerName: 'Item Qty', width: 100, editable: true, type: 'numericColumn' },
    { field: 'pick_qty', headerName: 'Pick Qty', width: 100, editable: true, type: 'numericColumn' },
    { field: 'picked_qty', headerName: 'Picked Qty', width: 110, editable: true, type: 'numericColumn' },
    { field: 'item_mfg_date', headerName: 'Mfg Date', width: 110, editable: true },
    { field: 'item_exp_date', headerName: 'Exp Date', width: 110, editable: true },
    { field: 'item_remarks', headerName: 'Remarks', width: 120, editable: true },
    { field: 'intransit_qty', headerName: 'In Transit Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'delivery_actual_qty', headerName: 'Delivered Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'delivery_shortage_qty', headerName: 'Shortage Qty', width: 120, editable: true, type: 'numericColumn' },
    { field: 'delivery_more_qty', headerName: 'Excess Qty', width: 110, editable: true, type: 'numericColumn' },
    { field: 'delivery_damage_qty', headerName: 'Damage Qty', width: 110, editable: true, type: 'numericColumn' },
    { field: 'item_weight', headerName: 'Weight (kg)', width: 110, editable: true, type: 'numericColumn' },
    { field: 'item_volume', headerName: 'Volume (m³)', width: 110, editable: true, type: 'numericColumn' },
    { field: 'item_cost', headerName: 'Cost', width: 100, editable: true, type: 'numericColumn' },
    { field: 'driver', headerName: 'Driver', width: 120, editable: true },
    { field: 'plate_no', headerName: 'Plate No', width: 100, editable: true },
    { field: 'route', headerName: 'Route', width: 120, editable: true },
    { field: 'trucker', headerName: 'Trucker', width: 150, editable: true }
  ];

  // AG Grid column definitions for ASN spreadsheet with comprehensive inbound fields
  const asnColumnDefs = [
    { field: 'ID', headerName: 'ID', width: 60, editable: true, type: 'numericColumn' },
    { field: 'ASN_CODE', headerName: 'ASN Code', width: 130, editable: true },
    { field: 'ASN_STATUS', headerName: 'ASN Status', width: 120, editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Draft', 'In Progress', 'Receiving', 'Complete', 'On Hold'] }
    },
    { field: 'SUPPLIER', headerName: mode === 'outbound' ? 'Customer' : 'Supplier', width: 150, editable: true },
    { field: 'PO_NO', headerName: mode === 'outbound' ? 'Reference Batch' : 'PO No', width: 120, editable: true },
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
  const handleSaveGrid = () => {
    if (mode === 'outbound') {
      // Save DN grid data
      const updatedData = dnGridData.map(row => ({
        ...row,
        isSaved: true,
        update_time: new Date().toISOString().slice(0, 19).replace('T', ' ') // Update the modification time
      }));
      
      setDnGridData(updatedData);
      console.log('Saving DN Grid Data:', updatedData);
      alert('DN data saved successfully! All records are now marked as saved in database.');
    } else {
      // Save ASN grid data
      const updatedData = asnGridData.map(row => ({
        ...row,
        isSaved: true,
        UPDATE_TIME: new Date().toLocaleString() // Update the modification time
      }));
      
      setAsnGridData(updatedData);
      console.log('Saving ASN Grid Data:', updatedData);
      alert('ASN data saved successfully! All records are now marked as saved in database.');
    }
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

  // Generate QR code data URL
  const generateQRCode = (data: string): string => {
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

  // Putaway form functions
  const handlePutawayForm = (rowData: ASNRow) => {
    setPutawayForm({visible: true, data: rowData, selectedBin: '', scannerActive: false});
  };

  // Close putaway form
  const closePutawayForm = () => {
    setPutawayForm({visible: false, data: null, selectedBin: '', scannerActive: false});
    setShowQRScanner(false);
  };

  // Simulate QR code scanning for bin locations
  const simulateQRScan = (binCode: string) => {
    setPutawayForm({...putawayForm, selectedBin: binCode});
    setShowQRScanner(false);
    
    // Show confirmation message
    alert(`QR Scanned! Bin location "${binCode}" selected.`);
  };
  
  // Add new bin location
  const addBinLocation = () => {
    if (!newBin.binCode || !newBin.zone || !newBin.aisle || !newBin.level) {
      alert('Please fill in all required fields (Bin Code, Zone, Aisle, Level)');
      return;
    }
    
    // Check for duplicate bin code
    if (binLocations.some(bin => bin.binCode === newBin.binCode)) {
      alert('Bin code already exists!');
      return;
    }
    
    const newBinLocation = {
      ...newBin,
      position: newBin.binCode.split('-')[2] || '01',
      capacity: parseInt(newBin.capacity) || 1000,
      maxWeight: parseInt(newBin.maxWeight) || 500,
      currentWeight: 0,
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    };
    
    setBinLocations([...binLocations, newBinLocation]);
    setNewBin({
      binCode: '',
      zone: '',
      aisle: '',
      level: '',
      capacity: '',
      maxWeight: '',
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: ''
    });
    
    alert(`Bin location "${newBin.binCode}" added successfully!`);
  };
  
  // Delete bin location
  const deleteBinLocation = (binCode: string) => {
    const bin = binLocations.find(b => b.binCode === binCode);
    if (bin?.occupiedBy) {
      alert('Cannot delete occupied bin location!');
      return;
    }
    
    if (confirm(`Are you sure you want to delete bin "${binCode}"?`)) {
      setBinLocations(binLocations.filter(b => b.binCode !== binCode));
    }
  };
  
  // Update bin status
  const updateBinStatus = (binCode: string, status: string) => {
    setBinLocations(binLocations.map(bin => 
      bin.binCode === binCode 
        ? {...bin, status, lastUpdated: new Date().toISOString()}
        : bin
    ));
  };

  // Execute putaway
  const executePutaway = () => {
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

  // Filter data based on status, search query, and selected batch
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

  // Filter DN data for outbound mode based on selected batch
  const filteredDNData = dnGridData.filter(row => {
    // Always show all records (don't filter by batch to show continuous adding)
    // If you want to filter by batch, uncomment the line below:
    // const batchMatch = !defaultPONumber || row.item_batch_no === defaultPONumber;
    const batchMatch = true; // Show all records regardless of selected batch
    
    // Search filter for DN data
    const searchMatch = searchQuery.length === 0 || 
                       Object.values(row).some(value => 
                         value && typeof value === 'string' && 
                         value.toLowerCase().includes(searchQuery.toLowerCase())
                       );
    
    return batchMatch && searchMatch;
  });

  // Helper function to update a row and mark it as unsaved
  const updateRowField = (originalIndex: number, field: string, value: any) => {
    if (mode === 'outbound') {
      const newData = [...dnGridData];
      newData[originalIndex] = { 
        ...newData[originalIndex], 
        [field]: value,
        isSaved: false, // Mark as unsaved when edited
        update_time: new Date().toISOString().slice(0, 19).replace('T', ' ') // Update timestamp
      };
      setDnGridData(newData);
    } else {
      const newData = [...asnGridData];
      newData[originalIndex] = { 
        ...newData[originalIndex], 
        [field]: value,
        isSaved: false, // Mark as unsaved when edited
        UPDATE_TIME: new Date().toLocaleString() // Update timestamp
      };
      setAsnGridData(newData);
    }
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
      <Typography variant="h4" gutterBottom>
        {mode === 'outbound' ? '📦 Outbound Process - Shipment Workflow' : '📤 Inbound Process - ASN Workflow'}
      </Typography>
      <Typography paragraph>
        {mode === 'outbound' 
          ? 'Complete shipment workflow from order to dispatch with picking and shipping processes.'
          : 'Complete ASN workflow from creation to inventory insertion with receiving and putaway processes.'
        }
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">
            {mode === 'outbound' ? 'Shipment Workflow Progress' : 'ASN Workflow Progress'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            {mode === 'outbound' ? (
              <>
                <Chip label="1. Order Processing" color="success" />
                <Chip label="2. Picking" color="info" />
                <Chip label="3. Packing" color="warning" />
                <Chip label="4. Shipping" color="default" />
              </>
            ) : (
              <>
                <Chip label="1. ASN Creation" color="success" />
                <Chip label="2. Physical Receiving" color="info" />
                <Chip label="3. Putaway Process" color="warning" />
                <Chip label="4. Inventory Insertion" color="default" />
              </>
            )}
          </Box>

        </CardContent>
      </Card>

      {/* Record Count Dialog for Outbound */}
      {mode === 'outbound' && (
        <Dialog open={showRecordCountDialog} onClose={() => setShowRecordCountDialog(false)}>
          <DialogTitle>Generate Outbound Records</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Batch Details:</strong><br/>
              Customer: <strong>{defaultSupplier}</strong><br/>
              Selected Batch: <strong>{defaultPONumber}</strong><br/>
              Items found in this batch: <strong>{selectedBatchData?.length || 0}</strong>
              {selectedBatchData && selectedBatchData.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Items to be included:</Typography>
                  {selectedBatchData.map((item, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 0.5, fontSize: '0.85rem' }}>
                      <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                        {index + 1}. {item.ITEM_CODE}: {item.ITEM_DESCRIPTION}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Qty: {item.ACTUAL_QTY || 0} | Weight: {item.ITEM_WEIGHT_KG || 0}kg | Cost: ₱{(item.ITEM_COST || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        MFG: {item.MFG_DATE} | EXP: {item.EXP_DATE}
                      </Typography>
                    </Box>
                  ))}
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'primary.main' }}>
                    All items will share the same DN code for this batch.
                  </Typography>
                </Box>
              )}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Number of records to generate"
              type="number"
              fullWidth
              variant="outlined"
              value={recordCountToGenerate}
              onChange={(e) => setRecordCountToGenerate(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: 100 }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRecordCountDialog(false)}>Cancel</Button>
            <Button 
              onClick={generateOutboundRecords} 
              variant="contained"
              disabled={isGeneratingRecords || recordCountToGenerate <= 0}
            >
              {isGeneratingRecords ? 'Generating...' : 
                selectedBatchData && selectedBatchData.length > 0 
                  ? `Generate ${recordCountToGenerate * selectedBatchData.length} Records (${recordCountToGenerate} per item)`
                  : `Generate ${recordCountToGenerate} Records`
              }
            </Button>
          </DialogActions>
        </Dialog>
      )}



      {/* AG Grid ASN Management */}
      <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>ASN Management - Custom Excel-like Table</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowBinSetup(true)}
                  sx={{ 
                    borderColor: '#2196f3', 
                    color: '#2196f3',
                    '&:hover': { backgroundColor: '#e3f2fd' }
                  }}
                >
                  📦 Bin Setup
                </Button>
              </Box>
            </Box>
            
            {/* Default Values for New Rows */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Default Values:
              </Typography>
              <Autocomplete
                size="small"
                options={mode === 'outbound' ? customers : suppliers}
                getOptionLabel={(option) => mode === 'outbound' ? option.customer_name : option.supplier_name}
                value={mode === 'outbound' 
                  ? customers.find(c => c.customer_name === defaultSupplier) || null
                  : suppliers.find(s => s.supplier_name === defaultSupplier) || null
                }
                onChange={(event, newValue) => {
                  const newCustomerOrSupplier = newValue 
                    ? (mode === 'outbound' ? newValue.customer_name : newValue.supplier_name)
                    : '';
                  setDefaultSupplier(newCustomerOrSupplier);
                  
                  // Trigger batch selection if both customer and batch are selected in outbound mode
                  if (mode === 'outbound' && newCustomerOrSupplier && defaultPONumber) {
                    handleBatchSelection(defaultPONumber);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label={mode === 'outbound' ? 'Default Customer' : 'Default Supplier'} sx={{ minWidth: '200px' }} />
                )}
                sx={{ minWidth: '250px' }}
              />
              {mode === 'outbound' ? (
                <Autocomplete
                  size="small"
                  options={availableBatchNumbers}
                  value={defaultPONumber || null}
                  onChange={(event, newValue) => {
                    setDefaultPONumber(newValue || '');
                    if (newValue && defaultSupplier) {
                      handleBatchSelection(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Reference Batch No" sx={{ minWidth: '200px' }} />
                  )}
                  sx={{ minWidth: '200px' }}
                />
              ) : (
                <TextField
                  size="small"
                  label="Default PO Number"
                  value={defaultPONumber}
                  onChange={(e) => setDefaultPONumber(e.target.value)}
                  sx={{ minWidth: '200px' }}
                  placeholder="e.g., PO-20251119-001"
                />
              )}
              <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: '300px' }}>
                {mode === 'outbound' 
                  ? 'Select customer and batch to auto-fill DN grid with item details'
                  : 'These values will be automatically filled for all new rows added'
                }
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
              {mode === 'outbound' && (
                <Button 
                  variant="outlined" 
                  color="warning"
                  onClick={() => {
                    setDnGridData([]);
                    setDefaultPONumber('');
                    console.log('Grid cleared'); // Debug log
                    alert('DN grid cleared successfully!');
                  }}
                >
                  Clear Grid
                </Button>
              )}
              <Button 
                variant="contained" 
                color="success"
                onClick={handleSaveGrid}
              >
                {mode === 'outbound' ? 'Save DNs' : 'Save ASNs'}
              </Button>
            </Box>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              {mode === 'outbound' ? (
                <>
                  🎯 **Outbound Mode**: Select customer and batch number to auto-fill the DN grid with item details including batch numbers, item codes, descriptions, dates, and costs.
                  <br />📋 **Current View**: {filteredDNData.length} DN records {defaultPONumber ? `from batch ${defaultPONumber}` : 'displayed'}
                </>
              ) : (
                <>
                  🎯 Enhanced Excel-like table: Click cells to edit, use checkboxes to select rows, filter by status, Ctrl+V to paste from Excel!
                  <br />📋 Visual Indicators: Orange border = Draft, Blue background = Receiving, Yellow border = PutAway, Green border = Completed
                </>
              )}
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
                    {mode === 'outbound' ? (
                      <>
                        <th>DN Code</th>
                        <th>DR Number</th>
                        <th>Customer</th>
                        <th>Create Time</th>
                        <th>Update Time</th>
                        <th>Batch No</th>
                        <th>Item Code</th>
                        <th>Item Description</th>
                        <th>Item Qty</th>
                        <th>Pick Qty</th>
                        <th>Picked Qty</th>
                        <th>Mfg Date</th>
                        <th>Exp Date</th>
                        <th>Remarks</th>
                        <th>In Transit</th>
                        <th>Delivered</th>
                        <th>Shortage</th>
                        <th>Excess</th>
                        <th>Damage</th>
                        <th>Weight (kg)</th>
                        <th>Volume (m³)</th>
                        <th>Cost</th>
                        <th>Driver</th>
                        <th>Plate No</th>
                        <th>Route</th>
                        <th>Trucker</th>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(mode === 'outbound' ? filteredDNData : filteredData).map((row, filteredIndex) => {
                    // Find the original index in grid data for state updates
                    const originalIndex = mode === 'outbound' 
                      ? dnGridData.findIndex(originalRow => originalRow.ID === row.ID || originalRow === row)
                      : asnGridData.findIndex(originalRow => 
                          originalRow.PALLET_ID === row.PALLET_ID ||
                          (originalRow._tempId && originalRow._tempId === row._tempId) ||
                          (originalRow === row) // Fallback for exact object match
                        );
                    
                    const isDraft = mode === 'outbound' ? false : row.ASN_STATUS === 'Draft';
                    const isReceiving = mode === 'outbound' ? false : row.ASN_STATUS === 'Receiving';
                    const isPutAway = mode === 'outbound' ? false : row.ASN_STATUS === 'PutAway';
                    const isCompleted = mode === 'outbound' ? true : row.ASN_STATUS === 'Completed';
                    const rowIdentifier = mode === 'outbound' 
                      ? `${row.dn_code || 'temp'}-${originalIndex}`
                      : `${row.PALLET_ID || row._tempId || 'temp'}-${originalIndex}`;
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
                      
                      {mode === 'outbound' ? (
                        <>
                          {/* DN Code */}
                          <td><input type="text" value={row.dn_code || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'dn_code', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 1})} /></td>
                          
                          {/* DR Number */}
                          <td><input type="text" value={row.dr_number || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'dr_number', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 2})} /></td>
                          
                          {/* Customer */}
                          <td><input type="text" value={row.customer || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'customer', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 3})} /></td>
                          
                          {/* Create Time */}
                          <td><input type="text" value={row.create_time || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'create_time', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 4})} /></td>
                          
                          {/* Update Time */}
                          <td><input type="text" value={row.update_time || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'update_time', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 5})} /></td>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                      
                      {mode === 'outbound' ? (
                        <>
                          {/* Batch No */}
                          <td><input type="text" value={row.item_batch_no || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_batch_no', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 6})} /></td>
                          
                          {/* Item Code */}
                          <td><input type="text" value={row.item_code || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_code', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 7})} /></td>
                          
                          {/* Item Description */}
                          <td><input type="text" value={row.item_desc || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_desc', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 8})} /></td>
                          
                          {/* Item Qty */}
                          <td><input type="number" step="0.01" value={row.item_qty || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_qty', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 9})} /></td>
                          
                          {/* Pick Qty */}
                          <td><input type="number" step="0.01" value={row.pick_qty || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'pick_qty', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 10})} /></td>
                          
                          {/* Picked Qty */}
                          <td><input type="number" step="0.01" value={row.picked_qty || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'picked_qty', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 11})} /></td>
                          
                          {/* Mfg Date */}
                          <td><input type="date" value={row.item_mfg_date || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_mfg_date', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 12})} /></td>
                          
                          {/* Exp Date */}
                          <td><input type="date" value={row.item_exp_date || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_exp_date', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 13})} /></td>
                          
                          {/* Remarks */}
                          <td><input type="text" value={row.item_remarks || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_remarks', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 14})} /></td>
                          
                          {/* In Transit */}
                          <td><input type="number" step="0.01" value={row.in_transit || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'in_transit', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 15})} /></td>
                          
                          {/* Delivered */}
                          <td><input type="number" step="0.01" value={row.delivered || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'delivered', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 16})} /></td>
                          
                          {/* Shortage */}
                          <td><input type="number" step="0.01" value={row.shortage || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'shortage', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 17})} /></td>
                          
                          {/* Excess */}
                          <td><input type="number" step="0.01" value={row.excess || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'excess', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 18})} /></td>
                          
                          {/* Damage */}
                          <td><input type="number" step="0.01" value={row.damage || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'damage', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 19})} /></td>
                          
                          {/* Weight (kg) */}
                          <td><input type="number" step="0.01" value={row.item_weight || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_weight', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 20})} /></td>
                          
                          {/* Volume (m³) */}
                          <td><input type="number" step="0.01" value={row.item_volume || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_volume', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 21})} /></td>
                          
                          {/* Cost */}
                          <td><input type="number" step="0.01" value={row.item_cost || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'item_cost', parseFloat(e.target.value) || 0);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 22})} /></td>
                          
                          {/* Driver */}
                          <td><input type="text" value={row.driver || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'driver', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 23})} /></td>
                          
                          {/* Plate No */}
                          <td><input type="text" value={row.plate_no || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'plate_no', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 24})} /></td>
                          
                          {/* Route */}
                          <td><input type="text" value={row.route || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'route', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 25})} /></td>
                          
                          {/* Trucker */}
                          <td><input type="text" value={row.trucker || ''} onChange={(e) => {
                            updateRowField(originalIndex, 'trucker', e.target.value);
                          }} onFocus={() => setFocusedCell({rowIndex: originalIndex, columnIndex: 26})} /></td>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                <select 
                  value={putawayForm.selectedBin}
                  onChange={(e) => setPutawayForm({...putawayForm, selectedBin: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Select Available Bin --</option>
                  {binLocations
                    .filter(bin => bin.status === 'ACTIVE' && !bin.occupiedBy)
                    .map(bin => (
                    <option key={bin.binCode} value={bin.binCode}>
                      {bin.binCode} - {bin.binType} (Cap: {bin.capacity}, Max: {bin.maxWeight}kg) - {bin.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Bin Information */}
              {putawayForm.selectedBin && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', border: '2px solid #4caf50', borderRadius: '8px' }}>
                  {(() => {
                    const selectedBinInfo = binLocations.find(bin => bin.binCode === putawayForm.selectedBin);
                    return selectedBinInfo ? (
                      <div>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>📍 Selected Bin Information</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', fontSize: '12px' }}>
                          <div><strong>Zone:</strong> {selectedBinInfo.zone}</div>
                          <div><strong>Type:</strong> {selectedBinInfo.binType}</div>
                          <div><strong>Capacity:</strong> {selectedBinInfo.capacity} units</div>
                          <div><strong>Max Weight:</strong> {selectedBinInfo.maxWeight} kg</div>
                          <div><strong>Temperature:</strong> {selectedBinInfo.temperature}</div>
                          <div><strong>Restricted:</strong> {selectedBinInfo.restricted ? 'Yes' : 'No'}</div>
                        </div>
                        {selectedBinInfo.description && (
                          <div style={{ marginTop: '8px', fontSize: '11px', fontStyle: 'italic', color: '#555' }}>
                            {selectedBinInfo.description}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Bin Location Guide */}
              <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
                <strong>Bin Format:</strong> Zone-Aisle-Level (e.g., A01-01-01)
                <br />
                <strong>Zone A:</strong> Fast-moving items | <strong>Zone B:</strong> Medium-moving | <strong>Zone C:</strong> Slow-moving
              </div>

              {/* QR Scanner Section */}
              <div style={{ marginBottom: '20px', padding: '15px', border: '2px dashed #2196f3', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2196f3' }}>📱 Quick Scan Bin Location</span>
                  <button 
                    onClick={() => setShowQRScanner(!showQRScanner)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: showQRScanner ? '#ff5722' : '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {showQRScanner ? '❌ Close Scanner' : '📷 Open QR Scanner'}
                  </button>
                </div>
                
                {showQRScanner && (
                  <div style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    padding: '15px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      backgroundColor: '#263238', 
                      color: 'white', 
                      padding: '60px 20px', 
                      borderRadius: '4px',
                      marginBottom: '10px',
                      border: '3px solid #2196f3',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '10px' }}>📹 Camera View</div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>Position QR code within frame</div>
                      
                      {/* Scanning frame overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        border: '3px solid #00e676',
                        borderRadius: '8px',
                        boxShadow: '0 0 0 2px rgba(0, 230, 118, 0.3)'
                      }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {/* Demo scan buttons for available bins */}
                      {availableBins.slice(0, 3).map(bin => (
                        <button
                          key={bin}
                          onClick={() => simulateQRScan(bin)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}
                        >
                          📱 Demo Scan: {bin}
                        </button>
                      ))}
                    </div>
                    
                    <div style={{ marginTop: '10px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                      Demo: Click buttons above to simulate QR code scanning
                    </div>
                  </div>
                )}
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

        {/* Bin Setup Modal */}
        {showBinSetup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 1000,
            paddingTop: '20px',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f5f5f5', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#2196f3', fontSize: '24px' }}>📦 Bin Location Setup</h2>
                <button 
                  onClick={() => setShowBinSetup(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Add New Bin Form */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #e9ecef' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>Add New Bin Location</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Bin Code: *
                    </label>
                    <input 
                      type="text"
                      value={newBin.binCode}
                      onChange={(e) => setNewBin({...newBin, binCode: e.target.value.toUpperCase()})}
                      placeholder="A01-01-01"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Zone: *
                    </label>
                    <select
                      value={newBin.zone}
                      onChange={(e) => setNewBin({...newBin, zone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Zone</option>
                      <option value="A">A - Fast Moving</option>
                      <option value="B">B - Medium Moving</option>
                      <option value="C">C - Slow Moving</option>
                      <option value="COLD">COLD - Cold Storage</option>
                      <option value="HAZ">HAZ - Hazardous</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Aisle: *
                    </label>
                    <input 
                      type="text"
                      value={newBin.aisle}
                      onChange={(e) => setNewBin({...newBin, aisle: e.target.value})}
                      placeholder="01"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Level: *
                    </label>
                    <input 
                      type="text"
                      value={newBin.level}
                      onChange={(e) => setNewBin({...newBin, level: e.target.value})}
                      placeholder="01"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Capacity (units):
                    </label>
                    <input 
                      type="number"
                      value={newBin.capacity}
                      onChange={(e) => setNewBin({...newBin, capacity: e.target.value})}
                      placeholder="1000"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Max Weight (kg):
                    </label>
                    <input 
                      type="number"
                      value={newBin.maxWeight}
                      onChange={(e) => setNewBin({...newBin, maxWeight: e.target.value})}
                      placeholder="500"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Bin Type:
                    </label>
                    <select
                      value={newBin.binType}
                      onChange={(e) => setNewBin({...newBin, binType: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="STORAGE">Storage</option>
                      <option value="COLD_STORAGE">Cold Storage</option>
                      <option value="PICKING">Picking</option>
                      <option value="STAGING">Staging</option>
                      <option value="RECEIVING">Receiving</option>
                      <option value="SHIPPING">Shipping</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Temperature:
                    </label>
                    <select
                      value={newBin.temperature}
                      onChange={(e) => setNewBin({...newBin, temperature: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="AMBIENT">Ambient</option>
                      <option value="COLD">Cold (0-5°C)</option>
                      <option value="FROZEN">Frozen (-18°C)</option>
                      <option value="HEATED">Heated (20-25°C)</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={newBin.restricted}
                      onChange={(e) => setNewBin({...newBin, restricted: e.target.checked})}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Restricted Access</span>
                  </label>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                    Description:
                  </label>
                  <textarea 
                    value={newBin.description}
                    onChange={(e) => setNewBin({...newBin, description: e.target.value})}
                    placeholder="Optional description..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button 
                  onClick={addBinLocation}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Add Bin Location
                </button>
              </div>

              {/* Existing Bins List */}
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>Existing Bin Locations ({binLocations.length})</h3>
                
                <div style={{ maxHeight: '400px', overflow: 'auto', border: '2px solid #e9ecef', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Bin Code</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Zone</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Type</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Capacity</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Status</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Occupied By</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {binLocations.map(bin => (
                        <tr key={bin.binCode} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#2196f3' }}>{bin.binCode}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>{bin.zone}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>{bin.binType}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>{bin.capacity} units</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              backgroundColor: 
                                bin.status === 'ACTIVE' ? '#e8f5e8' :
                                bin.status === 'OCCUPIED' ? '#fff3cd' :
                                bin.status === 'MAINTENANCE' ? '#f8d7da' : '#e2e3e5',
                              color:
                                bin.status === 'ACTIVE' ? '#2e7d32' :
                                bin.status === 'OCCUPIED' ? '#856404' :
                                bin.status === 'MAINTENANCE' ? '#721c24' : '#495057'
                            }}>
                              {bin.status}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '11px' }}>
                            {bin.occupiedBy || '-'}
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <select
                                value={bin.status}
                                onChange={(e) => updateBinStatus(bin.binCode, e.target.value)}
                                disabled={bin.occupiedBy !== null}
                                style={{
                                  padding: '4px',
                                  fontSize: '10px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  minWidth: '80px'
                                }}
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="DISABLED">Disabled</option>
                              </select>
                              <button 
                                onClick={() => deleteBinLocation(bin.binCode)}
                                disabled={bin.occupiedBy !== null}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: bin.occupiedBy ? '#ccc' : '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  cursor: bin.occupiedBy ? 'not-allowed' : 'pointer',
                                  fontSize: '10px'
                                }}
                                title={bin.occupiedBy ? 'Cannot delete occupied bin' : 'Delete bin'}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div style={{ marginTop: '25px', textAlign: 'right' }}>
                <button 
                  onClick={() => setShowBinSetup(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


    </Box>
  );
};

// Comprehensive Inventory Management Module
const SimpleInventory = () => {
  const [activeInventoryTab, setActiveInventoryTab] = useState(0);

  const inventoryTabs = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Stock In', icon: '📥' },
    { label: 'Stock Out', icon: '📤' },
    { label: 'Stock Transfer', icon: '🔄' },
    { label: 'Stock Adjustment', icon: '⚖️' },
    { label: 'Inventory Lookup', icon: '🔍' },
    { label: 'Cycle Count', icon: '📋' },
    { label: 'Reports', icon: '📈' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>📦 Inventory Management</Typography>
      <Typography paragraph>
        Comprehensive inventory operations for Philippine WMS system including stock movements, adjustments, and cycle counting.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeInventoryTab} 
          onChange={(e, newValue) => setActiveInventoryTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
        >
          {inventoryTabs.map((tab, index) => (
            <Tab 
              key={index}
              label={`${tab.icon} ${tab.label}`} 
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Paper>

      <TabPanel value={activeInventoryTab} index={0}>
        <InventoryDashboard />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={1}>
        <StockIn />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={2}>
        <StockOut />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={3}>
        <StockTransfer />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={4}>
        <StockAdjustment />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={5}>
        <InventoryLookup />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={6}>
        <CycleCount />
      </TabPanel>
      
      <TabPanel value={activeInventoryTab} index={7}>
        <InventoryReports />
      </TabPanel>
    </Box>
  );
};

// Inventory Dashboard Component
const InventoryDashboard = () => {
  const inventoryStats = [
    { label: 'Total SKUs', value: '1,247', color: 'primary.main', icon: '📦' },
    { label: 'Total Value', value: '₱2.5M', color: 'success.main', icon: '💰' },
    { label: 'Low Stock Alerts', value: '23', color: 'warning.main', icon: '⚠️' },
    { label: 'Expired Items', value: '5', color: 'error.main', icon: '🚫' },
    { label: 'Fast Moving', value: '156', color: 'info.main', icon: '⚡' },
    { label: 'Slow Moving', value: '89', color: 'grey.600', icon: '🐌' }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📊 Inventory Overview</Typography>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {inventoryStats.map((stat, index) => (
          <Card key={index} sx={{ minWidth: 200, flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontSize: '2rem', mb: 1 }}>
                {stat.icon}
              </Typography>
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Alerts & Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
        {/* Low Stock Alerts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
            ⚠️ Low Stock Alerts
          </Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Min Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Cooking Oil 1L</TableCell>
                  <TableCell align="right">5</TableCell>
                  <TableCell align="right">20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rice Premium 5kg</TableCell>
                  <TableCell align="right">8</TableCell>
                  <TableCell align="right">15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Instant Noodles</TableCell>
                  <TableCell align="right">12</TableCell>
                  <TableCell align="right">25</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Expiry Alerts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
            🚫 Expiry Alerts
          </Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell align="right">Days to Expiry</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Milk Powder</TableCell>
                  <TableCell>BATCH-20241201</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Canned Goods</TableCell>
                  <TableCell>BATCH-20241205</TableCell>
                  <TableCell align="right" sx={{ color: 'warning.main' }}>15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Top Moving Items */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'info.main' }}>
            ⚡ Fast Moving Items
          </Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Weekly Movement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Rice Premium 25kg</TableCell>
                  <TableCell align="right">45 units</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sugar White 50kg</TableCell>
                  <TableCell align="right">38 units</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cooking Oil 1L</TableCell>
                  <TableCell align="right">32 units</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Inventory Value by Category */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
            💰 Value by Category
          </Typography>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Items</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Grains & Cereals</TableCell>
                  <TableCell align="right">156</TableCell>
                  <TableCell align="right">₱850,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cooking Oil</TableCell>
                  <TableCell align="right">89</TableCell>
                  <TableCell align="right">₱650,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Canned Goods</TableCell>
                  <TableCell align="right">234</TableCell>
                  <TableCell align="right">₱450,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

// Stock In Component
const StockIn = () => {
  const [stockInData, setStockInData] = useState([
    { id: 1, type: 'Purchase Order', refNumber: 'PO-2024-001', supplier: 'Metro Wholesale', items: 5, status: 'Pending', date: '2024-11-20' },
    { id: 2, type: 'ASN Receipt', refNumber: 'ASN-2024-058', supplier: 'SM Suppliers', items: 12, status: 'Received', date: '2024-11-19' },
    { id: 3, type: 'Return to Stock', refNumber: 'RTS-2024-003', supplier: 'Internal', items: 3, status: 'Processing', date: '2024-11-18' }
  ]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📥 Stock In Operations</Typography>
      <Typography paragraph>Manage all incoming stock including purchase orders, ASN receipts, and returns to stock.</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<span>📦</span>}>New Receipt</Button>
        <Button variant="outlined" startIcon={<span>📋</span>}>Import PO</Button>
        <Button variant="outlined" startIcon={<span>🔍</span>}>Search</Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockInData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.type}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.refNumber}</TableCell>
                <TableCell>{row.supplier}</TableCell>
                <TableCell align="right">{row.items}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={row.status} 
                    color={row.status === 'Received' ? 'success' : row.status === 'Pending' ? 'warning' : 'info'} 
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">Process</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Stock Out Component  
const StockOut = () => {
  const [stockOutData, setStockOutData] = useState([
    { id: 1, type: 'Sales Order', refNumber: 'SO-2024-156', customer: 'Metro Retail', items: 8, status: 'Picking', date: '2024-11-20' },
    { id: 2, type: 'Transfer Out', refNumber: 'TO-2024-023', customer: 'Branch Warehouse', items: 15, status: 'Ready', date: '2024-11-19' },
    { id: 3, type: 'Customer Return', refNumber: 'CR-2024-007', customer: 'Puregold', items: 2, status: 'Completed', date: '2024-11-18' }
  ]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📤 Stock Out Operations</Typography>
      <Typography paragraph>Manage all outgoing stock including sales orders, transfers, and customer returns.</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<span>📋</span>}>New Picking List</Button>
        <Button variant="outlined" startIcon={<span>🚚</span>}>Create Transfer</Button>
        <Button variant="outlined" startIcon={<span>🔍</span>}>Search</Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Customer/Destination</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockOutData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.type}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.refNumber}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell align="right">{row.items}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={row.status} 
                    color={row.status === 'Completed' ? 'success' : row.status === 'Picking' ? 'warning' : 'info'} 
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">Process</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Stock Transfer Component
const StockTransfer = () => {
  const [transfers, setTransfers] = useState([
    { id: 1, fromLocation: 'A01-01-01', toLocation: 'B02-03-01', item: 'Rice Premium 25kg', qty: 50, status: 'Pending', date: '2024-11-20' },
    { id: 2, fromLocation: 'C01-02-01', toLocation: 'A01-01-05', item: 'Sugar White 50kg', qty: 25, status: 'Completed', date: '2024-11-19' },
    { id: 3, fromLocation: 'B01-01-01', toLocation: 'COLD-01-01', item: 'Milk Powder', qty: 10, status: 'In Progress', date: '2024-11-18' }
  ]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>🔄 Stock Transfer</Typography>
      <Typography paragraph>Manage internal stock movements between bin locations and warehouses.</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<span>➕</span>}>New Transfer</Button>
        <Button variant="outlined" startIcon={<span>📋</span>}>Bulk Transfer</Button>
        <Button variant="outlined" startIcon={<span>📍</span>}>Location Map</Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From Location</TableCell>
              <TableCell>To Location</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.fromLocation}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{row.toLocation}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.qty}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={row.status} 
                    color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'info'} 
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">Execute</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Stock Adjustment Component
const StockAdjustment = () => {
  const [adjustments, setAdjustments] = useState([
    { id: 1, item: 'Cooking Oil 1L', location: 'B02-01-01', adjustmentType: 'Damage', currentQty: 25, adjustedQty: 20, reason: 'Leaking containers', date: '2024-11-20' },
    { id: 2, item: 'Rice Premium 5kg', location: 'A01-02-03', adjustmentType: 'Expired', currentQty: 50, adjustedQty: 45, reason: 'Past expiry date', date: '2024-11-19' },
    { id: 3, item: 'Sugar White 50kg', location: 'C01-01-01', adjustmentType: 'Repack', currentQty: 80, adjustedQty: 85, reason: 'UOM conversion', date: '2024-11-18' }
  ]);

  const adjustmentTypes = ['Damage', 'Expired', 'Lost', 'Found', 'Repack', 'Cycle Count', 'System Correction'];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>⚖️ Stock Adjustment</Typography>
      <Typography paragraph>Correct inventory quantities for damages, expiry, losses, and system discrepancies.</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<span>➕</span>}>New Adjustment</Button>
        <Button variant="outlined" startIcon={<span>📊</span>}>Variance Report</Button>
        <Button variant="outlined" startIcon={<span>🔍</span>}>Search</Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Current Qty</TableCell>
              <TableCell align="right">Adjusted Qty</TableCell>
              <TableCell align="right">Variance</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adjustments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.item}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.location}</TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={row.adjustmentType} 
                    color={row.adjustmentType === 'Damage' || row.adjustmentType === 'Expired' ? 'error' : 'info'} 
                  />
                </TableCell>
                <TableCell align="right">{row.currentQty}</TableCell>
                <TableCell align="right">{row.adjustedQty}</TableCell>
                <TableCell align="right" sx={{ 
                  color: row.adjustedQty > row.currentQty ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}>
                  {row.adjustedQty > row.currentQty ? '+' : ''}{row.adjustedQty - row.currentQty}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{row.reason}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">Approve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Inventory Lookup Component
const InventoryLookup = () => {
  const [searchType, setSearchType] = useState('item');
  const [searchValue, setSearchValue] = useState('');
  
  const inventoryData = [
    { 
      itemCode: 'ITM-001', 
      itemName: 'Rice Premium 25kg', 
      location: 'A01-01-01', 
      onHand: 150, 
      available: 125, 
      allocated: 25, 
      onOrder: 100,
      batch: 'BATCH-20240801', 
      expiry: '2025-08-01',
      serialNumber: '',
      lastMovement: '2024-11-19'
    },
    { 
      itemCode: 'ITM-002', 
      itemName: 'Cooking Oil 1L', 
      location: 'B02-01-01', 
      onHand: 25, 
      available: 5, 
      allocated: 20, 
      onOrder: 50,
      batch: 'BATCH-20241201', 
      expiry: '2025-12-01',
      serialNumber: '',
      lastMovement: '2024-11-20'
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>🔍 Inventory Lookup</Typography>
      <Typography paragraph>Real-time inventory inquiry by item, location, batch, or serial number.</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Search By</InputLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              label="Search By"
            >
              <MenuItem value="item">Item Code/Name</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="batch">Batch/Lot</MenuItem>
              <MenuItem value="serial">Serial Number</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            size="small"
            label="Search Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ minWidth: 250 }}
            placeholder={`Enter ${searchType}...`}
          />
          
          <Button variant="contained" startIcon={<span>🔍</span>}>
            Search
          </Button>
          
          <Button variant="outlined" onClick={() => setSearchValue('')}>
            Clear
          </Button>
        </Box>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">On Hand</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Allocated</TableCell>
              <TableCell align="right">On Order</TableCell>
              <TableCell>Batch/Lot</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Last Movement</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.itemCode}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.location}</TableCell>
                <TableCell align="right">{row.onHand}</TableCell>
                <TableCell align="right" sx={{ color: row.available < 10 ? 'error.main' : 'text.primary' }}>
                  {row.available}
                </TableCell>
                <TableCell align="right">{row.allocated}</TableCell>
                <TableCell align="right">{row.onOrder}</TableCell>
                <TableCell>{row.batch}</TableCell>
                <TableCell>{row.expiry}</TableCell>
                <TableCell>{row.lastMovement}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Cycle Count Component
const CycleCount = () => {
  const [countTasks, setCountTasks] = useState([
    { id: 1, zone: 'A', location: 'A01-01-01', item: 'Rice Premium 25kg', systemQty: 150, countedQty: null, status: 'Pending', assignedTo: 'John D.', dueDate: '2024-11-21' },
    { id: 2, zone: 'B', location: 'B02-01-01', item: 'Cooking Oil 1L', systemQty: 25, countedQty: 23, status: 'Variance', assignedTo: 'Maria S.', dueDate: '2024-11-20' },
    { id: 3, zone: 'C', location: 'C01-01-01', item: 'Sugar White 50kg', systemQty: 80, countedQty: 80, status: 'Matched', assignedTo: 'Pedro R.', dueDate: '2024-11-19' }
  ]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📋 Cycle Count</Typography>
      <Typography paragraph>Daily cycle counting tasks and physical inventory reconciliation.</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<span>➕</span>}>Generate Count Tasks</Button>
        <Button variant="outlined" startIcon={<span>📊</span>}>Count Schedule</Button>
        <Button variant="outlined" startIcon={<span>📱</span>}>Mobile App</Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="right">System Qty</TableCell>
              <TableCell align="right">Counted Qty</TableCell>
              <TableCell align="right">Variance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countTasks.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.zone}</TableCell>
                <TableCell sx={{ color: 'primary.main' }}>{row.location}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell align="right">{row.systemQty}</TableCell>
                <TableCell align="right">{row.countedQty || '-'}</TableCell>
                <TableCell align="right" sx={{ 
                  color: row.countedQty ? (row.countedQty === row.systemQty ? 'success.main' : 'error.main') : 'text.secondary',
                  fontWeight: row.countedQty && row.countedQty !== row.systemQty ? 'bold' : 'normal'
                }}>
                  {row.countedQty ? (row.countedQty - row.systemQty) : '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    label={row.status} 
                    color={row.status === 'Matched' ? 'success' : row.status === 'Variance' ? 'error' : 'warning'} 
                  />
                </TableCell>
                <TableCell>{row.assignedTo}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined">
                    {row.status === 'Pending' ? 'Count' : 'Review'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Inventory Reports Component
const InventoryReports = () => {
  const reports = [
    { name: 'Stock on Hand Report', description: 'Current inventory levels by item and location', icon: '📊', frequency: 'Real-time' },
    { name: 'Aging Report', description: 'Items approaching expiry dates (FEFO)', icon: '⏰', frequency: 'Daily' },
    { name: 'Movement Report', description: 'Inventory transactions and movements', icon: '🔄', frequency: 'Daily/Weekly' },
    { name: 'Fast/Slow Moving', description: 'Item velocity analysis', icon: '⚡', frequency: 'Monthly' },
    { name: 'Adjustment Report', description: 'Stock adjustments and variances', icon: '⚖️', frequency: 'Weekly' },
    { name: 'Variance Report', description: 'Cycle count variances and reconciliation', icon: '📋', frequency: 'Weekly' },
    { name: 'Lot/Batch Traceability', description: 'Track items by batch numbers', icon: '🔍', frequency: 'On-demand' },
    { name: 'Inventory Valuation', description: 'Total inventory value by category', icon: '💰', frequency: 'Monthly' }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📈 Inventory Reports</Typography>
      <Typography paragraph>Comprehensive reporting for inventory analysis and compliance.</Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 2 }}>
        {reports.map((report, index) => (
          <Card key={index} sx={{ p: 2, '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4">{report.icon}</Typography>
                <Box>
                  <Typography variant="h6">{report.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.frequency}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {report.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained">Generate</Button>
                <Button size="small" variant="outlined">Schedule</Button>
                <Button size="small" variant="text">Export</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

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
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setUploadStatus('❌ Please select a CSV or Excel file');
      return;
    }

    setUploadStatus('📤 Uploading and processing file...');
    
    setTimeout(() => {
      const newItems = [
        {
          id: Date.now() + 1,
          item_code: 'AMOXICILLIN-250MG',
          item_name: 'Amoxicillin 250mg Capsules',
          category: 'Pharmaceutical',
          subcategory: 'Antibiotic',
          unit_of_measure: 'CAPSULES',
          min_stock: 150,
          max_stock: 1500,
          reorder_level: 300,
          is_active: true,
          doh_registered: true,
          regulatory_code: 'DOH-REG-003'
        },
        {
          id: Date.now() + 2,
          item_code: 'COOKING-OIL-1L',
          item_name: 'Premium Cooking Oil 1L',
          category: 'Food',
          subcategory: 'Oil',
          unit_of_measure: 'BOTTLE',
          min_stock: 25,
          max_stock: 500,
          reorder_level: 50,
          is_active: true,
          doh_registered: false,
          regulatory_code: 'FDA-REG-004'
        }
      ];
      
      setItems([...items, ...newItems]);
      setUploadStatus(`✅ Successfully imported ${newItems.length} items from ${file.name}`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setUploadStatus(''), 5000);
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Item Code,Item Name,Category,Subcategory,UOM,Min Stock,Max Stock,Reorder Level,DOH Registered,Regulatory Code\\n"
      + "SAMPLE-001,Sample Item Name,Food,Grains,SACK,10,100,20,false,FDA-SAMPLE\\n"
      + "# Instructions: Fill in the item data and save as CSV or Excel file";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "item_master_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Upload Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          📤 Bulk Import Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
            id="item-file-upload"
          />
          <label htmlFor="item-file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<span>📁</span>}
              sx={{ mr: 1 }}
            >
              Choose File
            </Button>
          </label>
          <Button
            variant="outlined"
            onClick={downloadTemplate}
            startIcon={<span>📥</span>}
          >
            Download Template
          </Button>
          <Typography variant="body2" color="text.secondary">
            Supported: CSV, Excel (.xlsx, .xls)
          </Typography>
        </Box>
        {uploadStatus && (
          <Alert severity={uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : 'info'} sx={{ mt: 2 }}>
            {uploadStatus}
          </Alert>
        )}
      </Paper>

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
  
  // CSV/Excel Upload States
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('Please select a CSV or Excel file');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('Processing file...');
    
    // Simulate file processing
    setTimeout(() => {
      // In a real implementation, you would parse the CSV/Excel file here
      // For now, we'll simulate adding some sample data
      const newSuppliers = [
        {
          id: Date.now(),
          supplier_code: 'SUPP003',
          supplier_name: 'Uploaded Supplier Co.',
          business_type: 'Corporation',
          tin_number: '111-222-333-000',
          contact_person: 'Import Manager',
          email: 'imported@supplier.com',
          phone: '+63-2-8555-0123',
          address: 'Pasig City, Metro Manila',
          doh_license: 'DOH-LIC-003',
          is_active: true,
          rating: 'A-'
        }
      ];
      
      setSuppliers(prev => [...prev, ...newSuppliers]);
      setIsUploading(false);
      setUploadStatus(`Successfully imported ${newSuppliers.length} suppliers`);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setUploadStatus(''), 5000);
    }, 2000);
  };
  
  const downloadTemplate = () => {
    const headers = ['supplier_code', 'supplier_name', 'business_type', 'tin_number', 'contact_person', 'email', 'phone', 'address', 'doh_license', 'is_active', 'rating'];
    const sampleData = ['SUPP999', 'Sample Supplier Ltd.', 'Corporation', '999-888-777-000', 'John Sample', 'john@sample.com', '+63-2-8999-8888', 'Sample City, Metro Manila', 'DOH-LIC-999', 'true', 'A'];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "suppliers_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏭 Supplier Management</Typography>
        <Button variant="contained">+ Add New Supplier</Button>
      </Box>

      {/* Upload Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📤 Bulk Import Suppliers</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              startIcon={<span>📁</span>}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
            <Button
              variant="text"
              onClick={downloadTemplate}
              startIcon={<span>⬇️</span>}
            >
              Download Template
            </Button>
            {uploadStatus && (
              <Alert 
                severity={uploadStatus.includes('Successfully') ? 'success' : uploadStatus.includes('error') ? 'error' : 'info'}
                sx={{ mt: 1, width: '100%' }}
              >
                {uploadStatus}
              </Alert>
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Import suppliers from CSV or Excel files. Download the template for the correct format.
          </Typography>
        </CardContent>
      </Card>

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
  
  // CSV/Excel Upload States
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('Please select a CSV or Excel file');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('Processing file...');
    
    // Simulate file processing
    setTimeout(() => {
      const newCustomers = [
        {
          id: Date.now(),
          customer_code: 'CUST003',
          customer_name: 'Imported Customer Inc.',
          business_type: 'Wholesale',
          tin_number: '777-888-999-000',
          contact_person: 'Import Manager',
          email: 'imported@customer.com',
          phone: '+63-2-8777-8888',
          billing_address: 'Makati City, Metro Manila',
          delivery_address: 'Makati Warehouse',
          credit_limit: 1500000,
          credit_terms: 30,
          is_active: true
        }
      ];
      
      setCustomers(prev => [...prev, ...newCustomers]);
      setIsUploading(false);
      setUploadStatus(`Successfully imported ${newCustomers.length} customers`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setUploadStatus(''), 5000);
    }, 2000);
  };
  
  const downloadTemplate = () => {
    const headers = ['customer_code', 'customer_name', 'business_type', 'tin_number', 'contact_person', 'email', 'phone', 'billing_address', 'delivery_address', 'credit_limit', 'credit_terms', 'is_active'];
    const sampleData = ['CUST999', 'Sample Customer Ltd.', 'Retail', '999-777-555-000', 'Jane Sample', 'jane@sample.com', '+63-2-8999-7777', 'Sample City, Metro Manila', 'Same as billing', '1000000', '30', 'true'];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">👥 Customer Management</Typography>
        <Button variant="contained">+ Add New Customer</Button>
      </Box>

      {/* Upload Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📤 Bulk Import Customers</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              startIcon={<span>📁</span>}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
            <Button
              variant="text"
              onClick={downloadTemplate}
              startIcon={<span>⬇️</span>}
            >
              Download Template
            </Button>
            {uploadStatus && (
              <Alert 
                severity={uploadStatus.includes('Successfully') ? 'success' : uploadStatus.includes('error') ? 'error' : 'info'}
                sx={{ mt: 1, width: '100%' }}
              >
                {uploadStatus}
              </Alert>
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Import customers from CSV or Excel files. Download the template for the correct format.
          </Typography>
        </CardContent>
      </Card>

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
  
  // CSV/Excel Upload States
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('Please select a CSV or Excel file');
      return;
    }
    
    setIsUploading(true);
    setUploadStatus('Processing file...');
    
    // Simulate file processing
    setTimeout(() => {
      const newWarehouses = [
        {
          id: Date.now(),
          warehouse_code: 'WH003',
          warehouse_name: 'Imported Warehouse Facility',
          address: 'Import City, Metro Manila',
          manager: 'Import Manager',
          total_locations: 500,
          active_locations: 450,
          capacity_utilization: 68,
          temperature_controlled: true,
          is_active: true
        }
      ];
      
      setWarehouses(prev => [...prev, ...newWarehouses]);
      setIsUploading(false);
      setUploadStatus(`Successfully imported ${newWarehouses.length} warehouses`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setUploadStatus(''), 5000);
    }, 2000);
  };
  
  const downloadTemplate = () => {
    const headers = ['warehouse_code', 'warehouse_name', 'address', 'manager', 'total_locations', 'active_locations', 'capacity_utilization', 'temperature_controlled', 'is_active'];
    const sampleData = ['WH999', 'Sample Warehouse Center', 'Sample City, Philippines', 'Sample Manager', '1000', '900', '75', 'true', 'true'];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + sampleData.join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "warehouses_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏢 Warehouse Configuration</Typography>
        <Button variant="contained">+ Add New Warehouse</Button>
      </Box>

      {/* Upload Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📤 Bulk Import Warehouses</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              startIcon={<span>📁</span>}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
            <Button
              variant="text"
              onClick={downloadTemplate}
              startIcon={<span>⬇️</span>}
            >
              Download Template
            </Button>
            {uploadStatus && (
              <Alert 
                severity={uploadStatus.includes('Successfully') ? 'success' : uploadStatus.includes('error') ? 'error' : 'info'}
                sx={{ mt: 1, width: '100%' }}
              >
                {uploadStatus}
              </Alert>
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Import warehouses from CSV or Excel files. Download the template for the correct format.
          </Typography>
        </CardContent>
      </Card>

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

// Bin Location Setup Component  
const BinLocationSetup = () => {
  const [binLocations, setBinLocations] = useState([
    {
      binCode: 'A01-01-01',
      zone: 'A',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 1000,
      maxWeight: 500,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Fast-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'A01-01-02',
      zone: 'A',
      aisle: '01',
      level: '01',
      position: '02',
      capacity: 1000,
      maxWeight: 500,
      currentWeight: 250,
      binType: 'STORAGE',
      status: 'OCCUPIED',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Fast-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: 'PALLET-001'
    },
    {
      binCode: 'B01-01-01',
      zone: 'B',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 800,
      maxWeight: 400,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Medium-moving storage bin',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'C01-01-01',
      zone: 'C',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 600,
      maxWeight: 300,
      currentWeight: 0,
      binType: 'STORAGE',
      status: 'MAINTENANCE',
      temperature: 'AMBIENT',
      restricted: false,
      description: 'Slow-moving storage bin - Under maintenance',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    },
    {
      binCode: 'COLD-01-01',
      zone: 'COLD',
      aisle: '01',
      level: '01',
      position: '01',
      capacity: 500,
      maxWeight: 300,
      currentWeight: 0,
      binType: 'COLD_STORAGE',
      status: 'ACTIVE',
      temperature: 'COLD',
      restricted: true,
      description: 'Cold storage for perishables',
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    }
  ]);
  
  const [newBin, setNewBin] = useState({
    binCode: '',
    zone: '',
    aisle: '',
    level: '',
    capacity: '',
    maxWeight: '',
    binType: 'STORAGE',
    status: 'ACTIVE',
    temperature: 'AMBIENT',
    restricted: false,
    description: ''
  });

  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setUploadStatus('❌ Please select a CSV or Excel file');
      return;
    }

    setUploadStatus('📤 Uploading and processing file...');
    
    setTimeout(() => {
      const newBins = [
        {
          binCode: 'A02-01-01',
          zone: 'A',
          aisle: '02',
          level: '01',
          position: '01',
          capacity: 1000,
          maxWeight: 500,
          currentWeight: 0,
          binType: 'STORAGE',
          status: 'ACTIVE',
          temperature: 'AMBIENT',
          restricted: false,
          description: 'Fast-moving storage bin',
          lastUpdated: new Date().toISOString(),
          occupiedBy: null
        },
        {
          binCode: 'COLD-02-01',
          zone: 'COLD',
          aisle: '02',
          level: '01',
          position: '01',
          capacity: 500,
          maxWeight: 300,
          currentWeight: 0,
          binType: 'COLD_STORAGE',
          status: 'ACTIVE',
          temperature: 'COLD',
          restricted: true,
          description: 'Additional cold storage',
          lastUpdated: new Date().toISOString(),
          occupiedBy: null
        }
      ];
      
      setBinLocations([...binLocations, ...newBins]);
      setUploadStatus(`✅ Successfully imported ${newBins.length} bin locations from ${file.name}`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => setUploadStatus(''), 5000);
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Bin Code,Zone,Aisle,Level,Capacity,Max Weight,Bin Type,Temperature,Restricted,Description\n"
      + "A01-01-01,A,01,01,1000,500,STORAGE,AMBIENT,false,Sample bin description\n"
      + "# Instructions: Fill in the bin location data and save as CSV or Excel file";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bin_locations_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add new bin location
  const addBinLocation = () => {
    if (!newBin.binCode || !newBin.zone || !newBin.aisle || !newBin.level) {
      alert('Please fill in all required fields (Bin Code, Zone, Aisle, Level)');
      return;
    }
    
    // Check for duplicate bin code
    if (binLocations.some(bin => bin.binCode === newBin.binCode)) {
      alert('Bin code already exists!');
      return;
    }
    
    const newBinLocation = {
      ...newBin,
      position: newBin.binCode.split('-')[2] || '01',
      capacity: parseInt(newBin.capacity) || 1000,
      maxWeight: parseInt(newBin.maxWeight) || 500,
      currentWeight: 0,
      lastUpdated: new Date().toISOString(),
      occupiedBy: null
    };
    
    setBinLocations([...binLocations, newBinLocation]);
    setNewBin({
      binCode: '',
      zone: '',
      aisle: '',
      level: '',
      capacity: '',
      maxWeight: '',
      binType: 'STORAGE',
      status: 'ACTIVE',
      temperature: 'AMBIENT',
      restricted: false,
      description: ''
    });
    
    alert(`Bin location "${newBin.binCode}" added successfully!`);
  };
  
  // Delete bin location
  const deleteBinLocation = (binCode: string) => {
    const bin = binLocations.find(b => b.binCode === binCode);
    if (bin?.occupiedBy) {
      alert('Cannot delete occupied bin location!');
      return;
    }
    
    if (confirm(`Are you sure you want to delete bin "${binCode}"?`)) {
      setBinLocations(binLocations.filter(b => b.binCode !== binCode));
    }
  };
  
  // Update bin status
  const updateBinStatus = (binCode: string, status: string) => {
    setBinLocations(binLocations.map(bin => 
      bin.binCode === binCode 
        ? {...bin, status, lastUpdated: new Date().toISOString()}
        : bin
    ));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📍 Bin Location Management</Typography>
      <Typography paragraph>
        Manage warehouse bin locations with capacity tracking, status monitoring, and zone organization.
      </Typography>
      
      {/* Upload Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          📤 Bulk Import Bin Locations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
            id="bin-file-upload"
          />
          <label htmlFor="bin-file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<span>📁</span>}
              sx={{ mr: 1 }}
            >
              Choose File
            </Button>
          </label>
          <Button
            variant="outlined"
            onClick={downloadTemplate}
            startIcon={<span>📥</span>}
          >
            Download Template
          </Button>
          <Typography variant="body2" color="text.secondary">
            Supported: CSV, Excel (.xlsx, .xls)
          </Typography>
        </Box>
        {uploadStatus && (
          <Alert severity={uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : 'info'} sx={{ mt: 2 }}>
            {uploadStatus}
          </Alert>
        )}
      </Paper>
      
      {/* Add New Bin Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Bin Location</Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ minWidth: 200 }}>
            <TextField
              fullWidth
              label="Bin Code *"
              value={newBin.binCode}
              onChange={(e) => setNewBin({...newBin, binCode: e.target.value.toUpperCase()})}
              placeholder="A01-01-01"
              size="small"
            />
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Zone *</InputLabel>
              <Select
                value={newBin.zone}
                onChange={(e) => setNewBin({...newBin, zone: e.target.value})}
                label="Zone *"
              >
                <MenuItem value="">Select Zone</MenuItem>
                <MenuItem value="A">A - Fast Moving</MenuItem>
                <MenuItem value="B">B - Medium Moving</MenuItem>
                <MenuItem value="C">C - Slow Moving</MenuItem>
                <MenuItem value="COLD">COLD - Cold Storage</MenuItem>
                <MenuItem value="HAZ">HAZ - Hazardous</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ minWidth: 150 }}>
            <TextField
              fullWidth
              label="Aisle *"
              value={newBin.aisle}
              onChange={(e) => setNewBin({...newBin, aisle: e.target.value})}
              placeholder="01"
              size="small"
            />
          </Box>
          
          <Box sx={{ minWidth: 150 }}>
            <TextField
              fullWidth
              label="Level *"
              value={newBin.level}
              onChange={(e) => setNewBin({...newBin, level: e.target.value})}
              placeholder="01"
              size="small"
            />
          </Box>
          
          <Box sx={{ minWidth: 150 }}>
            <TextField
              fullWidth
              label="Capacity (units)"
              type="number"
              value={newBin.capacity}
              onChange={(e) => setNewBin({...newBin, capacity: e.target.value})}
              placeholder="1000"
              size="small"
            />
          </Box>
          
          <Box sx={{ minWidth: 150 }}>
            <TextField
              fullWidth
              label="Max Weight (kg)"
              type="number"
              value={newBin.maxWeight}
              onChange={(e) => setNewBin({...newBin, maxWeight: e.target.value})}
              placeholder="500"
              size="small"
            />
          </Box>
          
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Bin Type</InputLabel>
              <Select
                value={newBin.binType}
                onChange={(e) => setNewBin({...newBin, binType: e.target.value})}
                label="Bin Type"
              >
                <MenuItem value="STORAGE">Storage</MenuItem>
                <MenuItem value="COLD_STORAGE">Cold Storage</MenuItem>
                <MenuItem value="PICKING">Picking</MenuItem>
                <MenuItem value="STAGING">Staging</MenuItem>
                <MenuItem value="RECEIVING">Receiving</MenuItem>
                <MenuItem value="SHIPPING">Shipping</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Temperature</InputLabel>
              <Select
                value={newBin.temperature}
                onChange={(e) => setNewBin({...newBin, temperature: e.target.value})}
                label="Temperature"
              >
                <MenuItem value="AMBIENT">Ambient</MenuItem>
                <MenuItem value="COLD">Cold (0-5°C)</MenuItem>
                <MenuItem value="FROZEN">Frozen (-18°C)</MenuItem>
                <MenuItem value="HEATED">Heated (20-25°C)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={newBin.restricted}
                onChange={(e) => setNewBin({...newBin, restricted: e.target.checked})}
              />
            }
            label="Restricted Access"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Description"
            value={newBin.description}
            onChange={(e) => setNewBin({...newBin, description: e.target.value})}
            placeholder="Optional description..."
            multiline
            rows={2}
            size="small"
          />
        </Box>
        
        <Button 
          variant="contained" 
          onClick={addBinLocation}
          startIcon={<span>➕</span>}
        >
          Add Bin Location
        </Button>
      </Paper>

      {/* Existing Bins List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Bin Locations ({binLocations.length})
        </Typography>
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Bin Code</strong></TableCell>
                <TableCell align="center"><strong>Zone</strong></TableCell>
                <TableCell align="center"><strong>Type</strong></TableCell>
                <TableCell align="center"><strong>Capacity</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Occupied By</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {binLocations.map(bin => (
                <TableRow key={bin.binCode}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {bin.binCode}
                  </TableCell>
                  <TableCell align="center">{bin.zone}</TableCell>
                  <TableCell align="center">{bin.binType}</TableCell>
                  <TableCell align="center">{bin.capacity} units</TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={bin.status}
                      color={
                        bin.status === 'ACTIVE' ? 'success' :
                        bin.status === 'OCCUPIED' ? 'warning' :
                        bin.status === 'MAINTENANCE' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                    {bin.occupiedBy || '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={bin.status}
                          onChange={(e) => updateBinStatus(bin.binCode, e.target.value)}
                          disabled={bin.occupiedBy !== null}
                          size="small"
                        >
                          <MenuItem value="ACTIVE">Active</MenuItem>
                          <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                          <MenuItem value="DISABLED">Disabled</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton 
                        onClick={() => deleteBinLocation(bin.binCode)}
                        disabled={bin.occupiedBy !== null}
                        color="error"
                        size="small"
                        title={bin.occupiedBy ? 'Cannot delete occupied bin' : 'Delete bin'}
                      >
                        🗑️
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
    { label: 'Warehouses', icon: '🏢' },
    { label: 'Bin Locations', icon: '📍' }
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
      
      <TabPanel value={activeSetupTab} index={4}>
        <BinLocationSetup />
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
                label="Inbound 1 (ASN)" 
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                icon={<Receipt />} 
                label="Outbound (ASN)" 
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
            <SimpleInbound mode="inbound" />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <SimpleInbound mode="outbound" />
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