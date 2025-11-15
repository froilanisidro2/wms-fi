-- =====================================================
-- WMS-FI Database Schema
-- Warehouse Management System for Philippines
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MASTER DATA TABLES
-- =====================================================

-- Companies (for multi-tenant support)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    tin VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Item Master
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    unit_of_measure VARCHAR(20) NOT NULL, -- PCS, KG, BOX, etc.
    item_category VARCHAR(50),
    item_group VARCHAR(50),
    abc_classification VARCHAR(1) CHECK (abc_classification IN ('A', 'B', 'C')),
    
    -- Physical properties
    weight_kg DECIMAL(12,3),
    length_cm DECIMAL(10,2),
    width_cm DECIMAL(10,2),
    height_cm DECIMAL(10,2),
    volume_cbm DECIMAL(12,4),
    
    -- Pallet configuration
    pallet_qty INTEGER DEFAULT 1,
    pallet_height_cm DECIMAL(10,2),
    stackable BOOLEAN DEFAULT true,
    max_stack_height INTEGER DEFAULT 1,
    
    -- Inventory control
    min_stock_level DECIMAL(12,3) DEFAULT 0,
    max_stock_level DECIMAL(12,3),
    reorder_point DECIMAL(12,3),
    
    -- Tracking requirements
    batch_tracking BOOLEAN DEFAULT false,
    serial_tracking BOOLEAN DEFAULT false,
    expiry_tracking BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors/Suppliers
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    vendor_code VARCHAR(30) UNIQUE NOT NULL,
    vendor_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tin VARCHAR(20),
    
    -- Terms
    payment_terms VARCHAR(50),
    delivery_terms VARCHAR(50),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tin VARCHAR(20),
    
    -- Terms
    payment_terms VARCHAR(50),
    delivery_terms VARCHAR(50),
    credit_limit DECIMAL(15,2),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warehouse Locations
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    warehouse_code VARCHAR(20) UNIQUE NOT NULL,
    warehouse_name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage Locations (Zones, Aisles, Racks, Bins)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID REFERENCES warehouses(id),
    location_code VARCHAR(30) UNIQUE NOT NULL,
    location_name VARCHAR(100),
    location_type VARCHAR(20) NOT NULL, -- RECEIVING, STORAGE, PICKING, STAGING, SHIPPING
    zone VARCHAR(20),
    aisle VARCHAR(10),
    rack VARCHAR(10),
    level VARCHAR(10),
    bin VARCHAR(10),
    
    -- Capacity
    max_weight_kg DECIMAL(10,2),
    max_volume_cbm DECIMAL(10,4),
    max_pallets INTEGER,
    
    -- Properties
    temperature_controlled BOOLEAN DEFAULT false,
    hazmat_approved BOOLEAN DEFAULT false,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INBOUND PROCESS TABLES
-- =====================================================

-- ASN (Advance Ship Notice) Header
CREATE TABLE asn_headers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    asn_number VARCHAR(30) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id),
    warehouse_id UUID REFERENCES warehouses(id),
    
    -- Reference numbers
    po_number VARCHAR(50),
    dr_number VARCHAR(50),
    vendor_delivery_note VARCHAR(50),
    
    -- Dates
    asn_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RECEIVED, PUTAWAY, COMPLETED
    
    -- Totals
    total_quantity DECIMAL(15,3),
    total_pallets INTEGER,
    
    -- Audit
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    notes TEXT
);

-- ASN Line Items
CREATE TABLE asn_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asn_header_id UUID REFERENCES asn_headers(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    item_id UUID REFERENCES items(id),
    
    -- Quantities
    expected_quantity DECIMAL(15,3) NOT NULL,
    received_quantity DECIMAL(15,3) DEFAULT 0,
    
    -- Batch/Serial tracking
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    
    -- Pallet information
    pallet_id VARCHAR(30),
    pallet_quantity INTEGER DEFAULT 1,
    
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RECEIVED, PUTAWAY
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asn_header_id, line_number)
);

-- Receiving Transactions
CREATE TABLE receiving_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asn_line_id UUID REFERENCES asn_lines(id),
    item_id UUID REFERENCES items(id),
    
    received_quantity DECIMAL(15,3) NOT NULL,
    damaged_quantity DECIMAL(15,3) DEFAULT 0,
    rejected_quantity DECIMAL(15,3) DEFAULT 0,
    
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    
    pallet_id VARCHAR(30),
    received_location_id UUID REFERENCES locations(id),
    
    received_by UUID,
    received_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    quality_status VARCHAR(20) DEFAULT 'APPROVED', -- APPROVED, REJECTED, QUARANTINE
    quality_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Putaway Transactions
CREATE TABLE putaway_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receiving_transaction_id UUID REFERENCES receiving_transactions(id),
    item_id UUID REFERENCES items(id),
    
    putaway_quantity DECIMAL(15,3) NOT NULL,
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    
    pallet_id VARCHAR(30),
    from_location_id UUID REFERENCES locations(id),
    to_location_id UUID REFERENCES locations(id),
    
    putaway_by UUID,
    putaway_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- OUTBOUND PROCESS TABLES
-- =====================================================

-- Sales Order Header
CREATE TABLE so_headers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    so_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    warehouse_id UUID REFERENCES warehouses(id),
    
    -- Reference
    customer_po VARCHAR(50),
    delivery_note VARCHAR(50),
    
    -- Dates
    so_date DATE NOT NULL,
    requested_delivery_date DATE,
    promised_delivery_date DATE,
    actual_ship_date DATE,
    
    -- Address
    delivery_address TEXT,
    delivery_contact VARCHAR(100),
    delivery_phone VARCHAR(20),
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PICKING, PICKED, SHIPPED, DELIVERED
    priority VARCHAR(10) DEFAULT 'NORMAL', -- URGENT, HIGH, NORMAL, LOW
    
    -- Totals
    total_quantity DECIMAL(15,3),
    total_value DECIMAL(15,2),
    
    -- Audit
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    notes TEXT
);

-- Sales Order Line Items
CREATE TABLE so_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    so_header_id UUID REFERENCES so_headers(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    item_id UUID REFERENCES items(id),
    
    -- Quantities
    ordered_quantity DECIMAL(15,3) NOT NULL,
    allocated_quantity DECIMAL(15,3) DEFAULT 0,
    picked_quantity DECIMAL(15,3) DEFAULT 0,
    shipped_quantity DECIMAL(15,3) DEFAULT 0,
    
    -- Pricing
    unit_price DECIMAL(15,2),
    line_total DECIMAL(15,2),
    
    -- Batch requirements
    required_batch VARCHAR(50),
    required_expiry_date DATE,
    
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ALLOCATED, PICKED, SHIPPED
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(so_header_id, line_number)
);

-- Picking Allocations
CREATE TABLE picking_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    so_line_id UUID REFERENCES so_lines(id),
    item_id UUID REFERENCES items(id),
    location_id UUID REFERENCES locations(id),
    
    allocated_quantity DECIMAL(15,3) NOT NULL,
    picked_quantity DECIMAL(15,3) DEFAULT 0,
    
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    expiry_date DATE,
    
    allocation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    allocation_strategy VARCHAR(20) DEFAULT 'FIFO', -- FIFO, FEFO, LIFO
    
    status VARCHAR(20) DEFAULT 'ALLOCATED', -- ALLOCATED, PICKED, CANCELLED
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Picking Transactions
CREATE TABLE picking_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    picking_allocation_id UUID REFERENCES picking_allocations(id),
    so_line_id UUID REFERENCES so_lines(id),
    item_id UUID REFERENCES items(id),
    
    picked_quantity DECIMAL(15,3) NOT NULL,
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    
    picked_from_location_id UUID REFERENCES locations(id),
    staged_to_location_id UUID REFERENCES locations(id),
    
    picked_by UUID,
    picked_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_by UUID,
    confirmed_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INVENTORY TABLES
-- =====================================================

-- Current Inventory Balance
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    warehouse_id UUID REFERENCES warehouses(id),
    location_id UUID REFERENCES locations(id),
    item_id UUID REFERENCES items(id),
    
    available_quantity DECIMAL(15,3) DEFAULT 0,
    allocated_quantity DECIMAL(15,3) DEFAULT 0,
    picked_quantity DECIMAL(15,3) DEFAULT 0,
    total_quantity DECIMAL(15,3) DEFAULT 0,
    
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    
    status VARCHAR(20) DEFAULT 'AVAILABLE', -- AVAILABLE, ALLOCATED, PICKED, QUARANTINE, DAMAGED
    
    last_movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint separately to handle COALESCE properly
CREATE UNIQUE INDEX idx_inventory_balances_unique 
ON inventory_balances (warehouse_id, location_id, item_id, COALESCE(batch_number, ''), COALESCE(serial_number, ''));

-- Inventory Movement History
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    warehouse_id UUID REFERENCES warehouses(id),
    item_id UUID REFERENCES items(id),
    
    movement_type VARCHAR(20) NOT NULL, -- RECEIPT, PUTAWAY, PICK, ADJUSTMENT, CYCLE_COUNT
    reference_type VARCHAR(20), -- ASN, SO, ADJUSTMENT, CYCLE_COUNT
    reference_id UUID,
    reference_number VARCHAR(50),
    
    from_location_id UUID REFERENCES locations(id),
    to_location_id UUID REFERENCES locations(id),
    
    quantity DECIMAL(15,3) NOT NULL,
    batch_number VARCHAR(50),
    serial_number VARCHAR(100),
    
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    movement_by UUID,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DOCUMENT GENERATION TABLES
-- =====================================================

-- Generated Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type VARCHAR(30) NOT NULL, -- PALLET_TAG, GATE_PASS, PICKLIST, LOADING_CHECKLIST
    reference_type VARCHAR(20) NOT NULL, -- ASN, SO
    reference_id UUID NOT NULL,
    reference_number VARCHAR(50),
    
    document_number VARCHAR(50) UNIQUE,
    file_path VARCHAR(500),
    file_name VARCHAR(200),
    
    generated_by UUID,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    status VARCHAR(20) DEFAULT 'GENERATED' -- GENERATED, PRINTED, VOIDED
);

-- =====================================================
-- USER MANAGEMENT (Basic)
-- =====================================================

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    
    role VARCHAR(20) DEFAULT 'USER', -- ADMIN, MANAGER, SUPERVISOR, USER
    company_id UUID REFERENCES companies(id),
    warehouse_id UUID REFERENCES warehouses(id),
    
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AUDIT TABLES
-- =====================================================

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Item Master indexes
CREATE INDEX idx_items_company_code ON items(company_id, item_code);
CREATE INDEX idx_items_category ON items(item_category, item_group);
CREATE INDEX idx_items_abc ON items(abc_classification);

-- ASN indexes
CREATE INDEX idx_asn_headers_company_status ON asn_headers(company_id, status);
CREATE INDEX idx_asn_headers_vendor_date ON asn_headers(vendor_id, asn_date);
CREATE INDEX idx_asn_lines_asn_item ON asn_lines(asn_header_id, item_id);

-- SO indexes
CREATE INDEX idx_so_headers_company_status ON so_headers(company_id, status);
CREATE INDEX idx_so_headers_customer_date ON so_headers(customer_id, so_date);
CREATE INDEX idx_so_lines_so_item ON so_lines(so_header_id, item_id);

-- Inventory indexes
CREATE INDEX idx_inventory_balances_warehouse_item ON inventory_balances(warehouse_id, item_id);
CREATE INDEX idx_inventory_balances_location ON inventory_balances(location_id);
CREATE INDEX idx_inventory_balances_batch ON inventory_balances(batch_number) WHERE batch_number IS NOT NULL;
CREATE INDEX idx_inventory_balances_expiry ON inventory_balances(expiry_date) WHERE expiry_date IS NOT NULL;

-- Movement indexes
CREATE INDEX idx_inventory_movements_item_date ON inventory_movements(item_id, movement_date);
CREATE INDEX idx_inventory_movements_reference ON inventory_movements(reference_type, reference_id);

-- Location indexes
CREATE INDEX idx_locations_warehouse_type ON locations(warehouse_id, location_type);
CREATE INDEX idx_locations_zone_aisle ON locations(zone, aisle, rack);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asn_headers_updated_at BEFORE UPDATE ON asn_headers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_so_headers_updated_at BEFORE UPDATE ON so_headers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update inventory balance
CREATE OR REPLACE FUNCTION update_inventory_balance(
    p_warehouse_id UUID,
    p_location_id UUID,
    p_item_id UUID,
    p_batch_number VARCHAR DEFAULT NULL,
    p_serial_number VARCHAR DEFAULT NULL,
    p_quantity_change DECIMAL DEFAULT 0,
    p_movement_type VARCHAR DEFAULT 'ADJUSTMENT'
) RETURNS VOID AS $$
DECLARE
    batch_key VARCHAR := COALESCE(p_batch_number, '');
    serial_key VARCHAR := COALESCE(p_serial_number, '');
BEGIN
    -- Insert or update inventory balance
    INSERT INTO inventory_balances (
        warehouse_id, location_id, item_id, batch_number, serial_number,
        available_quantity, total_quantity, last_movement_date
    )
    VALUES (
        p_warehouse_id, p_location_id, p_item_id, p_batch_number, p_serial_number,
        p_quantity_change, p_quantity_change, NOW()
    )
    ON CONFLICT (warehouse_id, location_id, item_id, (COALESCE(batch_number, '')), (COALESCE(serial_number, '')))
    DO UPDATE SET
        available_quantity = inventory_balances.available_quantity + p_quantity_change,
        total_quantity = inventory_balances.total_quantity + p_quantity_change,
        last_movement_date = NOW();
        
    -- Handle allocation/picking adjustments
    IF p_movement_type = 'ALLOCATION' THEN
        UPDATE inventory_balances
        SET 
            available_quantity = available_quantity - p_quantity_change,
            allocated_quantity = allocated_quantity + p_quantity_change
        WHERE warehouse_id = p_warehouse_id 
            AND location_id = p_location_id 
            AND item_id = p_item_id
            AND COALESCE(batch_number, '') = batch_key
            AND COALESCE(serial_number, '') = serial_key;
            
    ELSIF p_movement_type = 'PICK' THEN
        UPDATE inventory_balances
        SET 
            allocated_quantity = allocated_quantity - p_quantity_change,
            picked_quantity = picked_quantity + p_quantity_change
        WHERE warehouse_id = p_warehouse_id 
            AND location_id = p_location_id 
            AND item_id = p_item_id
            AND COALESCE(batch_number, '') = batch_key
            AND COALESCE(serial_number, '') = serial_key;
    END IF;
END;
$$ LANGUAGE plpgsql;