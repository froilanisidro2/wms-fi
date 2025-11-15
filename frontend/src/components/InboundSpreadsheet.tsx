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
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Refresh as RefreshIcon,
  ContentPaste as PasteIcon
} from '@mui/icons-material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ASNLineItem {
  id?: string;
  line_number: number;
  item_code: string;
  item_name?: string;
  expected_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  pallet_config_qty?: number;
  special_instructions?: string;
}

interface ASNHeader {
  asn_number: string;
  vendor_code: string;
  vendor_name?: string;
  warehouse_code: string;
  po_number?: string;
  dr_number?: string;
  vendor_delivery_note?: string;
  expected_delivery_date: string;
  notes?: string;
}

const InboundSpreadsheet: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<ASNLineItem[]>([]);
  const [headerData, setHeaderData] = useState<ASNHeader>({
    asn_number: '',
    vendor_code: '',
    warehouse_code: 'WH001',
    expected_delivery_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [headerDialogOpen, setHeaderDialogOpen] = useState(false);

  // Column definitions for AG Grid
  const columnDefs: any[] = useMemo(() => [
    {
      headerName: 'Line #',
      field: 'line_number',
      width: 80,
      cellEditor: 'agNumberCellEditor',
      editable: true,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#e3f2fd' }
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
      headerName: 'Expected Qty *',
      field: 'expected_quantity',
      width: 130,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn',
      cellStyle: function(params) {
        return params.value > 0 ? {} : { backgroundColor: '#ffebee' };
      },
      cellEditorParams: {
        min: 0.001,
        step: 0.001
      }
    },
    {
      headerName: 'UOM *',
      field: 'unit_of_measure',
      width: 80,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['PCS', 'KG', 'BAG', 'BOX', 'BTL', 'SACK', 'PCK', 'CAN', 'PACK', 'SACHET']
      },
      cellStyle: function(params) {
        return params.value ? {} : { backgroundColor: '#ffebee' };
      }
    },
    {
      headerName: 'Batch Number',
      field: 'batch_number',
      width: 130,
      editable: true,
      cellEditor: 'agTextCellEditor',
      tooltipField: 'batch_number'
    },
    {
      headerName: 'Manufacturing Date',
      field: 'manufacturing_date',
      width: 150,
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      cellEditorParams: {
        min: '2020-01-01',
        max: new Date().toISOString().split('T')[0]
      }
    },
    {
      headerName: 'Expiry Date',
      field: 'expiry_date',
      width: 120,
      editable: true,
      cellEditor: 'agDateStringCellEditor',
      cellEditorParams: {
        min: new Date().toISOString().split('T')[0]
      }
    },
    {
      headerName: 'Pallet Qty',
      field: 'pallet_config_qty',
      width: 100,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn',
      cellEditorParams: {
        min: 1,
        step: 1
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
    rowHeight: 40,
    headerHeight: 50,
    enableUndoRedoService: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 20,
    stopEditingWhenCellsLoseFocus: true
  }), []);

  // Add new row
  const addRow = useCallback(() => {
    const newLineNumber = rowData.length > 0 ? Math.max(...rowData.map(r => r.line_number)) + 1 : 1;
    const newRow: ASNLineItem = {
      line_number: newLineNumber,
      item_code: '',
      expected_quantity: 0,
      unit_of_measure: 'PCS'
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
      // TODO: Fetch item details from API
      // For now, simulate with sample data
      const updatedData = { ...data };
      switch (newValue.toUpperCase()) {
        case 'ITM-001':
          updatedData.item_name = 'Rice Premium 25kg';
          updatedData.unit_of_measure = 'BAG';
          updatedData.pallet_config_qty = 40;
          break;
        case 'ITM-002':
          updatedData.item_name = 'Cooking Oil 1L';
          updatedData.unit_of_measure = 'BTL';
          updatedData.pallet_config_qty = 48;
          break;
        case 'ITM-003':
          updatedData.item_name = 'Sugar White 50kg';
          updatedData.unit_of_measure = 'SACK';
          updatedData.pallet_config_qty = 20;
          break;
        default:
          updatedData.item_name = '';
      }
      
      // Update the row data
      const updatedRowData = rowData.map(row => 
        row.line_number === data.line_number ? updatedData : row
      );
      setRowData(updatedRowData);
      
      // Refresh the grid to show updated data
      gridRef.current?.api.refreshCells({
        rowNodes: [event.node],
        columns: ['item_name', 'unit_of_measure', 'pallet_config_qty']
      });
    }
  }, [rowData]);

  // Paste from clipboard
  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n').filter(line => line.trim());
      const newRows: ASNLineItem[] = [];
      
      lines.forEach((line, index) => {
        const columns = line.split('\t');
        if (columns.length >= 3) { // Minimum: item_code, quantity, uom
          newRows.push({
            line_number: rowData.length + index + 1,
            item_code: columns[0] || '',
            expected_quantity: parseFloat(columns[1]) || 0,
            unit_of_measure: columns[2] || 'PCS',
            batch_number: columns[3] || '',
            manufacturing_date: columns[4] || '',
            expiry_date: columns[5] || '',
            special_instructions: columns[6] || ''
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

  // Save ASN data
  const saveASN = useCallback(async () => {
    // Validate header data
    if (!headerData.asn_number || !headerData.vendor_code || !headerData.expected_delivery_date) {
      setSnackbar({
        open: true,
        message: 'Please fill in ASN Number, Vendor Code, and Expected Delivery Date',
        severity: 'error'
      });
      return;
    }

    // Validate line data
    const validRows = rowData.filter(row => 
      row.item_code && row.expected_quantity > 0 && row.unit_of_measure
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
      console.log('Saving ASN:', { header: headerData, lines: validRows });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: `ASN ${headerData.asn_number} saved successfully with ${validRows.length} lines`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save ASN. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [headerData, rowData]);

  // Load sample data
  const loadSampleData = useCallback(() => {
    const sampleHeader: ASNHeader = {
      asn_number: `ASN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`,
      vendor_code: 'V001',
      vendor_name: 'ABC Trading Corp',
      warehouse_code: 'WH001',
      po_number: 'PO-2025-001',
      dr_number: 'DR-2025-001',
      expected_delivery_date: new Date().toISOString().split('T')[0],
      notes: 'Sample ASN for testing'
    };

    const sampleRows: ASNLineItem[] = [
      {
        line_number: 1,
        item_code: 'ITM-001',
        item_name: 'Rice Premium 25kg',
        expected_quantity: 200,
        unit_of_measure: 'BAG',
        batch_number: 'BATCH-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2026-11-15',
        pallet_config_qty: 40,
        special_instructions: 'Store in dry area'
      },
      {
        line_number: 2,
        item_code: 'ITM-002',
        item_name: 'Cooking Oil 1L',
        expected_quantity: 144,
        unit_of_measure: 'BTL',
        batch_number: 'BATCH-20251115',
        manufacturing_date: '2025-11-15',
        expiry_date: '2027-05-15',
        pallet_config_qty: 48,
        special_instructions: 'Handle with care'
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

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          📦 Inbound Process - Advance Ship Notice (ASN)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create ASN for incoming shipments. Use spreadsheet-like interface with copy/paste support.
        </Typography>

        {/* Header Info Display */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box>
            <Typography variant="caption" display="block">ASN Number</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.asn_number || 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" display="block">Vendor</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.vendor_name || headerData.vendor_code || 'Not set'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" display="block">Expected Delivery</Typography>
            <Typography variant="body2" fontWeight="bold">
              {headerData.expected_delivery_date || 'Not set'}
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
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveASN}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            {loading ? 'Saving...' : 'Save ASN'}
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
        <DialogTitle>ASN Header Information</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', pt: 1 }}>
            <TextField
              label="ASN Number *"
              value={headerData.asn_number}
              onChange={(e) => setHeaderData({...headerData, asn_number: e.target.value})}
              placeholder="ASN-YYYYMMDD-001"
              helperText="Format: ASN-YYYYMMDD-###"
            />
            <TextField
              label="Vendor Code *"
              value={headerData.vendor_code}
              onChange={(e) => setHeaderData({...headerData, vendor_code: e.target.value})}
              placeholder="V001"
            />
            <TextField
              label="Warehouse Code *"
              value={headerData.warehouse_code}
              onChange={(e) => setHeaderData({...headerData, warehouse_code: e.target.value})}
              placeholder="WH001"
            />
            <TextField
              label="PO Number"
              value={headerData.po_number || ''}
              onChange={(e) => setHeaderData({...headerData, po_number: e.target.value})}
              placeholder="PO-2025-001"
            />
            <TextField
              label="DR Number"
              value={headerData.dr_number || ''}
              onChange={(e) => setHeaderData({...headerData, dr_number: e.target.value})}
              placeholder="DR-2025-001"
            />
            <TextField
              label="Expected Delivery Date *"
              type="date"
              value={headerData.expected_delivery_date}
              onChange={(e) => setHeaderData({...headerData, expected_delivery_date: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Vendor Delivery Note"
              value={headerData.vendor_delivery_note || ''}
              onChange={(e) => setHeaderData({...headerData, vendor_delivery_note: e.target.value})}
              placeholder="VDN-001"
              sx={{ gridColumn: 'span 2' }}
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

export default InboundSpreadsheet;