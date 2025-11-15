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
  Grid,
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
  Badge
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  Print as PrintIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';

// Types
interface ASNForReceiving {
  id: string;
  asn_number: string;
  vendor_name: string;
  expected_delivery_date: string;
  total_lines: number;
  pending_lines: number;
  status: 'PENDING' | 'RECEIVING' | 'RECEIVED' | 'PUTAWAY';
}

interface ASNLineForReceiving {
  id: string;
  line_number: number;
  item_code: string;
  item_name: string;
  expected_quantity: number;
  received_quantity: number;
  remaining_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_id?: string;
  quality_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'QUARANTINE';
  damage_quantity: number;
  reject_quantity: number;
  status: 'PENDING' | 'RECEIVED' | 'PUTAWAY';
  notes?: string;
}

interface ReceivingTransaction {
  asn_line_id: string;
  received_quantity: number;
  damaged_quantity: number;
  rejected_quantity: number;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_id?: string;
  quality_status: 'APPROVED' | 'REJECTED' | 'QUARANTINE';
  quality_notes?: string;
  received_location_id?: string;
}

interface Location {
  id: string;
  location_code: string;
  location_type: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  is_active: boolean;
}

const ReceivingWorkflow: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [pendingASNs, setPendingASNs] = useState<ASNForReceiving[]>([]);
  const [selectedASN, setSelectedASN] = useState<ASNForReceiving | null>(null);
  const [asnLines, setAsnLines] = useState<ASNLineForReceiving[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [receivingDialogOpen, setReceivingDialogOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<ASNLineForReceiving | null>(null);
  const [receivingData, setReceivingData] = useState<ReceivingTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load sample data
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Sample pending ASNs
    const sampleASNs: ASNForReceiving[] = [
      {
        id: '1',
        asn_number: 'ASN-20251115-001',
        vendor_name: 'ABC Trading Corp',
        expected_delivery_date: '2025-11-15',
        total_lines: 3,
        pending_lines: 3,
        status: 'PENDING'
      },
      {
        id: '2',
        asn_number: 'ASN-20251115-002',
        vendor_name: 'Metro Food Supply',
        expected_delivery_date: '2025-11-15',
        total_lines: 5,
        pending_lines: 2,
        status: 'RECEIVING'
      }
    ];

    // Sample ASN lines for first ASN
    const sampleLines: ASNLineForReceiving[] = [
      {
        id: '1',
        line_number: 1,
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        expected_quantity: 200,
        received_quantity: 0,
        remaining_quantity: 200,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2026-11-15',
        pallet_id: 'PLT-001',
        quality_status: 'PENDING',
        damage_quantity: 0,
        reject_quantity: 0,
        status: 'PENDING'
      },
      {
        id: '2',
        line_number: 2,
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L Bottle',
        expected_quantity: 144,
        received_quantity: 0,
        remaining_quantity: 144,
        unit_of_measure: 'BTL',
        batch_number: 'OIL-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2027-05-15',
        pallet_id: 'PLT-002',
        quality_status: 'PENDING',
        damage_quantity: 0,
        reject_quantity: 0,
        status: 'PENDING'
      },
      {
        id: '3',
        line_number: 3,
        item_code: 'ITM-003',
        item_name: 'Sugar 50kg Sack',
        expected_quantity: 100,
        received_quantity: 0,
        remaining_quantity: 100,
        unit_of_measure: 'SACK',
        batch_number: 'SUGAR-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2028-11-15',
        pallet_id: 'PLT-003',
        quality_status: 'PENDING',
        damage_quantity: 0,
        reject_quantity: 0,
        status: 'PENDING'
      }
    ];

    // Sample receiving locations
    const sampleLocations: Location[] = [
      { id: '1', location_code: 'RECV-A1-01', location_type: 'RECEIVING', zone: 'A', aisle: '1', rack: '01', shelf: '1', is_active: true },
      { id: '2', location_code: 'RECV-A1-02', location_type: 'RECEIVING', zone: 'A', aisle: '1', rack: '02', shelf: '1', is_active: true },
      { id: '3', location_code: 'RECV-B1-01', location_type: 'RECEIVING', zone: 'B', aisle: '1', rack: '01', shelf: '1', is_active: true }
    ];

    setPendingASNs(sampleASNs);
    setLocations(sampleLocations);
  };

  // Select ASN for receiving
  const selectASN = (asn: ASNForReceiving) => {
    setSelectedASN(asn);
    // Load ASN lines - in real app this would be API call
    if (asn.asn_number === 'ASN-20251115-001') {
      const sampleLines: ASNLineForReceiving[] = [
        {
          id: '1',
          line_number: 1,
          item_code: 'ITM-001',
          item_name: 'Rice Premium 25kg',
          expected_quantity: 200,
          received_quantity: 0,
          remaining_quantity: 200,
          unit_of_measure: 'BAG',
          batch_number: 'RICE-20251115',
          manufacturing_date: '2025-11-15',
          expiry_date: '2026-11-15',
          pallet_id: 'PLT-001',
          quality_status: 'PENDING',
          damage_quantity: 0,
          reject_quantity: 0,
          status: 'PENDING'
        },
        {
          id: '2',
          line_number: 2,
          item_code: 'ITM-002',
          item_name: 'Cooking Oil 1L Bottle',
          expected_quantity: 144,
          received_quantity: 0,
          remaining_quantity: 144,
          unit_of_measure: 'BTL',
          batch_number: 'OIL-20251115',
          manufacturing_date: '2025-11-15',
          expiry_date: '2027-05-15',
          pallet_id: 'PLT-002',
          quality_status: 'PENDING',
          damage_quantity: 0,
          reject_quantity: 0,
          status: 'PENDING'
        },
        {
          id: '3',
          line_number: 3,
          item_code: 'ITM-003',
          item_name: 'Sugar 50kg Sack',
          expected_quantity: 100,
          received_quantity: 0,
          remaining_quantity: 100,
          unit_of_measure: 'SACK',
          batch_number: 'SUGAR-20251115',
          manufacturing_date: '2025-11-15',
          expiry_date: '2028-11-15',
          pallet_id: 'PLT-003',
          quality_status: 'PENDING',
          damage_quantity: 0,
          reject_quantity: 0,
          status: 'PENDING'
        }
      ];
      setAsnLines(sampleLines);
    }
  };

  // Open receiving dialog for a line item
  const openReceivingDialog = (line: ASNLineForReceiving) => {
    setSelectedLine(line);
    setReceivingData({
      asn_line_id: line.id,
      received_quantity: line.remaining_quantity,
      damaged_quantity: 0,
      rejected_quantity: 0,
      batch_number: line.batch_number,
      manufacturing_date: line.manufacturing_date,
      expiry_date: line.expiry_date,
      pallet_id: line.pallet_id,
      quality_status: 'APPROVED',
      quality_notes: ''
    });
    setReceivingDialogOpen(true);
  };

  // Save receiving transaction
  const saveReceiving = async () => {
    if (!selectedLine || !receivingData) return;

    setLoading(true);
    try {
      // TODO: Save to database via API
      console.log('Saving receiving transaction:', receivingData);
      
      // Update line status
      const updatedLines = asnLines.map(line => 
        line.id === selectedLine.id 
          ? {
              ...line,
              received_quantity: line.received_quantity + receivingData.received_quantity,
              remaining_quantity: line.remaining_quantity - receivingData.received_quantity,
              damage_quantity: line.damage_quantity + receivingData.damaged_quantity,
              reject_quantity: line.reject_quantity + receivingData.rejected_quantity,
              quality_status: receivingData.quality_status,
              status: line.remaining_quantity - receivingData.received_quantity <= 0 ? 'RECEIVED' as const : 'PENDING' as const
            }
          : line
      );
      
      setAsnLines(updatedLines);
      setReceivingDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Receiving transaction saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save receiving transaction',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Grid column definitions
  const asnColumnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'ASN Number',
      field: 'asn_number',
      width: 150,
      cellRenderer: (params: any) => (
        <Button
          variant="text"
          size="small"
          onClick={() => selectASN(params.data)}
          sx={{ textTransform: 'none' }}
        >
          {params.value}
        </Button>
      )
    },
    { headerName: 'Vendor', field: 'vendor_name', width: 200 },
    { headerName: 'Expected Date', field: 'expected_delivery_date', width: 120 },
    { headerName: 'Total Lines', field: 'total_lines', width: 100, type: 'numericColumn' },
    { headerName: 'Pending Lines', field: 'pending_lines', width: 120, type: 'numericColumn' },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'PENDING' ? 'warning' : 
                     status === 'RECEIVING' ? 'info' : 
                     status === 'RECEIVED' ? 'success' : 'default';
        return <Chip label={status} color={color as any} size="small" />;
      }
    }
  ], []);

  const lineColumnDefs: ColDef[] = useMemo(() => [
    { headerName: 'Line#', field: 'line_number', width: 70, type: 'numericColumn' },
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 200 },
    { headerName: 'Expected', field: 'expected_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'Received', field: 'received_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'Remaining', field: 'remaining_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'UOM', field: 'unit_of_measure', width: 80 },
    { headerName: 'Batch', field: 'batch_number', width: 120 },
    { headerName: 'Pallet', field: 'pallet_id', width: 100 },
    {
      headerName: 'Quality',
      field: 'quality_status',
      width: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'PENDING' ? 'warning' : 
                     status === 'APPROVED' ? 'success' : 
                     status === 'REJECTED' ? 'error' : 'info';
        return <Chip label={status} color={color as any} size="small" />;
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params: any) => (
        <Box>
          <Tooltip title="Receive Items">
            <IconButton
              size="small"
              onClick={() => openReceivingDialog(params.data)}
              disabled={params.data.remaining_quantity <= 0}
            >
              <ReceiptIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ], []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📦 Receiving Workflow
      </Typography>
      
      {!selectedASN ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pending ASNs for Receiving
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={pendingASNs}
              columnDefs={asnColumnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              animateRows={true}
              rowSelection="single"
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </Paper>
      ) : (
        <Box>
          {/* ASN Header Info */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Receiving: {selectedASN.asn_number}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  size="small"
                >
                  Print Checklist
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedASN(null)}
                  size="small"
                >
                  Back to ASNs
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="caption" display="block">Vendor</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedASN.vendor_name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" display="block">Expected Date</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedASN.expected_delivery_date}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" display="block">Total Lines</Typography>
                <Typography variant="body2" fontWeight="bold">{selectedASN.total_lines}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" display="block">Status</Typography>
                <Chip label={selectedASN.status} color="info" size="small" />
              </Grid>
            </Grid>
          </Paper>

          {/* ASN Line Items */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Line Items - Physical Receiving
            </Typography>
            
            <div style={{ height: 400, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={asnLines}
                columnDefs={lineColumnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true
                }}
                animateRows={true}
                rowSelection="single"
                onGridReady={(params) => {
                  params.api.sizeColumnsToFit();
                }}
              />
            </div>
          </Paper>
        </Box>
      )}

      {/* Receiving Dialog */}
      <Dialog
        open={receivingDialogOpen}
        onClose={() => setReceivingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Receive Items - Line {selectedLine?.line_number}
        </DialogTitle>
        <DialogContent>
          {selectedLine && receivingData && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                {selectedLine.item_code} - {selectedLine.item_name}
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Expected Quantity"
                    value={selectedLine.expected_quantity}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Remaining to Receive"
                    value={selectedLine.remaining_quantity}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    label="Received Quantity *"
                    type="number"
                    value={receivingData.received_quantity}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      received_quantity: parseFloat(e.target.value) || 0
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Unit of Measure"
                    value={selectedLine.unit_of_measure}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    label="Damaged Quantity"
                    type="number"
                    value={receivingData.damaged_quantity}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      damaged_quantity: parseFloat(e.target.value) || 0
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Rejected Quantity"
                    type="number"
                    value={receivingData.rejected_quantity}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      rejected_quantity: parseFloat(e.target.value) || 0
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    label="Batch Number"
                    value={receivingData.batch_number || ''}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      batch_number: e.target.value
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pallet ID"
                    value={receivingData.pallet_id || ''}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      pallet_id: e.target.value
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    label="Manufacturing Date"
                    type="date"
                    value={receivingData.manufacturing_date || ''}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      manufacturing_date: e.target.value
                    })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Expiry Date"
                    type="date"
                    value={receivingData.expiry_date || ''}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      expiry_date: e.target.value
                    })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Quality Status</InputLabel>
                    <Select
                      value={receivingData.quality_status}
                      onChange={(e) => setReceivingData({
                        ...receivingData,
                        quality_status: e.target.value as any
                      })}
                    >
                      <MenuItem value="APPROVED">Approved</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                      <MenuItem value="QUARANTINE">Quarantine</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Receiving Location</InputLabel>
                    <Select
                      value={receivingData.received_location_id || ''}
                      onChange={(e) => setReceivingData({
                        ...receivingData,
                        received_location_id: e.target.value
                      })}
                    >
                      {locations.map(loc => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.location_code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Quality Notes"
                    multiline
                    rows={3}
                    value={receivingData.quality_notes || ''}
                    onChange={(e) => setReceivingData({
                      ...receivingData,
                      quality_notes: e.target.value
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceivingDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={saveReceiving}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Receiving'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default ReceivingWorkflow;