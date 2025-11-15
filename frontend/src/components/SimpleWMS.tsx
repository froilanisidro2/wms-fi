import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Receipt,
  Assessment,
  Business
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wms-tabpanel-${index}`}
      aria-labelledby={`wms-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `wms-tab-${index}`,
    'aria-controls': `wms-tabpanel-${index}`,
  };
}

// Philippine-themed color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
    },
    secondary: {
      main: '#FFC72C',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
  },
});

// Simple Dashboard Component
const SimpleDashboard = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      🇵🇭 Philippine WMS Dashboard
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Card sx={{ minWidth: 200, bgcolor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">₱2,456,780</Typography>
          <Typography variant="body2">Total Inventory Value</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'success.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">1,247</Typography>
          <Typography variant="body2">Items in Stock</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'warning.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">8</Typography>
          <Typography variant="body2">Low Stock Alerts</Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, bgcolor: 'error.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h5">3</Typography>
          <Typography variant="body2">Expired Items</Typography>
        </CardContent>
      </Card>
    </Box>

    <Typography variant="h6" gutterBottom>Recent Activities</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ASN-20241115-001</TableCell>
            <TableCell>Received 500kg Rice Premium</TableCell>
            <TableCell>Juan dela Cruz</TableCell>
            <TableCell>10:30 AM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SO-20241115-002</TableCell>
            <TableCell>Shipped order to Metro Retail</TableCell>
            <TableCell>Maria Santos</TableCell>
            <TableCell>09:15 AM</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Simple Inbound Component
const SimpleInbound = () => (
  <Box>
    <Typography variant="h4" gutterBottom>📤 Inbound Process - ASN</Typography>
    <Typography paragraph>
      Advanced Shipping Notice (ASN) creation with spreadsheet-like interface.
    </Typography>
    
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">ASN Header</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined">ASN-20241115-001</Button>
          <Button variant="outlined">Supplier: Rice Corp</Button>
          <Button variant="outlined">Expected: Nov 15, 2024</Button>
        </Box>
      </CardContent>
    </Card>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Expected Qty</TableCell>
            <TableCell>Received Qty</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Expiry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ITM-001</TableCell>
            <TableCell>Rice Premium 25kg</TableCell>
            <TableCell>50</TableCell>
            <TableCell>50</TableCell>
            <TableCell>BATCH-20241115</TableCell>
            <TableCell>2025-08-15</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-002</TableCell>
            <TableCell>Cooking Oil 1L</TableCell>
            <TableCell>30</TableCell>
            <TableCell>30</TableCell>
            <TableCell>BATCH-20241115</TableCell>
            <TableCell>2025-12-15</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Simple Outbound Component  
const SimpleOutbound = () => (
  <Box>
    <Typography variant="h4" gutterBottom>🚚 Outbound Process - SO</Typography>
    <Typography paragraph>
      Sales Order management with FIFO/FEFO allocation strategy.
    </Typography>

    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">SO Header</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined">SO-20241115-001</Button>
          <Button variant="outlined">Customer: Metro Retail</Button>
          <Button variant="outlined">Total: ₱15,450.00</Button>
        </Box>
      </CardContent>
    </Card>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Ordered Qty</TableCell>
            <TableCell>Allocated Qty</TableCell>
            <TableCell>Strategy</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ITM-001</TableCell>
            <TableCell>Rice Premium 25kg</TableCell>
            <TableCell>25</TableCell>
            <TableCell>25</TableCell>
            <TableCell>FIFO</TableCell>
            <TableCell>Allocated</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-002</TableCell>
            <TableCell>Cooking Oil 1L</TableCell>
            <TableCell>15</TableCell>
            <TableCell>15</TableCell>
            <TableCell>FEFO</TableCell>
            <TableCell>Allocated</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

// Simple Inventory Component
const SimpleInventory = () => (
  <Box>
    <Typography variant="h4" gutterBottom>📦 Inventory Management</Typography>
    <Typography paragraph>
      Real-time inventory monitoring across all warehouse locations.
    </Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>On Hand</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>ITM-001</TableCell>
            <TableCell>Rice Premium 25kg</TableCell>
            <TableCell>A-01-001</TableCell>
            <TableCell>150.000</TableCell>
            <TableCell>125.000</TableCell>
            <TableCell>BATCH-20240801</TableCell>
            <TableCell>2025-08-01</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-002</TableCell>
            <TableCell>Cooking Oil 1L</TableCell>
            <TableCell>B-02-001</TableCell>
            <TableCell>25.000</TableCell>
            <TableCell>5.000</TableCell>
            <TableCell>BATCH-20241201</TableCell>
            <TableCell>2025-12-01</TableCell>
            <TableCell>Low Stock</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ITM-003</TableCell>
            <TableCell>Sugar White 50kg</TableCell>
            <TableCell>C-01-001</TableCell>
            <TableCell>80.000</TableCell>
            <TableCell>65.000</TableCell>
            <TableCell>BATCH-20241120</TableCell>
            <TableCell>2026-11-20</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

function SimpleWMS() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WMS Philippines - Warehouse Management System
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {new Date().toLocaleDateString('en-PH', { 
              timeZone: 'Asia/Manila',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 2 }}>
        <Paper elevation={1}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="WMS navigation tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                icon={<Assessment />} 
                label="Dashboard" 
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<Receipt />} 
                label="Inbound (ASN)" 
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                icon={<LocalShipping />} 
                label="Outbound (SO)" 
                iconPosition="start"
                {...a11yProps(2)} 
              />
              <Tab 
                icon={<Inventory />} 
                label="Inventory" 
                iconPosition="start"
                {...a11yProps(3)} 
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <SimpleDashboard />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SimpleInbound />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <SimpleOutbound />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <SimpleInventory />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default SimpleWMS;