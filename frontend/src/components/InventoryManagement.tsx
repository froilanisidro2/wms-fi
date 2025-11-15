import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Assignment as MovementIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  QrCode as QrCodeIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

// Types
interface InventoryBalance {
  id: string;
  item_code: string;
  item_name: string;
  location_code: string;
  zone: string;
  total_quantity: number;
  available_quantity: number;
  allocated_quantity: number;
  on_hold_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_id?: string;
  last_movement_date: string;
  last_movement_type: string;
  cost_per_unit?: number;
  total_value?: number;
  abc_classification: 'A' | 'B' | 'C';
  status: 'AVAILABLE' | 'RESERVED' | 'QUARANTINE' | 'EXPIRED';
}

interface InventoryMovement {
  id: string;
  movement_date: string;
  movement_type: 'RECEIPT' | 'PUTAWAY' | 'PICK' | 'ADJUSTMENT' | 'CYCLE_COUNT';
  item_code: string;
  item_name: string;
  from_location?: string;
  to_location?: string;
  quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  pallet_id?: string;
  reference_type: 'ASN' | 'SO' | 'ADJUSTMENT' | 'CYCLE_COUNT';
  reference_number?: string;
  movement_by: string;
  notes?: string;
}

interface PutawayToProcess {
  id: string;
  item_code: string;
  item_name: string;
  putaway_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_id: string;
  storage_location: string;
  asn_number: string;
  putaway_date: string;
  status: 'PUTAWAY_COMPLETE' | 'INVENTORY_PENDING';
}

const InventoryManagement: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const movementGridRef = useRef<AgGridReact>(null);
  const [activeTab, setActiveTab] = useState<'balance' | 'movements' | 'putaway'>('putaway');
  const [inventoryBalances, setInventoryBalances] = useState<InventoryBalance[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  const [putawayItems, setPutawayItems] = useState<PutawayToProcess[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoProcessEnabled, setAutoProcessEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load sample data
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample putaway items pending inventory insertion
    const samplePutawayItems: PutawayToProcess[] = [
      {
        id: '1',
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        putaway_quantity: 200,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2026-11-15',
        pallet_id: 'PLT-001',
        storage_location: 'A1-R01-S1-B01',
        asn_number: 'ASN-20251115-001',
        putaway_date: '2025-11-15T14:30:00',
        status: 'INVENTORY_PENDING'
      },
      {
        id: '2',
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L Bottle',
        putaway_quantity: 144,
        unit_of_measure: 'BTL',
        batch_number: 'OIL-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2027-05-15',
        pallet_id: 'PLT-002',
        storage_location: 'A1-R01-S2-B01',
        asn_number: 'ASN-20251115-001',
        putaway_date: '2025-11-15T15:00:00',
        status: 'INVENTORY_PENDING'
      },
      {
        id: '3',
        item_code: 'ITM-003',
        item_name: 'Sugar 50kg Sack',
        putaway_quantity: 100,
        unit_of_measure: 'SACK',
        batch_number: 'SUGAR-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2028-11-15',
        pallet_id: 'PLT-003',
        storage_location: 'B1-R01-S1-B01',
        asn_number: 'ASN-20251115-001',
        putaway_date: '2025-11-15T15:30:00',
        status: 'INVENTORY_PENDING'
      }
    ];

    // Sample inventory balances
    const sampleBalances: InventoryBalance[] = [
      {
        id: '1',
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        location_code: 'A1-R01-S1-B01',
        zone: 'A',
        total_quantity: 150,
        available_quantity: 120,
        allocated_quantity: 30,
        on_hold_quantity: 0,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251110',
        manufacturing_date: '2025-11-10',
        expiry_date: '2026-11-10',
        pallet_id: 'PLT-OLD-001',
        last_movement_date: '2025-11-10T10:00:00',
        last_movement_type: 'PUTAWAY',
        cost_per_unit: 45.50,
        total_value: 6825.00,
        abc_classification: 'A',
        status: 'AVAILABLE'
      },
      {
        id: '2',
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L Bottle',
        location_code: 'A2-R01-S1-B01',
        zone: 'A',
        total_quantity: 288,
        available_quantity: 250,
        allocated_quantity: 38,
        on_hold_quantity: 0,
        unit_of_measure: 'BTL',
        batch_number: 'OIL-20251105',
        manufacturing_date: '2025-11-05',
        expiry_date: '2027-05-05',
        pallet_id: 'PLT-OLD-002',
        last_movement_date: '2025-11-05T14:00:00',
        last_movement_type: 'PUTAWAY',
        cost_per_unit: 12.25,
        total_value: 3528.00,
        abc_classification: 'B',
        status: 'AVAILABLE'
      }
    ];

    // Sample recent movements
    const sampleMovements: InventoryMovement[] = [
      {
        id: '1',
        movement_date: '2025-11-15T14:30:00',
        movement_type: 'PUTAWAY',
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        from_location: 'RECV-A1-01',
        to_location: 'A1-R01-S1-B01',
        quantity: 200,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251115',
        pallet_id: 'PLT-001',
        reference_type: 'ASN',
        reference_number: 'ASN-20251115-001',
        movement_by: 'warehouse.staff@wms-fi.com',
        notes: 'Completed putaway from receiving'
      },
      {
        id: '2',
        movement_date: '2025-11-14T16:20:00',
        movement_type: 'PICK',
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        from_location: 'A1-R01-S1-B01',
        to_location: 'SHIP-A1-01',
        quantity: -50,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251110',
        pallet_id: 'PLT-OLD-001',
        reference_type: 'SO',
        reference_number: 'SO-20251114-001',
        movement_by: 'picker.staff@wms-fi.com',
        notes: 'Picked for customer order'
      }
    ];

    setPutawayItems(samplePutawayItems);
    setInventoryBalances(sampleBalances);
    setInventoryMovements(sampleMovements);
  };

  // Process putaway items into inventory
  const processToInventory = async (itemIds?: string[]) => {
    const itemsToProcess = itemIds || selectedItems;
    if (itemsToProcess.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select items to process',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: API call to create inventory balances and movements
      console.log('Processing items to inventory:', itemsToProcess);

      // Simulate processing each item
      for (const itemId of itemsToProcess) {
        const item = putawayItems.find(p => p.id === itemId);
        if (!item) continue;

        // Create/update inventory balance
        const existingBalance = inventoryBalances.find(b => 
          b.item_code === item.item_code && 
          b.location_code === item.storage_location &&
          b.batch_number === item.batch_number
        );

        if (existingBalance) {
          // Update existing balance
          const updatedBalances = inventoryBalances.map(balance =>
            balance.id === existingBalance.id
              ? {
                  ...balance,
                  total_quantity: balance.total_quantity + item.putaway_quantity,
                  available_quantity: balance.available_quantity + item.putaway_quantity,
                  last_movement_date: new Date().toISOString(),
                  last_movement_type: 'PUTAWAY',
                  total_value: (balance.total_quantity + item.putaway_quantity) * (balance.cost_per_unit || 0)
                }
              : balance
          );
          setInventoryBalances(updatedBalances);
        } else {
          // Create new balance
          const newBalance: InventoryBalance = {
            id: Date.now().toString(),
            item_code: item.item_code,
            item_name: item.item_name,
            location_code: item.storage_location,
            zone: item.storage_location.split('-')[0],
            total_quantity: item.putaway_quantity,
            available_quantity: item.putaway_quantity,
            allocated_quantity: 0,
            on_hold_quantity: 0,
            unit_of_measure: item.unit_of_measure,
            batch_number: item.batch_number,
            manufacturing_date: item.manufacturing_date,
            expiry_date: item.expiry_date,
            pallet_id: item.pallet_id,
            last_movement_date: new Date().toISOString(),
            last_movement_type: 'PUTAWAY',
            cost_per_unit: 0, // TODO: Get from item master
            total_value: 0,
            abc_classification: 'A', // TODO: Get from item master
            status: 'AVAILABLE'
          };
          setInventoryBalances([...inventoryBalances, newBalance]);
        }

        // Create movement record
        const newMovement: InventoryMovement = {
          id: Date.now().toString() + Math.random(),
          movement_date: new Date().toISOString(),
          movement_type: 'PUTAWAY',
          item_code: item.item_code,
          item_name: item.item_name,
          from_location: 'RECEIVING',
          to_location: item.storage_location,
          quantity: item.putaway_quantity,
          unit_of_measure: item.unit_of_measure,
          batch_number: item.batch_number,
          pallet_id: item.pallet_id,
          reference_type: 'ASN',
          reference_number: item.asn_number,
          movement_by: 'system@wms-fi.com',
          notes: 'Automatic inventory insertion after putaway'
        };
        setInventoryMovements([newMovement, ...inventoryMovements]);
      }

      // Remove processed items from putaway list
      const remainingItems = putawayItems.filter(item => !itemsToProcess.includes(item.id));
      setPutawayItems(remainingItems);
      setSelectedItems([]);

      setSnackbar({
        open: true,
        message: `Successfully processed ${itemsToProcess.length} items to inventory`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to process items to inventory',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-process all pending items
  const autoProcessAll = () => {
    const allPendingIds = putawayItems.map(item => item.id);
    processToInventory(allPendingIds);
  };

  // Filter data based on search term
  const filteredBalances = useMemo(() => {
    if (!searchTerm) return inventoryBalances;
    return inventoryBalances.filter(balance => 
      balance.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.location_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (balance.batch_number && balance.batch_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [inventoryBalances, searchTerm]);

  // Column definitions
  const putawayColumnDefs: ColDef[] = useMemo(() => [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50
    },
    { headerName: 'ASN', field: 'asn_number', width: 120 },
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 200 },
    { headerName: 'Quantity', field: 'putaway_quantity', width: 100, type: 'numericColumn' },
    { headerName: 'UOM', field: 'unit_of_measure', width: 80 },
    { headerName: 'Batch', field: 'batch_number', width: 120 },
    { headerName: 'Pallet', field: 'pallet_id', width: 100 },
    { headerName: 'Location', field: 'storage_location', width: 120 },
    { headerName: 'Putaway Date', field: 'putaway_date', width: 150,
      valueFormatter: (params: any) => new Date(params.value).toLocaleString()
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'INVENTORY_PENDING' ? 'warning' : 'success';
        return <Chip label={status.replace('_', ' ')} color={color as any} size="small" />;
      }
    }
  ], []);

  const balanceColumnDefs: ColDef[] = useMemo(() => [
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 200 },
    { headerName: 'Location', field: 'location_code', width: 120 },
    { headerName: 'Total Qty', field: 'total_quantity', width: 100, type: 'numericColumn' },
    { headerName: 'Available', field: 'available_quantity', width: 100, type: 'numericColumn' },
    { headerName: 'Allocated', field: 'allocated_quantity', width: 100, type: 'numericColumn' },
    { headerName: 'UOM', field: 'unit_of_measure', width: 80 },
    { headerName: 'Batch', field: 'batch_number', width: 120 },
    { headerName: 'Expiry Date', field: 'expiry_date', width: 120 },
    { headerName: 'Value', field: 'total_value', width: 100, type: 'numericColumn',
      valueFormatter: (params: any) => params.value ? `₱${params.value.toFixed(2)}` : ''
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'AVAILABLE' ? 'success' : 
                     status === 'RESERVED' ? 'info' : 
                     status === 'QUARANTINE' ? 'warning' : 'error';
        return <Chip label={status} color={color as any} size="small" />;
      }
    }
  ], []);

  const movementColumnDefs: ColDef[] = useMemo(() => [
    { headerName: 'Date', field: 'movement_date', width: 150,
      valueFormatter: (params: any) => new Date(params.value).toLocaleString()
    },
    { headerName: 'Type', field: 'movement_type', width: 100 },
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 180 },
    { headerName: 'From', field: 'from_location', width: 120 },
    { headerName: 'To', field: 'to_location', width: 120 },
    { headerName: 'Quantity', field: 'quantity', width: 100, type: 'numericColumn' },
    { headerName: 'UOM', field: 'unit_of_measure', width: 80 },
    { headerName: 'Reference', field: 'reference_number', width: 140 },
    { headerName: 'By', field: 'movement_by', width: 150 }
  ], []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Inventory Management
      </Typography>
      
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeTab === 'putaway' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('putaway')}
            startIcon={<InventoryIcon />}
          >
            Putaway to Process ({putawayItems.length})
          </Button>
          <Button
            variant={activeTab === 'balance' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('balance')}
            startIcon={<TrendingUpIcon />}
          >
            Inventory Balances
          </Button>
          <Button
            variant={activeTab === 'movements' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('movements')}
            startIcon={<MovementIcon />}
          >
            Recent Movements
          </Button>
        </Box>
      </Box>

      {/* Putaway Processing Tab */}
      {activeTab === 'putaway' && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Items Pending Inventory Insertion
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoProcessEnabled}
                    onChange={(e) => setAutoProcessEnabled(e.target.checked)}
                  />
                }
                label="Auto-process"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={autoProcessAll}
                disabled={loading || putawayItems.length === 0}
                startIcon={<CheckCircleIcon />}
              >
                Process All
              </Button>
              <Button
                variant="outlined"
                onClick={() => processToInventory()}
                disabled={loading || selectedItems.length === 0}
                startIcon={<SaveIcon />}
              >
                Process Selected ({selectedItems.length})
              </Button>
            </Box>
          </Box>

          {putawayItems.length === 0 ? (
            <Alert severity="info">
              No items pending inventory processing. All putaway items have been processed to inventory.
            </Alert>
          ) : (
            <div style={{ height: 400, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={putawayItems}
                columnDefs={putawayColumnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true
                }}
                animateRows={true}
                rowSelection="multiple"
                onSelectionChanged={(event: any) => {
                  const selectedRows = event.api.getSelectedRows();
                  setSelectedItems(selectedRows.map((row: any) => row.id));
                }}
                onGridReady={(params) => {
                  params.api.sizeColumnsToFit();
                }}
              />
            </div>
          )}
        </Paper>
      )}

      {/* Inventory Balances Tab */}
      {activeTab === 'balance' && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Current Inventory Balances
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Search Inventory"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Item code, name, location, batch..."
              />
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                size="small"
              >
                Export Report
              </Button>
            </Box>
          </Box>

          <div style={{ height: 500, width: '100%' }}>
            <AgGridReact
              rowData={filteredBalances}
              columnDefs={balanceColumnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              animateRows={true}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </Paper>
      )}

      {/* Inventory Movements Tab */}
      {activeTab === 'movements' && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Recent Inventory Movements
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              size="small"
            >
              Movement Report
            </Button>
          </Box>

          <div style={{ height: 500, width: '100%' }}>
            <AgGridReact
              ref={movementGridRef}
              rowData={inventoryMovements}
              columnDefs={movementColumnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              animateRows={true}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryManagement;