import React, { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Simple interfaces for ASN
interface ASN {
  ID: number;
  ASN_CODE: string;
  ASN_STATUS: 'DRAFT' | 'PENDING' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';
  SUPPLIER: string;
  PO_NO: string;
  CREATE_TIME: string;
  UPDATE_TIME: string;
}

interface ASNLineItem {
  ID?: number;
  ASN_CODE?: string;
  ASN_STATUS?: string;
  SUPPLIER?: string;
  PO_NO?: string;
  CREATE_TIME?: string;
  UPDATE_TIME?: string;
  GOODS_CODE?: string;
  GOODS_DESCRIPTION?: string;
  GOODS_QTY_KG?: number;
  UOM?: string;
  BATCH_NUMBER?: string;
  RECEIVING_LOCATION?: string;
}

const ASNManagement: React.FC = () => {
  const [asnDialogOpen, setAsnDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedASN, setSelectedASN] = useState<ASN | null>(null);
  const [newASN, setNewASN] = useState<Partial<ASN>>({
    ASN_STATUS: 'DRAFT',
    SUPPLIER: '',
    PO_NO: '',
  });

  // Grid data for spreadsheet-style ASN entry
  const [gridData, setGridData] = useState<ASNLineItem[]>(
    Array(20).fill(null).map((_, index) => ({
      ID: index + 1,
      ASN_CODE: '',
      ASN_STATUS: '',
      SUPPLIER: '',
      PO_NO: '',
      CREATE_TIME: '',
      UPDATE_TIME: '',
      GOODS_CODE: '',
      GOODS_DESCRIPTION: '',
      GOODS_QTY_KG: undefined,
      UOM: '',
      BATCH_NUMBER: '',
      RECEIVING_LOCATION: ''
    }))
  );

  // AG Grid column definitions for spreadsheet-style ASN entry
  const itemColumnDefs = [
    { 
      field: 'ID' as keyof ASNLineItem, 
      headerName: 'ID', 
      width: 60,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn'
    },
    { 
      field: 'ASN_CODE' as keyof ASNLineItem, 
      headerName: 'ASN CODE', 
      width: 120,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'ASN_STATUS' as keyof ASNLineItem, 
      headerName: 'ASN STATUS', 
      width: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['1', '2', '3', '4', '5']
      }
    },
    { 
      field: 'SUPPLIER' as keyof ASNLineItem, 
      headerName: 'SUPPLIER', 
      width: 120,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'PO_NO' as keyof ASNLineItem, 
      headerName: 'PO NO', 
      width: 100,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'CREATE_TIME' as keyof ASNLineItem, 
      headerName: 'CREATE TIME', 
      width: 110,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'UPDATE_TIME' as keyof ASNLineItem, 
      headerName: 'UPDATE TIME', 
      width: 110,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'GOODS_CODE' as keyof ASNLineItem, 
      headerName: 'GOODS CODE', 
      width: 120,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'GOODS_DESCRIPTION' as keyof ASNLineItem, 
      headerName: 'GOODS DESCRIPTION', 
      width: 180,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'GOODS_QTY_KG' as keyof ASNLineItem, 
      headerName: 'QTY (KG)', 
      width: 100,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      type: 'numericColumn'
    },
    { 
      field: 'UOM' as keyof ASNLineItem, 
      headerName: 'UOM', 
      width: 80,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['KG', 'PCS', 'BAG', 'BOX', 'BTL', 'SACK', 'PCK', 'CAN', 'PACK', 'SACHET']
      }
    },
    { 
      field: 'BATCH_NUMBER' as keyof ASNLineItem, 
      headerName: 'BATCH NUMBER', 
      width: 130,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    { 
      field: 'RECEIVING_LOCATION' as keyof ASNLineItem, 
      headerName: 'LOCATION', 
      width: 100,
      editable: true,
      cellEditor: 'agTextCellEditor'
    }
  ];

  // Sample ASN data
  const [asnList] = useState<ASN[]>([
    {
      ID: 1,
      ASN_CODE: 'ASN-2024-001',
      ASN_STATUS: 'PENDING',
      SUPPLIER: 'Philippine Medical Supplies Inc.',
      PO_NO: 'PO-2024-001',
      CREATE_TIME: '2024-01-15 08:30:00',
      UPDATE_TIME: '2024-01-15 10:45:00'
    },
    {
      ID: 2,
      ASN_CODE: 'ASN-2024-002',
      ASN_STATUS: 'COMPLETED',
      SUPPLIER: 'Healthcare Solutions Corp.',
      PO_NO: 'PO-2024-002',
      CREATE_TIME: '2024-01-14 09:15:00',
      UPDATE_TIME: '2024-01-15 16:20:00'
    }
  ]);

  const handleCreateNewASN = () => {
    console.log('Create New ASN Spreadsheet opened!'); // Debug log
    // Initialize spreadsheet with empty rows
    setGridData(
      Array(20).fill(null).map((_, index) => ({
        ID: index + 1,
        ASN_CODE: '',
        ASN_STATUS: '',
        SUPPLIER: '',
        PO_NO: '',
        CREATE_TIME: '',
        UPDATE_TIME: '',
        GOODS_CODE: '',
        GOODS_DESCRIPTION: '',
        GOODS_QTY_KG: undefined,
        UOM: '',
        BATCH_NUMBER: '',
        RECEIVING_LOCATION: ''
      }))
    );
    setAsnDialogOpen(true);
  };

  const handleAddRows = () => {
    const currentLength = gridData.length;
    const newRows = Array(10).fill(null).map((_, index) => ({
      ID: currentLength + index + 1,
      ASN_CODE: '',
      ASN_STATUS: '',
      SUPPLIER: '',
      PO_NO: '',
      CREATE_TIME: '',
      UPDATE_TIME: '',
      GOODS_CODE: '',
      GOODS_DESCRIPTION: '',
      GOODS_QTY_KG: undefined,
      UOM: '',
      BATCH_NUMBER: '',
      RECEIVING_LOCATION: ''
    }));
    setGridData(prev => [...prev, ...newRows]);
  };

  const onCellValueChanged = useCallback((params: any) => {
    setGridData(prev => {
      const updated = [...prev];
      updated[params.node.rowIndex] = { 
        ...updated[params.node.rowIndex], 
        [params.colDef.field]: params.newValue 
      };
      return updated;
    });
  }, []);

  const handleCloseDialog = () => {
    setAsnDialogOpen(false);
  };

  const handleSaveASN = () => {
    const validEntries = gridData.filter(item => 
      item.ASN_CODE || item.SUPPLIER || item.GOODS_CODE || item.ID
    );

    if (validEntries.length === 0) {
      alert('Please enter some data in the spreadsheet');
      return;
    }

    console.log('Saving ASN Spreadsheet Data:', {
      totalRows: gridData.length,
      validEntries: validEntries.length,
      data: validEntries
    });
    
    alert(`ASN Spreadsheet saved with ${validEntries.length} entries`);
    setAsnDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          ASN Management System
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNewASN}
          color="primary"
        >
          Create New ASN
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          ASN List
        </Typography>
        
        {asnList.map((asn) => (
          <Card key={asn.ID} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{asn.ASN_CODE}</Typography>
                  <Typography color="text.secondary">
                    Supplier: {asn.SUPPLIER} | PO: {asn.PO_NO} | Status: {asn.ASN_STATUS}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {asn.CREATE_TIME} | Updated: {asn.UPDATE_TIME}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    startIcon={<Visibility />}
                    onClick={() => {
                      setSelectedASN(asn);
                      setDetailsDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => {
                      setNewASN(asn);
                      setAsnDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Paper>

      {/* Create/Edit ASN Dialog - Pure Spreadsheet Interface */}
      <Dialog open={asnDialogOpen} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogTitle>
          ASN Entry Spreadsheet
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              📊 <strong>Excel-like Spreadsheet:</strong> Copy and paste from Excel/Google Sheets. 
              Select cells and ranges, drag to fill, use Ctrl+C/Ctrl+V. Click "Add Rows" to expand.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleAddRows}
                size="small"
              >
                Add 10 Rows
              </Button>
              <Typography variant="body2" color="text.secondary">
                💡 Tip: Copy data from Excel and paste directly into the grid. Supports multi-cell selection and range operations.
              </Typography>
            </Box>

            {/* Pure Spreadsheet Grid */}
            <Box sx={{ height: 600, width: '100%', border: 1, borderColor: 'divider' }}>
              <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                  rowData={gridData}
                  columnDefs={itemColumnDefs}
                  enableRangeSelection={true}
                  enableFillHandle={true}
                  enableCellTextSelection={true}
                  suppressMenuHide={true}
                  onCellValueChanged={onCellValueChanged}
                  defaultColDef={{
                    resizable: true,
                    suppressMovable: true,
                    editable: true,
                    cellEditor: 'agTextCellEditor'
                  }}
                  clipboardDelimiter="\t"
                  processDataFromClipboard={(params) => {
                    return params.data;
                  }}
                  rowSelection="multiple"
                  suppressRowClickSelection={true}
                  enterNavigatesVertically={true}
                  enterNavigatesVerticallyAfterEdit={true}
                  suppressClickEdit={false}
                  singleClickEdit={true}
                  stopEditingWhenCellsLoseFocus={true}
                  undoRedoCellEditing={true}
                  animateRows={true}
                  pagination={false}
                  suppressPaginationPanel={true}
                  rowHeight={35}
                />
              </div>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Rows: {gridData.length} | Entries with Data: {gridData.filter(item => 
                  item.ASN_CODE || item.SUPPLIER || item.GOODS_CODE || (item.ID && item.ID > 0)
                ).length}
              </Typography>
              <Box>
                <Button variant="outlined" size="small" onClick={() => setGridData([])}>
                  Clear All
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button onClick={handleSaveASN} variant="contained">
            Save ASN Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* ASN Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ASN Details: {selectedASN?.ASN_CODE}
        </DialogTitle>
        <DialogContent>
          {selectedASN && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>ASN Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <TextField
                  label="ASN Code"
                  value={selectedASN.ASN_CODE}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="Status"
                  value={selectedASN.ASN_STATUS}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="Supplier"
                  value={selectedASN.SUPPLIER}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="PO Number"
                  value={selectedASN.PO_NO}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="Created"
                  value={selectedASN.CREATE_TIME}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="Updated"
                  value={selectedASN.UPDATE_TIME}
                  disabled
                  variant="outlined"
                />
              </Box>
              
              <Alert severity="info">
                Item details view will be implemented next.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ASNManagement;

