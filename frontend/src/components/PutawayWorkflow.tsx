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
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MoveToInbox as PutawayIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';

// Types
interface ReceivedItem {
  id: string;
  receiving_transaction_id: string;
  asn_number: string;
  line_number: number;
  item_code: string;
  item_name: string;
  received_quantity: number;
  putaway_quantity: number;
  remaining_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_id: string;
  receiving_location: string;
  quality_status: 'APPROVED' | 'REJECTED' | 'QUARANTINE';
  status: 'RECEIVED' | 'PUTAWAY_PARTIAL' | 'PUTAWAY_COMPLETE';
}

interface StorageLocation {
  id: string;
  location_code: string;
  location_type: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin?: string;
  max_weight_kg?: number;
  max_volume_cbm?: number;
  max_pallets?: number;
  current_weight_kg: number;
  current_volume_cbm: number;
  current_pallets: number;
  temperature_controlled: boolean;
  hazmat_approved: boolean;
  is_active: boolean;
  available_capacity: number;
}

interface PutawayTransaction {
  receiving_transaction_id: string;
  item_id: string;
  putaway_quantity: number;
  batch_number?: string;
  pallet_id: string;
  from_location_id: string;
  to_location_id: string;
  putaway_notes?: string;
}

interface LocationSuggestion {
  location: StorageLocation;
  score: number;
  reason: string;
  distance: number;
}

const PutawayWorkflow: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [receivedItems, setReceivedItems] = useState<ReceivedItem[]>([]);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReceivedItem | null>(null);
  const [putawayDialogOpen, setPutawayDialogOpen] = useState(false);
  const [putawayData, setPutawayData] = useState<PutawayTransaction | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
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
    // Sample received items ready for putaway
    const sampleReceivedItems: ReceivedItem[] = [
      {
        id: '1',
        receiving_transaction_id: 'RXT-001',
        asn_number: 'ASN-20251115-001',
        line_number: 1,
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        received_quantity: 200,
        putaway_quantity: 0,
        remaining_quantity: 200,
        unit_of_measure: 'BAG',
        batch_number: 'RICE-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2026-11-15',
        pallet_id: 'PLT-001',
        receiving_location: 'RECV-A1-01',
        quality_status: 'APPROVED',
        status: 'RECEIVED'
      },
      {
        id: '2',
        receiving_transaction_id: 'RXT-002',
        asn_number: 'ASN-20251115-001',
        line_number: 2,
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L Bottle',
        received_quantity: 144,
        putaway_quantity: 0,
        remaining_quantity: 144,
        unit_of_measure: 'BTL',
        batch_number: 'OIL-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2027-05-15',
        pallet_id: 'PLT-002',
        receiving_location: 'RECV-A1-02',
        quality_status: 'APPROVED',
        status: 'RECEIVED'
      },
      {
        id: '3',
        receiving_transaction_id: 'RXT-003',
        asn_number: 'ASN-20251115-001',
        line_number: 3,
        item_code: 'ITM-003',
        item_name: 'Sugar 50kg Sack',
        received_quantity: 100,
        putaway_quantity: 0,
        remaining_quantity: 100,
        unit_of_measure: 'SACK',
        batch_number: 'SUGAR-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2028-11-15',
        pallet_id: 'PLT-003',
        receiving_location: 'RECV-B1-01',
        quality_status: 'APPROVED',
        status: 'RECEIVED'
      }
    ];

    // Sample storage locations
    const sampleLocations: StorageLocation[] = [
      {
        id: '1',
        location_code: 'A1-R01-S1-B01',
        location_type: 'STORAGE',
        zone: 'A',
        aisle: '1',
        rack: '01',
        shelf: '1',
        bin: '01',
        max_weight_kg: 2000,
        max_volume_cbm: 10,
        max_pallets: 2,
        current_weight_kg: 500,
        current_volume_cbm: 3,
        current_pallets: 0,
        temperature_controlled: false,
        hazmat_approved: false,
        is_active: true,
        available_capacity: 75
      },
      {
        id: '2',
        location_code: 'A1-R01-S2-B01',
        location_type: 'STORAGE',
        zone: 'A',
        aisle: '1',
        rack: '01',
        shelf: '2',
        bin: '01',
        max_weight_kg: 2000,
        max_volume_cbm: 10,
        max_pallets: 2,
        current_weight_kg: 0,
        current_volume_cbm: 0,
        current_pallets: 0,
        temperature_controlled: false,
        hazmat_approved: false,
        is_active: true,
        available_capacity: 100
      },
      {
        id: '3',
        location_code: 'A2-R01-S1-B01',
        location_type: 'STORAGE',
        zone: 'A',
        aisle: '2',
        rack: '01',
        shelf: '1',
        bin: '01',
        max_weight_kg: 3000,
        max_volume_cbm: 15,
        max_pallets: 3,
        current_weight_kg: 1200,
        current_volume_cbm: 8,
        current_pallets: 1,
        temperature_controlled: false,
        hazmat_approved: false,
        is_active: true,
        available_capacity: 60
      },
      {
        id: '4',
        location_code: 'B1-R01-S1-B01',
        location_type: 'STORAGE',
        zone: 'B',
        aisle: '1',
        rack: '01',
        shelf: '1',
        bin: '01',
        max_weight_kg: 2500,
        max_volume_cbm: 12,
        max_pallets: 2,
        current_weight_kg: 800,
        current_volume_cbm: 4,
        current_pallets: 1,
        temperature_controlled: true,
        hazmat_approved: false,
        is_active: true,
        available_capacity: 50
      },
      {
        id: '5',
        location_code: 'C1-R01-S1-B01',
        location_type: 'STORAGE',
        zone: 'C',
        aisle: '1',
        rack: '01',
        shelf: '1',
        bin: '01',
        max_weight_kg: 1500,
        max_volume_cbm: 8,
        max_pallets: 1,
        current_weight_kg: 0,
        current_volume_cbm: 0,
        current_pallets: 0,
        temperature_controlled: false,
        hazmat_approved: true,
        is_active: true,
        available_capacity: 100
      }
    ];

    setReceivedItems(sampleReceivedItems);
    setStorageLocations(sampleLocations);
  };

  // Generate location suggestions based on item characteristics
  const generateLocationSuggestions = (item: ReceivedItem): LocationSuggestion[] => {
    const suggestions: LocationSuggestion[] = [];
    
    // Filter available locations
    const availableLocations = storageLocations.filter(loc => 
      loc.is_active && 
      loc.location_type === 'STORAGE' && 
      loc.current_pallets < (loc.max_pallets || 1)
    );

    availableLocations.forEach(location => {
      let score = 0;
      let reasons: string[] = [];

      // Base score from available capacity
      score += location.available_capacity * 0.3;

      // Prefer locations in same zone as receiving area
      if (location.zone === item.receiving_location.split('-')[0]) {
        score += 20;
        reasons.push('Same zone');
      }

      // Prefer locations with higher available capacity
      if (location.available_capacity > 80) {
        score += 15;
        reasons.push('High capacity');
      } else if (location.available_capacity > 50) {
        score += 10;
        reasons.push('Good capacity');
      }

      // Consider item characteristics
      if (item.item_name.toLowerCase().includes('oil') && location.temperature_controlled) {
        score += 25;
        reasons.push('Temperature controlled');
      }

      if (item.item_name.toLowerCase().includes('sugar') && !location.temperature_controlled) {
        score += 10;
        reasons.push('Dry storage suitable');
      }

      // Penalty for already occupied locations
      if (location.current_pallets > 0) {
        score -= 5;
        reasons.push('Partially occupied');
      }

      // Calculate distance (simplified - in real app would use actual coordinates)
      const distance = Math.abs(parseInt(location.aisle) - 1) + 
                      Math.abs(location.zone.charCodeAt(0) - 65);

      // Prefer closer locations
      score -= distance * 2;

      suggestions.push({
        location,
        score: Math.max(0, score),
        reason: reasons.join(', '),
        distance
      });
    });

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  // Open putaway dialog
  const openPutawayDialog = (item: ReceivedItem) => {
    setSelectedItem(item);
    setPutawayData({
      receiving_transaction_id: item.receiving_transaction_id,
      item_id: item.id,
      putaway_quantity: item.remaining_quantity,
      batch_number: item.batch_number,
      pallet_id: item.pallet_id,
      from_location_id: '', // This would be the receiving location ID
      to_location_id: '',
      putaway_notes: ''
    });

    if (autoSuggestEnabled) {
      const suggestions = generateLocationSuggestions(item);
      setLocationSuggestions(suggestions);
      if (suggestions.length > 0) {
        setSelectedLocation(suggestions[0].location.id);
        setPutawayData(prev => prev ? { ...prev, to_location_id: suggestions[0].location.id } : null);
      }
    }

    setPutawayDialogOpen(true);
  };

  // Save putaway transaction
  const savePutaway = async () => {
    if (!selectedItem || !putawayData) return;

    setLoading(true);
    try {
      // TODO: Save to database via API
      console.log('Saving putaway transaction:', putawayData);
      
      // Update item status
      const updatedItems = receivedItems.map(item => 
        item.id === selectedItem.id 
          ? {
              ...item,
              putaway_quantity: item.putaway_quantity + putawayData.putaway_quantity,
              remaining_quantity: item.remaining_quantity - putawayData.putaway_quantity,
              status: (item.remaining_quantity - putawayData.putaway_quantity <= 0) 
                ? 'PUTAWAY_COMPLETE' as const 
                : 'PUTAWAY_PARTIAL' as const
            }
          : item
      );
      
      setReceivedItems(updatedItems);
      setPutawayDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Putaway completed for ${putawayData.putaway_quantity} ${selectedItem.unit_of_measure}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save putaway transaction',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter locations based on search term
  const filteredLocations = useMemo(() => {
    if (!locationSearchTerm) return storageLocations;
    return storageLocations.filter(loc => 
      loc.location_code.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      loc.zone.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );
  }, [storageLocations, locationSearchTerm]);

  // Grid column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    { headerName: 'ASN', field: 'asn_number', width: 120 },
    { headerName: 'Line#', field: 'line_number', width: 70, type: 'numericColumn' },
    { headerName: 'Item Code', field: 'item_code', width: 120 },
    { headerName: 'Item Name', field: 'item_name', width: 200 },
    { headerName: 'Received', field: 'received_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'Putaway', field: 'putaway_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'Remaining', field: 'remaining_quantity', width: 90, type: 'numericColumn' },
    { headerName: 'UOM', field: 'unit_of_measure', width: 80 },
    { headerName: 'Batch', field: 'batch_number', width: 120 },
    { headerName: 'Pallet', field: 'pallet_id', width: 100 },
    { headerName: 'From Location', field: 'receiving_location', width: 120 },
    {
      headerName: 'Quality',
      field: 'quality_status',
      width: 100,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'APPROVED' ? 'success' : 
                     status === 'REJECTED' ? 'error' : 'warning';
        return <Chip label={status} color={color as any} size="small" />;
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'RECEIVED' ? 'warning' : 
                     status === 'PUTAWAY_PARTIAL' ? 'info' : 'success';
        return <Chip label={status} color={color as any} size="small" />;
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params: any) => (
        <Box>
          <Tooltip title="Putaway">
            <IconButton
              size="small"
              onClick={() => openPutawayDialog(params.data)}
              disabled={params.data.remaining_quantity <= 0}
            >
              <PutawayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ], []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏗️ Putaway Workflow
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Items Ready for Putaway
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSuggestEnabled}
                  onChange={(e) => setAutoSuggestEnabled(e.target.checked)}
                />
              }
              label="Auto-suggest locations"
            />
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              size="small"
            >
              Print Putaway Tasks
            </Button>
          </Box>
        </Box>

        <div style={{ height: 400, width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={receivedItems}
            columnDefs={columnDefs}
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

      {/* Putaway Dialog */}
      <Dialog
        open={putawayDialogOpen}
        onClose={() => setPutawayDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Putaway - {selectedItem?.item_code} ({selectedItem?.pallet_id})
        </DialogTitle>
        <DialogContent>
          {selectedItem && putawayData && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Moving from {selectedItem.receiving_location} to storage location
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Item"
                    value={`${selectedItem.item_code} - ${selectedItem.item_name}`}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Putaway Quantity"
                    type="number"
                    value={putawayData.putaway_quantity}
                    onChange={(e) => setPutawayData({
                      ...putawayData,
                      putaway_quantity: parseFloat(e.target.value) || 0
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Unit of Measure"
                    value={selectedItem.unit_of_measure}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    label="Batch Number"
                    value={putawayData.batch_number || ''}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pallet ID"
                    value={putawayData.pallet_id}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Location Selection */}
              <Typography variant="h6" gutterBottom>
                Select Storage Location
              </Typography>

              {autoSuggestEnabled && locationSuggestions.length > 0 && (
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      Suggested Locations ({locationSuggestions.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {locationSuggestions.map((suggestion, index) => (
                        <ListItem
                          key={suggestion.location.id}
                          button
                          selected={selectedLocation === suggestion.location.id}
                          onClick={() => {
                            setSelectedLocation(suggestion.location.id);
                            setPutawayData({ ...putawayData, to_location_id: suggestion.location.id });
                          }}
                          sx={{
                            border: selectedLocation === suggestion.location.id ? 2 : 1,
                            borderColor: selectedLocation === suggestion.location.id ? 'primary.main' : 'grey.300',
                            borderRadius: 1,
                            mb: 1
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {suggestion.location.location_code}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip 
                                  label={`Score: ${suggestion.score.toFixed(0)}`} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                                <Chip 
                                  label={`${suggestion.location.available_capacity}% available`} 
                                  size="small" 
                                  color={suggestion.location.available_capacity > 70 ? 'success' : 'warning'}
                                  variant="outlined" 
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Zone {suggestion.location.zone}, Aisle {suggestion.location.aisle} • {suggestion.reason}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Capacity: {suggestion.location.current_pallets}/{suggestion.location.max_pallets} pallets, 
                              {suggestion.location.current_weight_kg}kg/{suggestion.location.max_weight_kg}kg
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Manual Location Selection */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Search Locations"
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                  placeholder="Enter location code or zone"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Storage Location *</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setPutawayData({ ...putawayData, to_location_id: e.target.value });
                  }}
                >
                  {filteredLocations.map(location => (
                    <MenuItem 
                      key={location.id} 
                      value={location.id}
                      disabled={!location.is_active || location.current_pallets >= (location.max_pallets || 1)}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>{location.location_code}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={`${location.available_capacity}%`} 
                              size="small" 
                              color={location.available_capacity > 70 ? 'success' : 'warning'}
                              variant="outlined" 
                            />
                            {location.temperature_controlled && (
                              <Chip label="TEMP" size="small" color="info" variant="outlined" />
                            )}
                            {location.hazmat_approved && (
                              <Chip label="HAZ" size="small" color="warning" variant="outlined" />
                            )}
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Zone {location.zone}, {location.aisle}-{location.rack}-{location.shelf}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Putaway Notes"
                multiline
                rows={3}
                value={putawayData.putaway_notes || ''}
                onChange={(e) => setPutawayData({
                  ...putawayData,
                  putaway_notes: e.target.value
                })}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPutawayDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={savePutaway}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading || !selectedLocation}
          >
            {loading ? 'Saving...' : 'Complete Putaway'}
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

export default PutawayWorkflow;