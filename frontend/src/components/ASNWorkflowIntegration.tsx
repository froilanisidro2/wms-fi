import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  Snackbar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  PlayCircleOutline as StartIcon,
  Assignment as ASNIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  MoveToInbox as PutawayIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';

// Import our workflow components
import InboundSpreadsheet from './InboundSpreadsheet';
import ReceivingWorkflow from './ReceivingWorkflow';
import PutawayWorkflow from './PutawayWorkflow';
import InventoryManagement from './InventoryManagement';

// Types
interface ASNWorkflowStatus {
  asn_number: string;
  vendor_name: string;
  total_lines: number;
  created_date: string;
  expected_delivery_date: string;
  current_step: number;
  overall_status: 'DRAFT' | 'SUBMITTED' | 'RECEIVING' | 'PUTAWAY' | 'COMPLETED';
  steps: {
    step: number;
    name: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    completed_date?: string;
    completed_by?: string;
    notes?: string;
  }[];
  line_summary: {
    total_lines: number;
    pending_receive: number;
    received: number;
    pending_putaway: number;
    putaway_complete: number;
    in_inventory: number;
  };
}

interface WorkflowMetrics {
  total_asns: number;
  pending_receive: number;
  in_receiving: number;
  pending_putaway: number;
  in_putaway: number;
  completed: number;
  avg_cycle_time_hours: number;
  on_time_delivery_rate: number;
}

const ASNWorkflowIntegration: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'create' | 'receive' | 'putaway' | 'inventory'>('overview');
  const [asnStatuses, setAsnStatuses] = useState<ASNWorkflowStatus[]>([]);
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [selectedASN, setSelectedASN] = useState<ASNWorkflowStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load sample workflow data
  useEffect(() => {
    loadSampleWorkflowData();
  }, []);

  const loadSampleWorkflowData = () => {
    // Sample ASN workflow statuses
    const sampleStatuses: ASNWorkflowStatus[] = [
      {
        asn_number: 'ASN-20251115-001',
        vendor_name: 'ABC Trading Corp',
        total_lines: 3,
        created_date: '2025-11-15T08:00:00',
        expected_delivery_date: '2025-11-15',
        current_step: 3,
        overall_status: 'PUTAWAY',
        steps: [
          {
            step: 1,
            name: 'ASN Creation',
            status: 'COMPLETED',
            completed_date: '2025-11-15T08:00:00',
            completed_by: 'planner@wms-fi.com',
            notes: 'ASN created with 3 line items'
          },
          {
            step: 2,
            name: 'Physical Receiving',
            status: 'COMPLETED',
            completed_date: '2025-11-15T14:00:00',
            completed_by: 'receiver@wms-fi.com',
            notes: 'All items received and quality checked'
          },
          {
            step: 3,
            name: 'Putaway Process',
            status: 'IN_PROGRESS',
            notes: '2 of 3 items completed putaway'
          },
          {
            step: 4,
            name: 'Inventory Insertion',
            status: 'PENDING'
          }
        ],
        line_summary: {
          total_lines: 3,
          pending_receive: 0,
          received: 3,
          pending_putaway: 1,
          putaway_complete: 2,
          in_inventory: 2
        }
      },
      {
        asn_number: 'ASN-20251115-002',
        vendor_name: 'Metro Food Supply',
        total_lines: 5,
        created_date: '2025-11-15T09:30:00',
        expected_delivery_date: '2025-11-15',
        current_step: 2,
        overall_status: 'RECEIVING',
        steps: [
          {
            step: 1,
            name: 'ASN Creation',
            status: 'COMPLETED',
            completed_date: '2025-11-15T09:30:00',
            completed_by: 'planner@wms-fi.com',
            notes: 'ASN created with 5 line items'
          },
          {
            step: 2,
            name: 'Physical Receiving',
            status: 'IN_PROGRESS',
            notes: '3 of 5 items received'
          },
          {
            step: 3,
            name: 'Putaway Process',
            status: 'PENDING'
          },
          {
            step: 4,
            name: 'Inventory Insertion',
            status: 'PENDING'
          }
        ],
        line_summary: {
          total_lines: 5,
          pending_receive: 2,
          received: 3,
          pending_putaway: 0,
          putaway_complete: 0,
          in_inventory: 0
        }
      },
      {
        asn_number: 'ASN-20251114-003',
        vendor_name: 'Fresh Market Ltd',
        total_lines: 4,
        created_date: '2025-11-14T10:00:00',
        expected_delivery_date: '2025-11-14',
        current_step: 4,
        overall_status: 'COMPLETED',
        steps: [
          {
            step: 1,
            name: 'ASN Creation',
            status: 'COMPLETED',
            completed_date: '2025-11-14T10:00:00',
            completed_by: 'planner@wms-fi.com'
          },
          {
            step: 2,
            name: 'Physical Receiving',
            status: 'COMPLETED',
            completed_date: '2025-11-14T15:30:00',
            completed_by: 'receiver@wms-fi.com'
          },
          {
            step: 3,
            name: 'Putaway Process',
            status: 'COMPLETED',
            completed_date: '2025-11-14T17:00:00',
            completed_by: 'warehouse@wms-fi.com'
          },
          {
            step: 4,
            name: 'Inventory Insertion',
            status: 'COMPLETED',
            completed_date: '2025-11-14T17:15:00',
            completed_by: 'system@wms-fi.com'
          }
        ],
        line_summary: {
          total_lines: 4,
          pending_receive: 0,
          received: 4,
          pending_putaway: 0,
          putaway_complete: 4,
          in_inventory: 4
        }
      }
    ];

    // Sample metrics
    const sampleMetrics: WorkflowMetrics = {
      total_asns: 15,
      pending_receive: 3,
      in_receiving: 2,
      pending_putaway: 4,
      in_putaway: 2,
      completed: 4,
      avg_cycle_time_hours: 8.5,
      on_time_delivery_rate: 92.5
    };

    setAsnStatuses(sampleStatuses);
    setMetrics(sampleMetrics);
  };

  // Get step icon
  const getStepIcon = (step: number, status: string) => {
    const iconProps = { fontSize: 'small' as const };
    
    switch (step) {
      case 1: return <ASNIcon {...iconProps} />;
      case 2: return <ReceiptIcon {...iconProps} />;
      case 3: return <PutawayIcon {...iconProps} />;
      case 4: return <InventoryIcon {...iconProps} />;
      default: return <PendingIcon {...iconProps} />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'PENDING': return 'default';
      default: return 'default';
    }
  };

  // Render workflow overview
  const renderWorkflowOverview = () => (
    <Box>
      {/* Metrics Cards */}
      {metrics && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="primary">{metrics.total_asns}</Typography>
              <Typography variant="body2">Total ASNs</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="warning.main">{metrics.pending_receive + metrics.in_receiving}</Typography>
              <Typography variant="body2">In Receiving</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="info.main">{metrics.pending_putaway + metrics.in_putaway}</Typography>
              <Typography variant="body2">In Putaway</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="success.main">{metrics.completed}</Typography>
              <Typography variant="body2">Completed</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6">{metrics.avg_cycle_time_hours}h</Typography>
              <Typography variant="body2">Avg Cycle Time</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" color="success.main">{metrics.on_time_delivery_rate}%</Typography>
              <Typography variant="body2">On-Time Rate</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<ASNIcon />}
          onClick={() => setActiveView('create')}
        >
          Create New ASN
        </Button>
        <Button
          variant="outlined"
          startIcon={<ReceiptIcon />}
          onClick={() => setActiveView('receive')}
        >
          Receiving ({metrics?.pending_receive || 0})
        </Button>
        <Button
          variant="outlined"
          startIcon={<PutawayIcon />}
          onClick={() => setActiveView('putaway')}
        >
          Putaway ({metrics?.pending_putaway || 0})
        </Button>
        <Button
          variant="outlined"
          startIcon={<InventoryIcon />}
          onClick={() => setActiveView('inventory')}
        >
          Inventory Management
        </Button>
      </Box>

      {/* Active ASNs */}
      <Typography variant="h6" gutterBottom>Active ASNs</Typography>
      {asnStatuses.map((asn, index) => (
        <Accordion key={asn.asn_number} defaultExpanded={index === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {asn.asn_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asn.vendor_name}
              </Typography>
              <Chip 
                label={asn.overall_status} 
                color={getStatusColor(asn.overall_status) as any} 
                size="small" 
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption">
                Step {asn.current_step} of 4
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ flex: 2 }}>
                <Stepper orientation="vertical" activeStep={asn.current_step - 1}>
                  {asn.steps.map((step, index) => (
                    <Step key={step.step}>
                      <StepLabel
                        icon={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: step.status === 'COMPLETED' ? 'success.main' : 
                                    step.status === 'IN_PROGRESS' ? 'info.main' : 'grey.300',
                            color: 'white'
                          }}>
                            {step.status === 'COMPLETED' ? <CheckCircleIcon fontSize="small" /> : 
                             getStepIcon(step.step, step.status)}
                          </Box>
                        }
                      >
                        <Box>
                          <Typography variant="subtitle2">{step.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.status === 'COMPLETED' && step.completed_date 
                              ? `Completed: ${new Date(step.completed_date).toLocaleString()}`
                              : step.status === 'IN_PROGRESS' 
                              ? 'In Progress...'
                              : 'Pending'}
                          </Typography>
                          {step.notes && (
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                              {step.notes}
                            </Typography>
                          )}
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Line Summary</Typography>
                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr' }}>
                  <Box>
                    <Typography variant="caption" display="block">Total Lines</Typography>
                    <Typography variant="body2" fontWeight="bold">{asn.line_summary.total_lines}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Received</Typography>
                    <Typography variant="body2" fontWeight="bold">{asn.line_summary.received}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Putaway Complete</Typography>
                    <Typography variant="body2" fontWeight="bold">{asn.line_summary.putaway_complete}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">In Inventory</Typography>
                    <Typography variant="body2" fontWeight="bold">{asn.line_summary.in_inventory}</Typography>
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={(asn.line_summary.in_inventory / asn.line_summary.total_lines) * 100}
                  sx={{ mt: 2, mb: 1 }}
                />
                <Typography variant="caption">
                  {((asn.line_summary.in_inventory / asn.line_summary.total_lines) * 100).toFixed(0)}% Complete
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button size="small" startIcon={<ViewIcon />}>
                    View Details
                  </Button>
                  <Button size="small" startIcon={<PrintIcon />}>
                    Print Report
                  </Button>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔄 ASN Workflow Integration
      </Typography>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant={activeView === 'overview' ? 'contained' : 'outlined'}
          onClick={() => setActiveView('overview')}
          startIcon={<TimelineIcon />}
        >
          Workflow Overview
        </Button>
        <Button
          variant={activeView === 'create' ? 'contained' : 'outlined'}
          onClick={() => setActiveView('create')}
          startIcon={<ASNIcon />}
        >
          Create ASN
        </Button>
        <Button
          variant={activeView === 'receive' ? 'contained' : 'outlined'}
          onClick={() => setActiveView('receive')}
          startIcon={<ReceiptIcon />}
        >
          Receiving
        </Button>
        <Button
          variant={activeView === 'putaway' ? 'contained' : 'outlined'}
          onClick={() => setActiveView('putaway')}
          startIcon={<PutawayIcon />}
        >
          Putaway
        </Button>
        <Button
          variant={activeView === 'inventory' ? 'contained' : 'outlined'}
          onClick={() => setActiveView('inventory')}
          startIcon={<InventoryIcon />}
        >
          Inventory
        </Button>
      </Box>

      {/* Content Area */}
      {activeView === 'overview' && renderWorkflowOverview()}
      {activeView === 'create' && <InboundSpreadsheet />}
      {activeView === 'receive' && <ReceivingWorkflow />}
      {activeView === 'putaway' && <PutawayWorkflow />}
      {activeView === 'inventory' && <InventoryManagement />}

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

export default ASNWorkflowIntegration;