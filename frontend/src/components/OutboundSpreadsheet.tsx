import React, { useState, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, CellValueChangedEvent } from 'ag-grid-community';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Toolbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  LocalShipping as AllocateIcon,
  Assignment as PickListIcon,
  CheckCircle as ConfirmIcon,
  ContentPaste as PasteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface SOLineItem {
  id?: string;
  line_number: number;
  item_code: string;
  item_name?: string;
  ordered_quantity: number;
  allocated_quantity?: number;
  picked_quantity?: number;
  unit_price?: number;
  line_total?: number;
  required_batch?: string;
  required_expiry_after?: string;
  allocation_strategy?: 'FIFO' | 'FEFO' | 'BATCH';
  special_instructions?: string;
  status?: 'PENDING' | 'ALLOCATED' | 'PICKED' | 'SHIPPED';
}

interface SOHeader {
  so_number: string;
  customer_code: string;
  customer_name?: string;
  warehouse_code: string;
  customer_po?: string;
  requested_delivery_date: string;
  delivery_address: string;
  delivery_contact?: string;
  delivery_phone?: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  notes?: string;
  status?: 'PENDING' | 'ALLOCATED' | 'PICKING' | 'PICKED' | 'SHIPPED';
}

const OutboundSpreadsheet: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<SOLineItem[]>([]);
  const [headerData, setHeaderData] = useState<SOHeader>({
    so_number: '',
    customer_code: '',
    warehouse_code: 'WH001',
    requested_delivery_date: new Date().toISOString().split('T')[0],
    delivery_address: '',
    priority: 'NORMAL'
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'}>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [headerDialogOpen, setHeaderDialogOpen] = useState(false);

  // Column definitions for AG Grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Line #',
      field: 'line_number',
      width: 80,
      cellEditor: 'agNumberCellEditor',
      editable: true,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#e8f5e8' }
    },
    {
      headerName: 'Item Code *',
      field: 'item_code',
      width: 120,
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellStyle: function(params: any) {
        if (!params.value) {
          return { backgroundColor: '#ffebee' };
        }
        return {};
      },
      tooltipField: 'item_code'
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      width: 200,
      editable: false,
      cellStyle: { backgroundColor: '#f5f5f5' },
      tooltipField: 'item_name'
    },
    {
      headerName: 'Ordered Qty *',
      field: 'ordered_quantity',
      width: 120,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn',
      cellStyle: function(params: any) {
        if (params.value <= 0) {
          return { backgroundColor: '#ffebee' };
        }
        return {};
      },
      cellEditorParams: {
        min: 0.001,
        step: 0.001
      }
    },
    {
      headerName: 'Allocated Qty',
      field: 'allocated_quantity',
      width: 120,
      editable: false,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#f0f8ff' },
      valueFormatter: (params) => params.value ? params.value.toFixed(3) : '0.000'
    },
    {
      headerName: 'Picked Qty',
      field: 'picked_quantity',
      width: 110,
      editable: false,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#f0fff0' },
      valueFormatter: (params) => params.value ? params.value.toFixed(3) : '0.000'
    },
    {
      headerName: 'Unit Price',
      field: 'unit_price',
      width: 110,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn',
      cellEditorParams: {
        min: 0,
        step: 0.01
      },
      valueFormatter: (params) => params.value ? `₱${params.value.toFixed(2)}` : ''
    },
    {
      headerName: 'Line Total',
      field: 'line_total',
      width: 110,
      editable: false,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#f0f8ff' },
      valueFormatter: (params) => {
        const qty = params.data?.ordered_quantity || 0;
        const price = params.data?.unit_price || 0;
        return qty && price ? `₱${(qty * price).toFixed(2)}` : '';
      }
    },
    {
      headerName: 'Required Batch',
      field: 'required_batch',
      width: 130,
      editable: true,
      cellEditor: 'agTextCellEditor',
      tooltipField: 'required_batch'
    },
    {
      headerName: 'Min Expiry Date',
      field: 'required_expiry_after',
      width: 140,
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      cellEditorParams: {
        min: new Date().toISOString().split('T')[0]
      }
    },
    {
      headerName: 'Strategy',
      field: 'allocation_strategy',
      width: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['FIFO', 'FEFO', 'BATCH']
      },
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        const colors = {
          'FIFO': 'primary',
          'FEFO': 'warning', 
          'BATCH': 'info'
        };
        return <Chip label={params.value} color={colors[params.value as keyof typeof colors] as any} size="small" />;
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      editable: false,
      cellRenderer: (params: any) => {
        const status = params.value || 'PENDING';
        const colors = {
          'PENDING': 'default',
          'ALLOCATED': 'info',
          'PICKED': 'warning',
          'SHIPPED': 'success'
        };
        return <Chip label={status} color={colors[status as keyof typeof colors] as any} size="small" />;
      }
    },
    {
      headerName: 'Special Instructions',
      field: 'special_instructions',
      width: 200,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      tooltipField: 'special_instructions'
    }
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    enableCellChangeFlash: true,
    cellEditor: 'agTextCellEditor'
  }), []);

  // Grid options
  const gridOptions = useMemo(() => ({
    enableRangeSelection: true,
    enableClipboard: true,
    enableFillHandle: true,
    suppressCopyRowsToClipboard: false,
    rowSelection: 'multiple',
    animateRows: true,
    rowHeight: 45,
    headerHeight: 50,
    enableUndoRedoService: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 20,
    stopEditingWhenCellsLoseFocus: true
  }), []);

  // Add new row
  const addRow = useCallback(() => {
    const newLineNumber = rowData.length > 0 ? Math.max(...rowData.map(r => r.line_number)) + 1 : 1;
    const newRow: SOLineItem = {
      line_number: newLineNumber,
      item_code: '',
      ordered_quantity: 0,
      allocation_strategy: 'FIFO',
      status: 'PENDING'
    };
    setRowData([...rowData, newRow]);
  }, [rowData]);

  // Delete selected rows
  const deleteSelectedRows = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      const selectedData = selectedNodes.map(node => node.data);
      const newRowData = rowData.filter(row => !selectedData.includes(row));
      // Renumber lines
      const renumberedData = newRowData.map((row, index) => ({
        ...row,
        line_number: index + 1
      }));
      setRowData(renumberedData);
      setSnackbar({
        open: true,
        message: `Deleted ${selectedNodes.length} rows`,
        severity: 'info'
      });
    }
  }, [rowData]);

  // Handle cell value changes
  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    const { data, colDef, newValue } = event;
    
    // Auto-populate item details when item code changes
    if (colDef.field === 'item_code' && newValue) {
      const updatedData = { ...data };
      switch (newValue.toUpperCase()) {
        case 'ITM-001':
          updatedData.item_name = 'Rice Premium 25kg';
          updatedData.unit_price = 45.00;
          break;
        case 'ITM-002':
          updatedData.item_name = 'Cooking Oil 1L';
          updatedData.unit_price = 85.00;
          break;
        case 'ITM-003':
          updatedData.item_name = 'Sugar White 50kg';
          updatedData.unit_price = 55.00;
          break;
        default:
          updatedData.item_name = '';
          updatedData.unit_price = 0;
      }
      
      // Update the row data
      const updatedRowData = rowData.map(row => 
        row.line_number === data.line_number ? updatedData : row
      );
      setRowData(updatedRowData);
      
      // Refresh the grid to show updated data
      gridRef.current?.api.refreshCells({
        rowNodes: [event.node],
        columns: ['item_name', 'unit_price', 'line_total']
      });
    }

    // Update line total when quantity or price changes
    if (colDef.field === 'ordered_quantity' || colDef.field === 'unit_price') {
      gridRef.current?.api.refreshCells({
        rowNodes: [event.node],
        columns: ['line_total']
      });
    }
  }, [rowData]);

  // Paste from clipboard
  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n').filter(line => line.trim());
      const newRows: SOLineItem[] = [];
      
      lines.forEach((line, index) => {
        const columns = line.split('\t');
        if (columns.length >= 2) { // Minimum: item_code, quantity
          newRows.push({
            line_number: rowData.length + index + 1,
            item_code: columns[0] || '',
            ordered_quantity: parseFloat(columns[1]) || 0,
            unit_price: parseFloat(columns[2]) || 0,
            required_batch: columns[3] || '',
            required_expiry_after: columns[4] || '',
            allocation_strategy: (columns[5] as any) || 'FIFO',
            special_instructions: columns[6] || '',
            status: 'PENDING'
          });
        }
      });
      
      if (newRows.length > 0) {
        setRowData([...rowData, ...newRows]);
        setSnackbar({
          open: true,
          message: `Pasted ${newRows.length} rows from clipboard`,
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to paste from clipboard. Please ensure data is tab-separated.',
        severity: 'error'
      });
    }
  }, [rowData]);

  // Allocate inventory
  const allocateInventory = useCallback(async () => {
    const validRows = rowData.filter(row => 
      row.item_code && row.ordered_quantity > 0 && row.status === 'PENDING'
    );

    if (validRows.length === 0) {
      setSnackbar({
        open: true,
        message: 'No pending items to allocate',
        severity: 'info'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Call allocation API
      // Simulate allocation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const allocatedRows = rowData.map(row => {
        if (row.item_code && row.ordered_quantity > 0 && row.status === 'PENDING') {
          return {
            ...row,
            allocated_quantity: row.ordered_quantity, // Full allocation for demo
            status: 'ALLOCATED' as const
          };
        }
        return row;
      });

      setRowData(allocatedRows);
      setSnackbar({
        open: true,
        message: `Allocated ${validRows.length} items using FIFO/FEFO strategy`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Allocation failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [rowData]);

  // Generate pick list
  const generatePickList = useCallback(() => {
    const allocatedRows = rowData.filter(row => row.status === 'ALLOCATED');
    
    if (allocatedRows.length === 0) {
      setSnackbar({
        open: true,
        message: 'No allocated items to pick. Please allocate inventory first.',
        severity: 'info'
      });
      return;
    }

    // TODO: Generate PDF pick list
    setSnackbar({
      open: true,
      message: `Pick list generated for ${allocatedRows.length} items`,
      severity: 'success'
    });
  }, [rowData]);

  // Save SO data
  const saveSO = useCallback(async () => {
    // Validate header data
    if (!headerData.so_number || !headerData.customer_code || !headerData.delivery_address) {
      setSnackbar({
        open: true,
        message: 'Please fill in SO Number, Customer Code, and Delivery Address',
        severity: 'error'
      });
      return;
    }

    // Validate line data
    const validRows = rowData.filter(row => 
      row.item_code && row.ordered_quantity > 0
    );

    if (validRows.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one valid line item',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Save to database via API
      console.log('Saving SO:', { header: headerData, lines: validRows });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: `SO ${headerData.so_number} saved successfully with ${validRows.length} lines`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save SO. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [headerData, rowData]);

  // Load sample data
  const loadSampleData = useCallback(() => {
    const sampleHeader: SOHeader = {
      so_number: `SO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`,
      customer_code: 'C001',
      customer_name: 'Metro Retail Corp',
      warehouse_code: 'WH001',
      customer_po: 'METRO-PO-001',
      requested_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delivery_address: '123 Retail Plaza, Makati, Metro Manila, Philippines',
      delivery_contact: 'Lisa Santos',
      delivery_phone: '+63-2-345-6789',
      priority: 'HIGH',
      notes: 'Urgent delivery for weekend sale'
    };

    const sampleRows: SOLineItem[] = [
      {
        line_number: 1,
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        ordered_quantity: 50,
        unit_price: 45.00,
        required_expiry_after: '2025-12-01',
        allocation_strategy: 'FIFO',
        special_instructions: 'Fresh stock preferred',
        status: 'PENDING'
      },
      {
        line_number: 2,
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L',
        ordered_quantity: 30,
        unit_price: 85.00,
        required_batch: 'BATCH-20251115',
        allocation_strategy: 'BATCH',
        special_instructions: 'New batch only',
        status: 'PENDING'
      },
      {
        line_number: 3,
        item_code: 'ITM-003',
        item_name: 'Sugar White 50kg',
        ordered_quantity: 25,
        unit_price: 55.00,
        allocation_strategy: 'FIFO',
        special_instructions: 'Standard packaging',
        status: 'PENDING'
      }
    ];

    setHeaderData(sampleHeader);
    setRowData(sampleRows);
    setSnackbar({
      open: true,
      message: 'Sample data loaded',
      severity: 'info'
    });
  }, []);

  const totalOrderValue = useMemo(() => {
    return rowData.reduce((sum, row) => {
      return sum + ((row.ordered_quantity || 0) * (row.unit_price || 0));
    }, 0);
  }, [rowData]);

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          🚚 Outbound Process - Sales Order (SO)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create sales orders for customer shipments. Supports FIFO/FEFO allocation and pick list generation.
        </Typography>

        {/* Header Info Display */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="caption" display="block">SO Number</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.so_number || 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" display="block">Customer</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.customer_name || headerData.customer_code || 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" display="block">Delivery Date</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.requested_delivery_date || 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" display="block">Total Value</Typography>
            <Typography variant="body2" fontWeight="bold" color="primary">
              ₱{totalOrderValue.toFixed(2)}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setHeaderDialogOpen(true)}
          >
            Edit Header
          </Button>
        </Box>
      </Paper>

      {/* Toolbar */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Tooltip title="Add new line">
            <IconButton onClick={addRow}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete selected rows">
            <IconButton onClick={deleteSelectedRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Paste from clipboard (Tab-separated)">
            <IconButton onClick={pasteFromClipboard}>
              <PasteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Load sample data">
            <IconButton onClick={loadSampleData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<AllocateIcon />}
            onClick={allocateInventory}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            Allocate Inventory
          </Button>

          <Button
            variant="outlined"
            startIcon={<PickListIcon />}
            onClick={generatePickList}
            sx={{ ml: 1 }}
          >
            Generate Pick List
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSO}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            {loading ? 'Saving...' : 'Save SO'}
          </Button>
        </Toolbar>
      </Paper>

      {/* Spreadsheet Grid */}
      <Paper elevation={1} sx={{ height: 600 }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            onCellValueChanged={onCellValueChanged}
            enableRangeSelection={true}
            rowSelection="multiple"
            animateRows={true}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            stopEditingWhenCellsLoseFocus={true}
          />
        </div>
      </Paper>

      {/* Header Dialog */}
      <Dialog open={headerDialogOpen} onClose={() => setHeaderDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sales Order Header Information</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', pt: 1 }}>
            <TextField
              label="SO Number *"
              value={headerData.so_number}
              onChange={(e) => setHeaderData({...headerData, so_number: e.target.value})}
              placeholder="SO-YYYYMMDD-001"
              helperText="Format: SO-YYYYMMDD-###"
            />
            <TextField
              label="Customer Code *"
              value={headerData.customer_code}
              onChange={(e) => setHeaderData({...headerData, customer_code: e.target.value})}
              placeholder="C001"
            />
            <TextField
              label="Warehouse Code *"
              value={headerData.warehouse_code}
              onChange={(e) => setHeaderData({...headerData, warehouse_code: e.target.value})}
              placeholder="WH001"
            />
            <TextField
              label="Customer PO"
              value={headerData.customer_po || ''}
              onChange={(e) => setHeaderData({...headerData, customer_po: e.target.value})}
              placeholder="CUST-PO-001"
            />
            <TextField
              label="Requested Delivery Date *"
              type="date"
              value={headerData.requested_delivery_date}
              onChange={(e) => setHeaderData({...headerData, requested_delivery_date: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Priority"
              select
              value={headerData.priority}
              onChange={(e) => setHeaderData({...headerData, priority: e.target.value as any})}
              SelectProps={{ native: true }}
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </TextField>
            <TextField
              label="Delivery Contact"
              value={headerData.delivery_contact || ''}
              onChange={(e) => setHeaderData({...headerData, delivery_contact: e.target.value})}
              placeholder="Contact Person"
            />
            <TextField
              label="Delivery Phone"
              value={headerData.delivery_phone || ''}
              onChange={(e) => setHeaderData({...headerData, delivery_phone: e.target.value})}
              placeholder="+63-XX-XXX-XXXX"
            />
            <TextField
              label="Delivery Address *"
              value={headerData.delivery_address}
              onChange={(e) => setHeaderData({...headerData, delivery_address: e.target.value})}
              multiline
              rows={3}
              sx={{ gridColumn: 'span 2' }}
              placeholder="Complete delivery address including barangay, city, province"
            />
            <TextField
              label="Notes"
              value={headerData.notes || ''}
              onChange={(e) => setHeaderData({...headerData, notes: e.target.value})}
              multiline
              rows={3}
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHeaderDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setHeaderDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OutboundSpreadsheet;