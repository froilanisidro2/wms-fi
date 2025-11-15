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
  TableRow,
  Chip
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Receipt,
  Assessment,
  Business,
  Settings
} from '@mui/icons-material';
import ASNWorkflowDemo from './ASNWorkflowDemo';

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
const SimpleInbound = () => {
  const [showWorkflowDemo, setShowWorkflowDemo] = React.useState(false);

  if (showWorkflowDemo) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">📤 ASN Workflow Demo</Typography>
          <Button 
            variant="outlined" 
            onClick={() => setShowWorkflowDemo(false)}
          >
            ← Back to Overview
          </Button>
        </Box>
        <ASNWorkflowDemo />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>📤 Inbound Process - ASN Workflow</Typography>
      <Typography paragraph>
        Complete ASN workflow from creation to inventory insertion with receiving and putaway processes.
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">ASN Workflow Progress</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="1. ASN Creation" color="success" />
            <Chip label="2. Physical Receiving" color="info" />
            <Chip label="3. Putaway Process" color="warning" />
            <Chip label="4. Inventory Insertion" color="default" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowWorkflowDemo(true)}
            >
              🚀 Try Interactive ASN Workflow Demo
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>Current Active ASNs</Typography>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon="📝"
            >
              + Create New ASN
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ASN Number</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Lines</TableCell>
                  <TableCell>Current Step</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ASN-20251115-001</TableCell>
                  <TableCell>ABC Trading Corp</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>Putaway</TableCell>
                  <TableCell><Chip label="In Progress" color="info" size="small" /></TableCell>
                  <TableCell>75%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ASN-20251115-002</TableCell>
                  <TableCell>Metro Food Supply</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>Receiving</TableCell>
                  <TableCell><Chip label="Receiving" color="warning" size="small" /></TableCell>
                  <TableCell>60%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ASN-20251114-003</TableCell>
                  <TableCell>Fresh Market Ltd</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>Complete</TableCell>
                  <TableCell><Chip label="Complete" color="success" size="small" /></TableCell>
                  <TableCell>100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

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

// Item Master Setup Component
const ItemMasterSetup = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      item_code: 'PARACETAMOL-500MG',
      item_name: 'Paracetamol 500mg Tablets',
      category: 'Pharmaceutical',
      subcategory: 'Analgesic',
      unit_of_measure: 'TABLETS',
      min_stock: 100,
      max_stock: 1000,
      reorder_level: 200,
      is_active: true,
      doh_registered: true,
      regulatory_code: 'DOH-REG-001'
    },
    {
      id: 2,
      item_code: 'RICE-PREMIUM-25KG',
      item_name: 'Premium Rice 25kg Sack',
      category: 'Food',
      subcategory: 'Grains',
      unit_of_measure: 'SACK',
      min_stock: 50,
      max_stock: 500,
      reorder_level: 100,
      is_active: true,
      doh_registered: false,
      regulatory_code: 'NFA-REG-002'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">📦 Item Master Management</Typography>
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(true)}
        >
          + Add New Item
        </Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Item Categories Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Pharmaceutical (1)" color="primary" />
            <Chip label="Food (1)" color="secondary" />
            <Chip label="Medical Devices (0)" color="default" />
            <Chip label="Personal Care (0)" color="default" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell>Min Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Regulatory</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.item_code}</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.unit_of_measure}</TableCell>
                <TableCell>{item.min_stock}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.is_active ? "Active" : "Inactive"} 
                    color={item.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.doh_registered ? "DOH Registered" : "NFA Registered"} 
                    color={item.doh_registered ? "success" : "info"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Supplier Setup Component
const SupplierSetup = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      supplier_code: 'SUPP001',
      supplier_name: 'Philippine Medical Supplies Inc.',
      business_type: 'Corporation',
      tin_number: '123-456-789-000',
      contact_person: 'Maria Santos',
      email: 'maria@medisupplies.ph',
      phone: '+63-2-8123-4567',
      address: 'Makati City, Metro Manila',
      doh_license: 'DOH-LIC-001',
      is_active: true,
      rating: 'A'
    },
    {
      id: 2,
      supplier_code: 'SUPP002',
      supplier_name: 'Metro Food Distributors',
      business_type: 'Partnership',
      tin_number: '987-654-321-000',
      contact_person: 'Juan Dela Cruz',
      email: 'juan@metrofood.ph',
      phone: '+63-2-8987-6543',
      address: 'Quezon City, Metro Manila',
      doh_license: 'NFA-LIC-002',
      is_active: true,
      rating: 'B+'
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏭 Supplier Management</Typography>
        <Button variant="contained">+ Add New Supplier</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Supplier Performance Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Suppliers: 2" color="primary" />
            <Chip label="Active: 2" color="success" />
            <Chip label="A-Rated: 1" color="info" />
            <Chip label="DOH Licensed: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Code</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>TIN Number</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.supplier_code}</TableCell>
                <TableCell>{supplier.supplier_name}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{supplier.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">{supplier.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{supplier.tin_number}</TableCell>
                <TableCell>{supplier.doh_license}</TableCell>
                <TableCell>
                  <Chip label={supplier.rating} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={supplier.is_active ? "Active" : "Inactive"} 
                    color={supplier.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Customer Setup Component
const CustomerSetup = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      customer_code: 'CUST001',
      customer_name: 'Mercury Drug Corporation',
      business_type: 'Retail Pharmacy',
      tin_number: '111-222-333-000',
      contact_person: 'Anna Reyes',
      email: 'anna@mercurydrug.ph',
      phone: '+63-2-8111-2222',
      billing_address: 'Taguig City, Metro Manila',
      delivery_address: 'Multiple Locations',
      credit_limit: 2000000,
      credit_terms: 30,
      is_active: true
    },
    {
      id: 2,
      customer_code: 'CUST002',
      customer_name: 'SM Supermarket',
      business_type: 'Retail Chain',
      tin_number: '444-555-666-000',
      contact_person: 'Robert Tan',
      email: 'robert@sm.ph',
      phone: '+63-2-8444-5555',
      billing_address: 'Ortigas, Pasig City',
      delivery_address: 'Multiple Stores',
      credit_limit: 5000000,
      credit_terms: 45,
      is_active: true
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">👥 Customer Management</Typography>
        <Button variant="contained">+ Add New Customer</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Customer Portfolio Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Customers: 2" color="primary" />
            <Chip label="Active: 2" color="success" />
            <Chip label="Pharmacy: 1" color="info" />
            <Chip label="Retail Chain: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Code</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Business Type</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Credit Limit</TableCell>
              <TableCell>Credit Terms</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.customer_code}</TableCell>
                <TableCell>{customer.customer_name}</TableCell>
                <TableCell>{customer.business_type}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{customer.contact_person}</Typography>
                    <Typography variant="caption" color="textSecondary">{customer.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>₱{customer.credit_limit.toLocaleString()}</TableCell>
                <TableCell>{customer.credit_terms} days</TableCell>
                <TableCell>
                  <Chip 
                    label={customer.is_active ? "Active" : "Inactive"} 
                    color={customer.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Warehouse Setup Component
const WarehouseSetup = () => {
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      warehouse_code: 'WH001',
      warehouse_name: 'Metro Manila Distribution Center',
      address: 'Laguna Technopark, Santa Rosa, Laguna',
      manager: 'Carlos Rodriguez',
      total_locations: 1250,
      active_locations: 1180,
      capacity_utilization: 85,
      temperature_controlled: true,
      is_active: true
    },
    {
      id: 2,
      warehouse_code: 'WH002',
      warehouse_name: 'Cebu Regional Warehouse',
      address: 'Mactan Economic Zone, Lapu-Lapu City, Cebu',
      manager: 'Elena Fernandez',
      total_locations: 800,
      active_locations: 720,
      capacity_utilization: 72,
      temperature_controlled: false,
      is_active: true
    }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🏢 Warehouse Configuration</Typography>
        <Button variant="contained">+ Add New Warehouse</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Warehouse Network Summary</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Chip label="Total Warehouses: 2" color="primary" />
            <Chip label="Total Locations: 2,050" color="info" />
            <Chip label="Active: 2" color="success" />
            <Chip label="Temperature Controlled: 1" color="secondary" />
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse Code</TableCell>
              <TableCell>Warehouse Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Locations</TableCell>
              <TableCell>Utilization</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.warehouse_code}</TableCell>
                <TableCell>{warehouse.warehouse_name}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.manager}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{warehouse.active_locations}/{warehouse.total_locations}</Typography>
                    <Typography variant="caption" color="textSecondary">Active/Total</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${warehouse.capacity_utilization}%`} 
                    color={warehouse.capacity_utilization > 80 ? "warning" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {warehouse.temperature_controlled && (
                    <Chip label="❄️ Climate Controlled" color="info" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={warehouse.is_active ? "Active" : "Inactive"} 
                    color={warehouse.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Simple Setup Component
const SimpleSetup = () => {
  const [activeSetupTab, setActiveSetupTab] = useState(0);

  const setupTabs = [
    { label: 'Items', icon: '📦' },
    { label: 'Suppliers', icon: '🏭' },
    { label: 'Customers', icon: '👥' },
    { label: 'Warehouses', icon: '🏢' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>⚙️ System Setup & Configuration</Typography>
      <Typography paragraph>
        Configure master data for your Philippine WMS system including items, suppliers, customers, and warehouse locations.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeSetupTab} 
          onChange={(e, newValue) => setActiveSetupTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
        >
          {setupTabs.map((tab, index) => (
            <Tab 
              key={index}
              label={`${tab.icon} ${tab.label}`} 
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Paper>

      <TabPanel value={activeSetupTab} index={0}>
        <ItemMasterSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={1}>
        <SupplierSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={2}>
        <CustomerSetup />
      </TabPanel>
      
      <TabPanel value={activeSetupTab} index={3}>
        <WarehouseSetup />
      </TabPanel>
    </Box>
  );
};

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
              <Tab 
                icon={<Settings />} 
                label="Setup" 
                iconPosition="start"
                {...a11yProps(4)} 
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

          <TabPanel value={tabValue} index={4}>
            <SimpleSetup />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default SimpleWMS;