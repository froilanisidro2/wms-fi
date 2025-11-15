import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
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
  Alert
} from '@mui/material';

interface ASNLineItem {
  id: string;
  item_code: string;
  item_description: string;
  expected_quantity: number;
  received_quantity: number;
  remaining_quantity: number;
  unit_of_measure: string;
  batch_number?: string;
  quality_status: 'GOOD' | 'DAMAGED' | 'REJECTED';
  putaway_location?: string;
  inventory_status: 'PENDING' | 'COMPLETED';
}

interface ASN {
  id: string;
  asn_number: string;
  supplier_code: string;
  supplier_name: string;
  expected_date: string;
  status: string;
  line_items: ASNLineItem[];
}

const ASNWorkflowDemo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedASN, setSelectedASN] = useState<ASN | null>(null);
  const [receivingData, setReceivingData] = useState<any>({});
  const [putawayData, setPutawayData] = useState<any>({});

  // Sample ASN data
  const sampleASN: ASN = {
    id: '1',
    asn_number: 'ASN-2024-001',
    supplier_code: 'SUPP001',
    supplier_name: 'Philippine Medical Supplies Inc.',
    expected_date: '2024-01-15',
    status: 'PENDING_RECEIPT',
    line_items: [
      {
        id: '1',
        item_code: 'PARACETAMOL-500MG',
        item_description: 'Paracetamol 500mg Tablets',
        expected_quantity: 1000,
        received_quantity: 0,
        remaining_quantity: 1000,
        unit_of_measure: 'TABLETS',
        quality_status: 'GOOD',
        inventory_status: 'PENDING'
      },
      {
        id: '2',
        item_code: 'AMOXICILLIN-500MG',
        item_description: 'Amoxicillin 500mg Capsules',
        expected_quantity: 500,
        received_quantity: 0,
        remaining_quantity: 500,
        unit_of_measure: 'CAPSULES',
        quality_status: 'GOOD',
        inventory_status: 'PENDING'
      }
    ]
  };

  React.useEffect(() => {
    setSelectedASN(sampleASN);
  }, []);

  const steps = [
    'ASN Data Entry',
    'Physical Receiving',
    'Putaway Process',
    'Inventory Insertion'
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReceiving = (lineItem: ASNLineItem, receivedQty: number) => {
    if (selectedASN) {
      const updatedLineItems = selectedASN.line_items.map(item => 
        item.id === lineItem.id 
          ? { ...item, received_quantity: receivedQty, remaining_quantity: item.expected_quantity - receivedQty }
          : item
      );
      setSelectedASN({ ...selectedASN, line_items: updatedLineItems });
    }
  };

  const handlePutaway = (lineItemId: string, location: string) => {
    if (selectedASN) {
      const updatedLineItems = selectedASN.line_items.map(item => 
        item.id === lineItemId 
          ? { ...item, putaway_location: location }
          : item
      );
      setSelectedASN({ ...selectedASN, line_items: updatedLineItems });
    }
  };

  const handleInventoryInsertion = (lineItemId: string) => {
    if (selectedASN) {
      const updatedLineItems = selectedASN.line_items.map(item =>
        item.id === lineItemId 
          ? { ...item, inventory_status: 'COMPLETED' as const }
          : item
      );
      setSelectedASN({ ...selectedASN, line_items: updatedLineItems });
    }
  };

  const renderStepContent = (step: number) => {
    if (!selectedASN) return null;

    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ASN Data Entry Complete
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="ASN Number" value={selectedASN.asn_number} disabled size="small" />
                <TextField label="Supplier" value={selectedASN.supplier_name} disabled size="small" />
                <TextField label="Expected Date" value={selectedASN.expected_date} disabled size="small" />
              </Box>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Expected Qty</TableCell>
                      <TableCell>UOM</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedASN.line_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.item_code}</TableCell>
                        <TableCell>{item.item_description}</TableCell>
                        <TableCell align="right">{item.expected_quantity}</TableCell>
                        <TableCell>{item.unit_of_measure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Physical Receiving
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Update received quantities for each line item
              </Alert>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Expected</TableCell>
                      <TableCell align="right">Received</TableCell>
                      <TableCell align="right">Remaining</TableCell>
                      <TableCell>Quality Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedASN.line_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.item_code}</TableCell>
                        <TableCell>{item.item_description}</TableCell>
                        <TableCell align="right">{item.expected_quantity}</TableCell>
                        <TableCell align="right">{item.received_quantity}</TableCell>
                        <TableCell align="right">{item.remaining_quantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.quality_status}
                            color={item.quality_status === 'GOOD' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              type="number"
                              size="small"
                              placeholder="Qty"
                              sx={{ width: 80 }}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value) || 0;
                                handleReceiving(item, qty);
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Putaway Process
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Assign storage locations for received items
              </Alert>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Received Qty</TableCell>
                      <TableCell>Suggested Location</TableCell>
                      <TableCell>Assign Location</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedASN.line_items.filter(item => item.received_quantity > 0).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.item_code}</TableCell>
                        <TableCell>{item.item_description}</TableCell>
                        <TableCell align="right">{item.received_quantity}</TableCell>
                        <TableCell>
                          <Chip label="A-01-01" variant="outlined" size="small" />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={item.putaway_location || ''}
                              onChange={(e) => handlePutaway(item.id, e.target.value)}
                            >
                              <MenuItem value="A-01-01">A-01-01</MenuItem>
                              <MenuItem value="A-01-02">A-01-02</MenuItem>
                              <MenuItem value="B-01-01">B-01-01</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.putaway_location ? "Assigned" : "Pending"}
                            color={item.putaway_location ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Insertion
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Finalize inventory balance updates
              </Alert>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Inventory Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedASN.line_items.filter(item => item.putaway_location).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.item_code}</TableCell>
                        <TableCell>{item.item_description}</TableCell>
                        <TableCell align="right">{item.received_quantity}</TableCell>
                        <TableCell>{item.putaway_location}</TableCell>
                        <TableCell>{item.batch_number || 'AUTO-GEN-' + Date.now().toString().slice(-6)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.inventory_status}
                            color={item.inventory_status === 'COMPLETED' ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={item.inventory_status === 'COMPLETED'}
                            onClick={() => handleInventoryInsertion(item.id)}
                          >
                            Insert to Inventory
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ASN Workflow Demo - Complete Process
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        <Button
          disabled={activeStep === steps.length - 1}
          onClick={handleNext}
          variant="contained"
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </Box>

      {activeStep === steps.length - 1 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="h6">
            ASN Workflow Complete! 🎉
          </Typography>
          <Typography>
            All items have been successfully received, assigned to storage locations, and added to inventory.
            The complete ASN workflow from data entry through inventory insertion has been demonstrated.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ASNWorkflowDemo;