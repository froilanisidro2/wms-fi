import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  LocalShipping,
  Warning,
  CheckCircle,
  Schedule,
  Assignment,
  Refresh,
  Notifications,
  LocationOn,
  Assessment
} from '@mui/icons-material';

interface DashboardMetrics {
  totalInventoryValue: number;
  totalItems: number;
  lowStockAlerts: number;
  expiredItems: number;
  pendingInbound: number;
  pendingOutbound: number;
  dailyMovements: number;
  warehouseUtilization: number;
}

interface RecentActivity {
  id: string;
  type: 'ASN' | 'SO' | 'ADJUSTMENT' | 'TRANSFER';
  reference: string;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  user: string;
}

interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY_WARNING' | 'SYSTEM' | 'COMPLIANCE';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  item_code?: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalInventoryValue: 0,
    totalItems: 0,
    lowStockAlerts: 0,
    expiredItems: 0,
    pendingInbound: 0,
    pendingOutbound: 0,
    dailyMovements: 0,
    warehouseUtilization: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sample metrics data
      const sampleMetrics: DashboardMetrics = {
        totalInventoryValue: 2456780.50,
        totalItems: 1247,
        lowStockAlerts: 8,
        expiredItems: 3,
        pendingInbound: 5,
        pendingOutbound: 12,
        dailyMovements: 156,
        warehouseUtilization: 73.5
      };

      // Sample recent activities
      const sampleActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'ASN',
          reference: 'ASN-20241115-001',
          description: 'Received 500kg Rice Premium from Rice Corp',
          timestamp: '2024-11-15T10:30:00Z',
          status: 'COMPLETED',
          user: 'Juan dela Cruz'
        },
        {
          id: '2',
          type: 'SO',
          reference: 'SO-20241115-002',
          description: 'Shipped order to Metro Retail Corp',
          timestamp: '2024-11-15T09:15:00Z',
          status: 'COMPLETED',
          user: 'Maria Santos'
        },
        {
          id: '3',
          type: 'ADJUSTMENT',
          reference: 'ADJ-20241115-001',
          description: 'Cycle count adjustment for ITM-002',
          timestamp: '2024-11-15T08:45:00Z',
          status: 'PENDING',
          user: 'Pedro Reyes'
        },
        {
          id: '4',
          type: 'SO',
          reference: 'SO-20241114-015',
          description: 'Allocation failed for customer C005',
          timestamp: '2024-11-14T16:20:00Z',
          status: 'FAILED',
          user: 'System'
        },
        {
          id: '5',
          type: 'ASN',
          reference: 'ASN-20241114-008',
          description: 'Quality check completed for Batch-20241110',
          timestamp: '2024-11-14T14:30:00Z',
          status: 'COMPLETED',
          user: 'Ana Garcia'
        }
      ];

      // Sample alerts
      const sampleAlerts: Alert[] = [
        {
          id: '1',
          type: 'LOW_STOCK',
          severity: 'HIGH',
          message: 'Cooking Oil 1L below minimum stock level (5 units remaining)',
          item_code: 'ITM-002',
          timestamp: '2024-11-15T11:00:00Z'
        },
        {
          id: '2',
          type: 'EXPIRY_WARNING',
          severity: 'HIGH',
          message: 'Canned Sardines Batch-20231115 expired on 2024-11-15',
          item_code: 'ITM-004',
          timestamp: '2024-11-15T10:45:00Z'
        },
        {
          id: '3',
          type: 'LOW_STOCK',
          severity: 'MEDIUM',
          message: 'Instant Noodles 70g below minimum stock level (15 units remaining)',
          item_code: 'ITM-005',
          timestamp: '2024-11-15T09:30:00Z'
        },
        {
          id: '4',
          type: 'COMPLIANCE',
          severity: 'MEDIUM',
          message: 'DOH food safety inspection due within 7 days',
          timestamp: '2024-11-15T08:00:00Z'
        },
        {
          id: '5',
          type: 'SYSTEM',
          severity: 'LOW',
          message: 'Database backup completed successfully',
          timestamp: '2024-11-15T02:00:00Z'
        }
      ];

      setMetrics(sampleMetrics);
      setRecentActivities(sampleActivities);
      setAlerts(sampleAlerts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Get priority alerts (HIGH severity)
  const priorityAlerts = useMemo(() => {
    return alerts.filter(alert => alert.severity === 'HIGH').slice(0, 3);
  }, [alerts]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date/time
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  // Get alert severity color
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return <TrendingDown />;
      case 'EXPIRY_WARNING': return <Schedule />;
      case 'COMPLIANCE': return <Assignment />;
      case 'SYSTEM': return <CheckCircle />;
      default: return <Warning />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🇵🇭 Philippine WMS Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time warehouse operations monitoring and analytics
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton onClick={loadDashboardData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(metrics.totalInventoryValue)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Inventory Value
                  </Typography>
                </Box>
                <TrendingUp fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.totalItems.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Items in Stock
                  </Typography>
                </Box>
                <Inventory fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.lowStockAlerts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Low Stock Alerts
                  </Typography>
                </Box>
                <Warning fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metrics.expiredItems}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Expired Items
                  </Typography>
                </Box>
                <Schedule fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Operations Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping />
                Operations Overview
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {metrics.pendingInbound}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Pending Inbound
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {metrics.pendingOutbound}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Pending Outbound
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {metrics.dailyMovements}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Daily Movements
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h5" color="white" fontWeight="bold">
                      {metrics.warehouseUtilization}%
                    </Typography>
                    <Typography variant="body2" color="white">
                      Utilization
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Warehouse Utilization
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.warehouseUtilization} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={metrics.warehouseUtilization > 90 ? 'error' : 'primary'}
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.warehouseUtilization}% of capacity used
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications />
                Priority Alerts
              </Typography>
              
              {priorityAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle color="success" sx={{ fontSize: 48 }} />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    No critical alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All systems operating normally
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {priorityAlerts.map((alert) => (
                    <Alert 
                      key={alert.id}
                      severity={getAlertColor(alert.severity) as any}
                      icon={getAlertIcon(alert.type)}
                      sx={{ mb: 1 }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {alert.message}
                        </Typography>
                        {alert.item_code && (
                          <Typography variant="caption" display="block">
                            Item: {alert.item_code}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(alert.timestamp)}
                        </Typography>
                      </Box>
                    </Alert>
                  ))}
                  <Button size="small" sx={{ mt: 1 }}>
                    View All Alerts ({alerts.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment />
            Recent Activities
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id} hover>
                    <TableCell>
                      <Chip 
                        label={activity.type}
                        size="small"
                        color={activity.type === 'ASN' ? 'primary' : 
                               activity.type === 'SO' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {activity.reference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {activity.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {activity.user}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={activity.status}
                        size="small"
                        color={getStatusColor(activity.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDateTime(activity.timestamp)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;