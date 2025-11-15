import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi } from 'ag-grid-community';
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
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  Inventory as InventoryIcon,
  TrendingDown as LowStockIcon,
  Schedule as ExpiryIcon,
  LocalShipping as AllocatedIcon
} from '@mui/icons-material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface InventoryBalance {
  id: string;
  item_code: string;
  item_name: string;
  location_code: string;
  batch_number?: string;
  expiry_date?: string;
  on_hand_qty: number;
  allocated_qty: number;
  available_qty: number;
  unit_cost: number;
  total_value: number;
  last_movement_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'QUARANTINE' | 'DAMAGED';
  min_stock_level?: number;
  max_stock_level?: number;
  category?: string;
  supplier?: string;
}

interface InventoryFilters {
  warehouse: string;
  category: string;
  status: string;
  lowStock: boolean;
  expiringSoon: boolean;
  itemSearch: string;
}

const InventoryView: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [inventoryData, setInventoryData] = useState<InventoryBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<InventoryFilters>({
    warehouse: '',
    category: '',
    status: '',
    lowStock: false,
    expiringSoon: false,
    itemSearch: ''
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Column definitions for AG Grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Item Code',
      field: 'item_code',
      width: 120,
      pinned: 'left',
      cellStyle: { fontWeight: 'bold' },
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      width: 200,
      pinned: 'left',
      tooltipField: 'item_name',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Location',
      field: 'location_code',
      width: 100,
      cellRenderer: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon fontSize="small" />
          {params.value}
        </Box>
      ),
      filter: 'agSetColumnFilter'
    },
    {
      headerName: 'Batch/Lot',
      field: 'batch_number',
      width: 120,
      cellStyle: function(params: any) {
        if (params.value) {
          return { backgroundColor: '#e8f5e8' };
        }
        return { color: '#999' };
      },
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Expiry Date',
      field: 'expiry_date',
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return '-';
        
        const expiryDate = new Date(params.value);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let color = 'default';
        let icon = null;
        
        if (daysUntilExpiry < 0) {
          color = 'error';
          icon = <WarningIcon fontSize="small" />;
        } else if (daysUntilExpiry <= 30) {
          color = 'warning';
          icon = <ExpiryIcon fontSize="small" />;
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Chip
              label={params.value}
              color={color as any}
              size="small"
              variant={daysUntilExpiry < 0 ? 'filled' : 'outlined'}
            />
          </Box>
        );
      },
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'On Hand',
      field: 'on_hand_qty',
      width: 100,
      type: 'numericColumn',
      cellRenderer: (params: any) => {
        const lowStock = params.data?.min_stock_level && params.value < params.data.min_stock_level;
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: lowStock ? 'error.main' : 'inherit'
          }}>
            {lowStock && <LowStockIcon fontSize="small" />}
            {params.value?.toFixed(3)}
          </Box>
        );
      },
      cellStyle: function(params: any) {
        const lowStock = params.data?.min_stock_level && params.value < params.data.min_stock_level;
        return lowStock ? { backgroundColor: '#ffebee', fontWeight: 'bold' } : {};
      }
    },
    {
      headerName: 'Allocated',
      field: 'allocated_qty',
      width: 100,
      type: 'numericColumn',
      cellRenderer: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value > 0 && <AllocatedIcon fontSize="small" color="info" />}
          {params.value?.toFixed(3)}
        </Box>
      ),
      cellStyle: function(params: any) {
        return params.value > 0 ? { backgroundColor: '#e3f2fd' } : {};
      }
    },
    {
      headerName: 'Available',
      field: 'available_qty',
      width: 100,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#f0fff0', fontWeight: 'bold' },
      valueFormatter: (params) => params.value?.toFixed(3)
    },
    {
      headerName: 'Unit Cost',
      field: 'unit_cost',
      width: 110,
      type: 'numericColumn',
      valueFormatter: (params) => params.value ? `₱${params.value.toFixed(2)}` : '',
      filter: 'agNumberColumnFilter'
    },
    {
      headerName: 'Total Value',
      field: 'total_value',
      width: 120,
      type: 'numericColumn',
      cellStyle: { backgroundColor: '#fff3e0', fontWeight: 'bold' },
      valueFormatter: (params) => params.value ? `₱${params.value.toLocaleString('en-PH', {minimumFractionDigits: 2})}` : '',
      filter: 'agNumberColumnFilter'
    },
    {
      headerName: 'Min/Max Stock',
      field: 'stock_levels',
      width: 130,
      cellRenderer: (params: any) => {
        const { min_stock_level, max_stock_level } = params.data;
        if (!min_stock_level && !max_stock_level) return '-';
        return `${min_stock_level || 0} / ${max_stock_level || 0}`;
      },
      sortable: false
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params: any) => {
        const colors = {
          'ACTIVE': 'success',
          'EXPIRED': 'error',
          'QUARANTINE': 'warning',
          'DAMAGED': 'error'
        };
        return (
          <Chip
            label={params.value}
            color={colors[params.value as keyof typeof colors] as any}
            size="small"
          />
        );
      },
      filter: 'agSetColumnFilter'
    },
    {
      headerName: 'Category',
      field: 'category',
      width: 120,
      filter: 'agSetColumnFilter'
    },
    {
      headerName: 'Supplier',
      field: 'supplier',
      width: 120,
      filter: 'agSetColumnFilter'
    },
    {
      headerName: 'Last Movement',
      field: 'last_movement_date',
      width: 130,
      valueFormatter: (params) => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-PH');
      },
      filter: 'agDateColumnFilter'
    }
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    enableCellChangeFlash: true
  }), []);

  // Grid options
  const gridOptions = useMemo(() => ({
    enableRangeSelection: true,
    rowSelection: 'multiple',
    animateRows: true,
    rowHeight: 45,
    headerHeight: 50,
    suppressCellFocus: true,
    enableBrowserTooltips: true
  }), []);

  // Load inventory data
  const loadInventoryData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // For now, we'll use sample data
      const sampleData: InventoryBalance[] = [
        {
          id: '1',
          item_code: 'ITM-001',
          item_name: 'Rice Premium 25kg',
          location_code: 'A-01-001',
          batch_number: 'BATCH-20240801',
          expiry_date: '2025-08-01',
          on_hand_qty: 150,
          allocated_qty: 25,
          available_qty: 125,
          unit_cost: 42.50,
          total_value: 6375.00,
          last_movement_date: '2024-11-15',
          status: 'ACTIVE',
          min_stock_level: 50,
          max_stock_level: 500,
          category: 'Grains',
          supplier: 'Rice Corp Philippines'
        },
        {
          id: '2',
          item_code: 'ITM-001',
          item_name: 'Rice Premium 25kg',
          location_code: 'A-01-002',
          batch_number: 'BATCH-20241015',
          expiry_date: '2025-10-15',
          on_hand_qty: 75,
          allocated_qty: 0,
          available_qty: 75,
          unit_cost: 43.00,
          total_value: 3225.00,
          last_movement_date: '2024-11-10',
          status: 'ACTIVE',
          min_stock_level: 50,
          max_stock_level: 500,
          category: 'Grains',
          supplier: 'Rice Corp Philippines'
        },
        {
          id: '3',
          item_code: 'ITM-002',
          item_name: 'Cooking Oil 1L',
          location_code: 'B-02-001',
          batch_number: 'BATCH-20241201',
          expiry_date: '2025-12-01',
          on_hand_qty: 25,
          allocated_qty: 20,
          available_qty: 5,
          unit_cost: 82.00,
          total_value: 2050.00,
          last_movement_date: '2024-11-14',
          status: 'ACTIVE',
          min_stock_level: 30,
          max_stock_level: 200,
          category: 'Cooking Oil',
          supplier: 'Oil Mills Inc'
        },
        {
          id: '4',
          item_code: 'ITM-003',
          item_name: 'Sugar White 50kg',
          location_code: 'C-01-001',
          batch_number: 'BATCH-20241120',
          expiry_date: '2026-11-20',
          on_hand_qty: 80,
          allocated_qty: 15,
          available_qty: 65,
          unit_cost: 52.00,
          total_value: 4160.00,
          last_movement_date: '2024-11-12',
          status: 'ACTIVE',
          min_stock_level: 25,
          max_stock_level: 300,
          category: 'Sweeteners',
          supplier: 'Central Azucarera'
        },
        {
          id: '5',
          item_code: 'ITM-004',
          item_name: 'Canned Sardines 155g',
          location_code: 'D-03-001',
          batch_number: 'BATCH-20231115',
          expiry_date: '2024-11-15',
          on_hand_qty: 200,
          allocated_qty: 0,
          available_qty: 0, // Expired
          unit_cost: 28.50,
          total_value: 5700.00,
          last_movement_date: '2024-05-20',
          status: 'EXPIRED',
          min_stock_level: 100,
          max_stock_level: 1000,
          category: 'Canned Goods',
          supplier: 'Pacific Seafoods'
        },
        {
          id: '6',
          item_code: 'ITM-005',
          item_name: 'Instant Noodles 70g',
          location_code: 'E-01-001',
          batch_number: 'BATCH-20241210',
          expiry_date: '2025-02-10',
          on_hand_qty: 15,
          allocated_qty: 0,
          available_qty: 15,
          unit_cost: 12.75,
          total_value: 191.25,
          last_movement_date: '2024-11-01',
          status: 'ACTIVE',
          min_stock_level: 50,
          max_stock_level: 500,
          category: 'Instant Foods',
          supplier: 'Noodle Factory Ltd'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInventoryData(sampleData);
      setSnackbar({
        open: true,
        message: `Loaded ${sampleData.length} inventory records`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load inventory data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter inventory data based on filters
  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      // Warehouse filter (by location prefix)
      if (filters.warehouse && !item.location_code.startsWith(filters.warehouse)) {
        return false;
      }

      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Low stock filter
      if (filters.lowStock) {
        if (!item.min_stock_level || item.on_hand_qty >= item.min_stock_level) {
          return false;
        }
      }

      // Expiring soon filter (within 30 days)
      if (filters.expiringSoon) {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry > 30) {
          return false;
        }
      }

      // Item search filter
      if (filters.itemSearch) {
        const searchTerm = filters.itemSearch.toLowerCase();
        if (!item.item_code.toLowerCase().includes(searchTerm) &&
            !item.item_name.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [inventoryData, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = filteredData.length;
    const totalValue = filteredData.reduce((sum, item) => sum + item.total_value, 0);
    const lowStockItems = filteredData.filter(item => 
      item.min_stock_level && item.on_hand_qty < item.min_stock_level
    ).length;
    const expiredItems = filteredData.filter(item => item.status === 'EXPIRED').length;
    const expiringSoonItems = filteredData.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    }).length;

    return { totalItems, totalValue, lowStockItems, expiredItems, expiringSoonItems };
  }, [filteredData]);

  // Load data on component mount
  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          📦 Inventory Management - Real-time View
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Monitor inventory levels, track batches, and manage stock across all warehouse locations.
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon />
                  <Box>
                    <Typography variant="h6">{summaryStats.totalItems}</Typography>
                    <Typography variant="caption">Total Items</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon />
                  <Box>
                    <Typography variant="h6">₱{summaryStats.totalValue.toLocaleString('en-PH')}</Typography>
                    <Typography variant="caption">Total Value</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LowStockIcon />
                  <Box>
                    <Typography variant="h6">{summaryStats.lowStockItems}</Typography>
                    <Typography variant="caption">Low Stock</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ExpiryIcon />
                  <Box>
                    <Typography variant="h6">{summaryStats.expiringSoonItems}</Typography>
                    <Typography variant="caption">Expiring (30d)</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon />
                  <Box>
                    <Typography variant="h6">{summaryStats.expiredItems}</Typography>
                    <Typography variant="caption">Expired</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters */}
      <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Search Items"
              size="small"
              fullWidth
              value={filters.itemSearch}
              onChange={(e) => setFilters({...filters, itemSearch: e.target.value})}
              placeholder="Item code or name"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Warehouse</InputLabel>
              <Select
                value={filters.warehouse}
                label="Warehouse"
                onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="A">Zone A</MenuItem>
                <MenuItem value="B">Zone B</MenuItem>
                <MenuItem value="C">Zone C</MenuItem>
                <MenuItem value="D">Zone D</MenuItem>
                <MenuItem value="E">Zone E</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Grains">Grains</MenuItem>
                <MenuItem value="Cooking Oil">Cooking Oil</MenuItem>
                <MenuItem value="Sweeteners">Sweeteners</MenuItem>
                <MenuItem value="Canned Goods">Canned Goods</MenuItem>
                <MenuItem value="Instant Foods">Instant Foods</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
                <MenuItem value="QUARANTINE">Quarantine</MenuItem>
                <MenuItem value="DAMAGED">Damaged</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant={filters.lowStock ? "contained" : "outlined"}
              size="small"
              fullWidth
              onClick={() => setFilters({...filters, lowStock: !filters.lowStock})}
              startIcon={<LowStockIcon />}
            >
              Low Stock
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant={filters.expiringSoon ? "contained" : "outlined"}
              size="small"
              fullWidth
              onClick={() => setFilters({...filters, expiringSoon: !filters.expiringSoon})}
              startIcon={<ExpiryIcon />}
            >
              Expiring Soon
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Toolbar */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Tooltip title="Refresh inventory data">
            <IconButton onClick={loadInventoryData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="body2" sx={{ ml: 2 }}>
            Showing {filteredData.length} of {inventoryData.length} items
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => {
              // Reset all filters
              setFilters({
                warehouse: '',
                category: '',
                status: '',
                lowStock: false,
                expiringSoon: false,
                itemSearch: ''
              });
            }}
          >
            Clear Filters
          </Button>
        </Toolbar>
      </Paper>

      {/* Inventory Grid */}
      <Paper elevation={1} sx={{ height: 600 }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={filteredData}
            defaultColDef={defaultColDef}
            loading={loading}
            enableRangeSelection={true}
            rowSelection="multiple"
            animateRows={true}
            suppressCellFocus={true}
            enableBrowserTooltips={true}
          />
        </div>
      </Paper>

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

export default InventoryView;