import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

interface ASNLineItem {
  id: string;
  goods_code: string;
  goods_description: string;
  goods_qty_kg: number;
  uom: string;
  actual_qty?: number;
  goods_weight_kg?: number;
  pallet_config?: string;
  pallet_id?: string;
  mfg_date?: string;
  exp_date?: string;
  batch_no?: string;
  sorted_qty?: number;
  shortage_qty?: number;
  more_qty?: number;
  damage_qty?: number;
  goods_volume?: number;
  goods_cost?: number;
  goods_remarks?: string;
}

interface ASN {
  id: string; // Unique ID
  asn_code: string; // Unique ASN Code
  asn_status: 'DRAFT' | 'SUBMITTED' | 'IN_TRANSIT' | 'RECEIVED' | 'COMPLETED';
  supplier: string;
  po_no: string;
  create_time: string;
  update_time: string;
  line_items: ASNLineItem[];
}

const ASNManagement: React.FC = () => {
  const [asnList, setAsnList] = useState<ASN[]>([
    {
      id: 'ASN001',
      asn_code: 'ASN-2024-001',
      asn_status: 'SUBMITTED',
      supplier: 'Philippine Medical Supplies Inc.',
      po_no: 'PO-2024-001',
      create_time: '2024-01-15 08:00:00',
      update_time: '2024-01-15 08:00:00',
      line_items: [
        {
          id: 'LI001',
          goods_code: 'PARACETAMOL-500MG',
          goods_description: 'Paracetamol 500mg Tablets',
          goods_qty_kg: 50.0,
          uom: 'KG',
          actual_qty: 1000,
          goods_weight_kg: 50.0,
          batch_no: 'BATCH001',
          mfg_date: '2024-01-01',
          exp_date: '2026-01-01',
        },
        {
          id: 'LI002',
          goods_code: 'AMOXICILLIN-500MG',
          goods_description: 'Amoxicillin 500mg Capsules',
          goods_qty_kg: 25.0,
          uom: 'KG',
          actual_qty: 500,
          goods_weight_kg: 25.0,
          batch_no: 'BATCH002',
          mfg_date: '2024-01-01',
          exp_date: '2026-01-01',
        }
      ]
    },
    {
      id: 'ASN002',
      asn_code: 'ASN-2024-002',
      asn_status: 'DRAFT',
      supplier: 'Global Healthcare Distributors',
      po_no: 'PO-2024-002',
      create_time: '2024-01-16 09:30:00',
      update_time: '2024-01-16 09:30:00',
      line_items: [
        {
          id: 'LI003',
          goods_code: 'IBUPROFEN-400MG',
          goods_description: 'Ibuprofen 400mg Tablets',
          goods_qty_kg: 75.0,
          uom: 'KG',
        }
      ]
    }
  ]);

  const [selectedASN, setSelectedASN] = useState<ASN | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newASNForm, setNewASNForm] = useState({
    asn_code: '',
    supplier: '',
    po_no: '',
    line_items: [{
      goods_code: '',
      goods_description: '',
      goods_qty_kg: 0,
      uom: 'KG'
    }]
  });

  const handleCreateASN = () => {
    const newASN: ASN = {
      id: `ASN${String(asnList.length + 1).padStart(3, '0')}`,
      asn_code: newASNForm.asn_code,
      asn_status: 'DRAFT',
      supplier: newASNForm.supplier,
      po_no: newASNForm.po_no,
      create_time: new Date().toLocaleString(),
      update_time: new Date().toLocaleString(),
      line_items: newASNForm.line_items.map((item, index) => ({
        id: `LI${String(asnList.length + 1).padStart(3, '0')}_${index + 1}`,
        goods_code: item.goods_code,
        goods_description: item.goods_description,
        goods_qty_kg: item.goods_qty_kg,
        uom: item.uom,
      }))
    };
    
    setAsnList([...asnList, newASN]);
    setShowCreateDialog(false);
    
    // Reset form
    setNewASNForm({
      asn_code: '',
      supplier: '',
      po_no: '',
      line_items: [{
        goods_code: '',
        goods_description: '',
        goods_qty_kg: 0,
        uom: 'KG'
      }]
    });
  };

  const addLineItem = () => {
    setNewASNForm({
      ...newASNForm,
      line_items: [...newASNForm.line_items, {
        goods_code: '',
        goods_description: '',
        goods_qty_kg: 0,
        uom: 'KG'
      }]
    });
  };

  const removeLineItem = (index: number) => {
    const items = newASNForm.line_items.filter((_, i) => i !== index);
    setNewASNForm({...newASNForm, line_items: items});
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const items = [...newASNForm.line_items];
    (items[index] as any)[field] = value;
    setNewASNForm({...newASNForm, line_items: items});
  };

  if (selectedASN) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">ASN Details - {selectedASN.asn_code}</Typography>
          <Button variant="outlined" onClick={() => setSelectedASN(null)}>
            Back to ASN List
          </Button>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>ASN Information</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
              <TextField label="ID" value={selectedASN.id} disabled size="small" />
              <TextField label="ASN Code" value={selectedASN.asn_code} disabled size="small" />
              <TextField label="Status" value={selectedASN.asn_status} disabled size="small" />
              <TextField label="Supplier" value={selectedASN.supplier} disabled size="small" />
              <TextField label="PO Number" value={selectedASN.po_no} disabled size="small" />
              <TextField label="Create Time" value={selectedASN.create_time} disabled size="small" />
              <TextField label="Update Time" value={selectedASN.update_time} disabled size="small" />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>ASN Details</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Goods Code</TableCell>
                    <TableCell>Goods Description</TableCell>
                    <TableCell align="right">Goods Qty (KG)</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell align="right">Actual Qty</TableCell>
                    <TableCell>Batch No</TableCell>
                    <TableCell>MFG Date</TableCell>
                    <TableCell>EXP Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedASN.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.goods_code}</TableCell>
                      <TableCell>{item.goods_description}</TableCell>
                      <TableCell align="right">{item.goods_qty_kg}</TableCell>
                      <TableCell>{item.uom}</TableCell>
                      <TableCell align="right">{item.actual_qty || '-'}</TableCell>
                      <TableCell>{item.batch_no || '-'}</TableCell>
                      <TableCell>{item.mfg_date || '-'}</TableCell>
                      <TableCell>{item.exp_date || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Extended Tracking Fields</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Goods Code</TableCell>
                    <TableCell>Goods Weight (KG)</TableCell>
                    <TableCell>Pallet Config</TableCell>
                    <TableCell>Pallet ID</TableCell>
                    <TableCell>Sorted Qty</TableCell>
                    <TableCell>Shortage Qty</TableCell>
                    <TableCell>More Qty</TableCell>
                    <TableCell>Damage Qty</TableCell>
                    <TableCell>Goods Volume</TableCell>
                    <TableCell>Goods Cost</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedASN.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.goods_code}</TableCell>
                      <TableCell>{item.goods_weight_kg || '-'}</TableCell>
                      <TableCell>{item.pallet_config || '-'}</TableCell>
                      <TableCell>{item.pallet_id || '-'}</TableCell>
                      <TableCell>{item.sorted_qty || '-'}</TableCell>
                      <TableCell>{item.shortage_qty || '-'}</TableCell>
                      <TableCell>{item.more_qty || '-'}</TableCell>
                      <TableCell>{item.damage_qty || '-'}</TableCell>
                      <TableCell>{item.goods_volume || '-'}</TableCell>
                      <TableCell>{item.goods_cost || '-'}</TableCell>
                      <TableCell>{item.goods_remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">ASN List</Typography>
        <Button variant="contained" onClick={() => setShowCreateDialog(true)}>
          Create New ASN
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ASN CODE</TableCell>
                  <TableCell>ASN STATUS</TableCell>
                  <TableCell>SUPPLIER</TableCell>
                  <TableCell>PO NO</TableCell>
                  <TableCell>CREATE TIME</TableCell>
                  <TableCell>UPDATE TIME</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asnList.map((asn) => (
                  <TableRow key={asn.id}>
                    <TableCell>{asn.id}</TableCell>
                    <TableCell>{asn.asn_code}</TableCell>
                    <TableCell>
                      <Chip 
                        label={asn.asn_status}
                        color={
                          asn.asn_status === 'COMPLETED' ? 'success' : 
                          asn.asn_status === 'RECEIVED' ? 'primary' :
                          asn.asn_status === 'IN_TRANSIT' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{asn.supplier}</TableCell>
                    <TableCell>{asn.po_no}</TableCell>
                    <TableCell>{asn.create_time}</TableCell>
                    <TableCell>{asn.update_time}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => setSelectedASN(asn)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create New ASN Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New ASN</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>ASN Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 3 }}>
            <TextField
              label="ASN Code"
              value={newASNForm.asn_code}
              onChange={(e) => setNewASNForm({...newASNForm, asn_code: e.target.value})}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={newASNForm.supplier}
                label="Supplier"
                onChange={(e) => setNewASNForm({...newASNForm, supplier: e.target.value})}
              >
                <MenuItem value="Philippine Medical Supplies Inc.">Philippine Medical Supplies Inc.</MenuItem>
                <MenuItem value="Global Healthcare Distributors">Global Healthcare Distributors</MenuItem>
                <MenuItem value="Metro Drug Corporation">Metro Drug Corporation</MenuItem>
                <MenuItem value="Zuellig Pharma Corporation">Zuellig Pharma Corporation</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="PO Number"
              value={newASNForm.po_no}
              onChange={(e) => setNewASNForm({...newASNForm, po_no: e.target.value})}
              required
              fullWidth
            />
          </Box>
          
          <Typography variant="h6" gutterBottom>Goods Information</Typography>
          {newASNForm.line_items.map((item, index) => (
            <Box key={index} sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Item {index + 1}</Typography>
                {newASNForm.line_items.length > 1 && (
                  <Button 
                    color="error" 
                    size="small"
                    onClick={() => removeLineItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <TextField
                  label="Goods Code"
                  value={item.goods_code}
                  onChange={(e) => updateLineItem(index, 'goods_code', e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Goods Description"
                  value={item.goods_description}
                  onChange={(e) => updateLineItem(index, 'goods_description', e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Goods Qty (KG)"
                  type="number"
                  value={item.goods_qty_kg}
                  onChange={(e) => updateLineItem(index, 'goods_qty_kg', parseFloat(e.target.value) || 0)}
                  required
                  fullWidth
                />
                <FormControl fullWidth required>
                  <InputLabel>UOM</InputLabel>
                  <Select
                    value={item.uom}
                    label="UOM"
                    onChange={(e) => updateLineItem(index, 'uom', e.target.value)}
                  >
                    <MenuItem value="KG">KG</MenuItem>
                    <MenuItem value="GRAMS">GRAMS</MenuItem>
                    <MenuItem value="LITERS">LITERS</MenuItem>
                    <MenuItem value="PIECES">PIECES</MenuItem>
                    <MenuItem value="BOXES">BOXES</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ))}
          
          <Button variant="outlined" onClick={addLineItem} sx={{ mr: 2 }}>
            Add Another Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateASN}
            variant="contained"
            disabled={
              !newASNForm.asn_code || 
              !newASNForm.supplier || 
              !newASNForm.po_no || 
              newASNForm.line_items.some(item => !item.goods_code || !item.goods_description)
            }
          >
            Create ASN
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ASNManagement;