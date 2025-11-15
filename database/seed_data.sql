-- =====================================================
-- WMS-FI Seed Data
-- Initial master data for the warehouse management system
-- =====================================================

-- Insert default company
INSERT INTO companies (id, code, name, address, contact_person, phone, email, tin) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'WMS-FI',
    'WMS Philippines Inc.',
    '123 Warehouse District, Laguna, Philippines',
    'John Santos',
    '+63-917-123-4567',
    'admin@wms-fi.com',
    '123-456-789-000'
);

-- Insert default warehouse
INSERT INTO warehouses (id, company_id, warehouse_code, warehouse_name, address, contact_person, phone)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'WH001',
    'Main Warehouse',
    'Zone 1, Warehouse Complex, Laguna, Philippines',
    'Maria Cruz',
    '+63-917-123-4568'
);

-- Insert standard warehouse locations
INSERT INTO locations (warehouse_id, location_code, location_name, location_type, zone, aisle, rack, level, bin, max_pallets) 
VALUES 
-- Receiving Area
('550e8400-e29b-41d4-a716-446655440002', 'RCV-01', 'Receiving Area 1', 'RECEIVING', 'RCV', '', '', '', '', 10),
('550e8400-e29b-41d4-a716-446655440002', 'RCV-02', 'Receiving Area 2', 'RECEIVING', 'RCV', '', '', '', '', 10),

-- Storage Areas
('550e8400-e29b-41d4-a716-446655440002', 'A01-01-01', 'Aisle A01 Rack 01 Level 01', 'STORAGE', 'A', 'A01', '01', '01', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'A01-01-02', 'Aisle A01 Rack 01 Level 02', 'STORAGE', 'A', 'A01', '01', '02', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'A01-01-03', 'Aisle A01 Rack 01 Level 03', 'STORAGE', 'A', 'A01', '01', '03', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'A01-02-01', 'Aisle A01 Rack 02 Level 01', 'STORAGE', 'A', 'A01', '02', '01', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'A01-02-02', 'Aisle A01 Rack 02 Level 02', 'STORAGE', 'A', 'A01', '02', '02', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'A01-02-03', 'Aisle A01 Rack 02 Level 03', 'STORAGE', 'A', 'A01', '02', '03', '', 4),

('550e8400-e29b-41d4-a716-446655440002', 'B01-01-01', 'Aisle B01 Rack 01 Level 01', 'STORAGE', 'B', 'B01', '01', '01', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'B01-01-02', 'Aisle B01 Rack 01 Level 02', 'STORAGE', 'B', 'B01', '01', '02', '', 4),
('550e8400-e29b-41d4-a716-446655440002', 'B01-01-03', 'Aisle B01 Rack 01 Level 03', 'STORAGE', 'B', 'B01', '01', '03', '', 4),

-- Picking Areas
('550e8400-e29b-41d4-a716-446655440002', 'PCK-01', 'Picking Area 1', 'PICKING', 'PCK', '', '', '', '', 8),
('550e8400-e29b-41d4-a716-446655440002', 'PCK-02', 'Picking Area 2', 'PICKING', 'PCK', '', '', '', '', 8),

-- Staging Areas
('550e8400-e29b-41d4-a716-446655440002', 'STG-01', 'Staging Area 1', 'STAGING', 'STG', '', '', '', '', 12),
('550e8400-e29b-41d4-a716-446655440002', 'STG-02', 'Staging Area 2', 'STAGING', 'STG', '', '', '', '', 12),

-- Shipping Areas
('550e8400-e29b-41d4-a716-446655440002', 'SHP-01', 'Shipping Dock 1', 'SHIPPING', 'SHP', '', '', '', '', 15),
('550e8400-e29b-41d4-a716-446655440002', 'SHP-02', 'Shipping Dock 2', 'SHIPPING', 'SHP', '', '', '', '', 15);

-- Insert sample vendors
INSERT INTO vendors (company_id, vendor_code, vendor_name, contact_person, address, phone, email, tin, payment_terms)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'V001', 'ABC Trading Corp', 'Juan Dela Cruz', '456 Supply St., Manila, Philippines', '+63-2-123-4567', 'juan@abctrading.com', '123-456-789-001', '30 Days'),
('550e8400-e29b-41d4-a716-446655440001', 'V002', 'XYZ Manufacturing Inc', 'Ana Garcia', '789 Industrial Ave., Cavite, Philippines', '+63-46-123-4567', 'ana@xyzmanuf.com', '123-456-789-002', '45 Days'),
('550e8400-e29b-41d4-a716-446655440001', 'V003', 'Global Imports Ltd', 'Carlos Reyes', '321 Port Area, Manila, Philippines', '+63-2-234-5678', 'carlos@globalimports.com', '123-456-789-003', '60 Days');

-- Insert sample customers
INSERT INTO customers (company_id, customer_code, customer_name, contact_person, address, phone, email, tin, payment_terms, credit_limit)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'C001', 'Metro Retail Corp', 'Lisa Santos', '123 Retail Plaza, Makati, Philippines', '+63-2-345-6789', 'lisa@metroretail.com', '234-567-890-001', '30 Days', 1000000.00),
('550e8400-e29b-41d4-a716-446655440001', 'C002', 'SuperMart Chain', 'Roberto Cruz', '456 Mall Complex, QC, Philippines', '+63-2-456-7890', 'roberto@supermart.com', '234-567-890-002', '15 Days', 500000.00),
('550e8400-e29b-41d4-a716-446655440001', 'C003', 'Online Store Philippines', 'Maria Fernandez', '789 E-commerce Hub, BGC, Philippines', '+63-917-567-8901', 'maria@onlinestore.ph', '234-567-890-003', '7 Days', 250000.00);

-- Insert sample items
INSERT INTO items (
    company_id, item_code, item_name, description, unit_of_measure, item_category, item_group, 
    abc_classification, weight_kg, length_cm, width_cm, height_cm, volume_cbm, 
    pallet_qty, pallet_height_cm, stackable, max_stack_height, 
    min_stock_level, max_stock_level, reorder_point, 
    batch_tracking, expiry_tracking, shelf_life_days
) VALUES 
-- Fast Moving Items (A Classification)
('550e8400-e29b-41d4-a716-446655440001', 'ITM-001', 'Rice Premium 25kg', 'Premium quality rice 25kg bag', 'BAG', 'FOOD', 'GRAINS', 'A', 25.0, 60, 40, 15, 0.036, 40, 60, true, 4, 100, 1000, 200, true, false, 365),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-002', 'Cooking Oil 1L', 'Premium cooking oil 1 liter bottle', 'BTL', 'FOOD', 'OIL', 'A', 0.92, 25, 25, 28, 0.0175, 48, 140, true, 5, 200, 2000, 400, true, true, 730),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-003', 'Sugar White 50kg', 'Refined white sugar 50kg sack', 'SACK', 'FOOD', 'SWEETENER', 'A', 50.0, 80, 50, 20, 0.08, 20, 40, true, 2, 50, 500, 100, true, false, 1095),

-- Medium Moving Items (B Classification)
('550e8400-e29b-41d4-a716-446655440001', 'ITM-004', 'Flour All Purpose 25kg', 'All purpose flour 25kg bag', 'BAG', 'FOOD', 'FLOUR', 'B', 25.0, 60, 40, 15, 0.036, 40, 60, true, 4, 50, 500, 100, true, true, 365),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-005', 'Salt Iodized 1kg', 'Iodized table salt 1kg pack', 'PCK', 'FOOD', 'SEASONING', 'B', 1.0, 20, 15, 5, 0.0015, 100, 15, true, 10, 100, 1000, 200, false, false, 1825),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-006', 'Soy Sauce 500ml', 'Premium soy sauce 500ml bottle', 'BTL', 'FOOD', 'CONDIMENT', 'B', 0.55, 20, 20, 25, 0.01, 60, 150, true, 6, 100, 800, 150, true, true, 1095),

-- Slow Moving Items (C Classification)
('550e8400-e29b-41d4-a716-446655440001', 'ITM-007', 'Vinegar White 750ml', 'White vinegar 750ml bottle', 'BTL', 'FOOD', 'CONDIMENT', 'C', 0.78, 22, 22, 28, 0.0137, 48, 134, true, 5, 50, 300, 75, true, true, 1825),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-008', 'Black Pepper Ground 100g', 'Ground black pepper 100g container', 'CTN', 'FOOD', 'SPICE', 'C', 0.1, 8, 8, 12, 0.000768, 200, 24, true, 20, 20, 200, 40, true, true, 730),

-- Non-Food Items
('550e8400-e29b-41d4-a716-446655440001', 'ITM-009', 'Detergent Powder 3kg', 'Laundry detergent powder 3kg box', 'BOX', 'HOUSEHOLD', 'CLEANING', 'B', 3.0, 30, 25, 20, 0.015, 32, 64, true, 8, 50, 400, 80, false, false, 1095),
('550e8400-e29b-41d4-a716-446655440001', 'ITM-010', 'Shampoo 400ml', 'Hair shampoo 400ml bottle', 'BTL', 'PERSONAL_CARE', 'HAIR_CARE', 'C', 0.42, 18, 18, 22, 0.0071, 48, 106, true, 8, 30, 250, 50, true, true, 1095);

-- Insert default admin user
INSERT INTO users (id, username, email, password_hash, first_name, last_name, role, company_id)
VALUES (
    '550e8400-e29b-41d4-a716-446655440010',
    'admin',
    'admin@wms-fi.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw2x5D1C2wQ9Z7X8Y', -- password: admin123
    'Admin',
    'User',
    'ADMIN',
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Insert sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, role, company_id, warehouse_id)
VALUES 
('warehouse_mgr', 'warehouse@wms-fi.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw2x5D1C2wQ9Z7X8Y', 'Warehouse', 'Manager', 'MANAGER', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('receiving_sup', 'receiving@wms-fi.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw2x5D1C2wQ9Z7X8Y', 'Receiving', 'Supervisor', 'SUPERVISOR', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('picking_sup', 'picking@wms-fi.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw2x5D1C2wQ9Z7X8Y', 'Picking', 'Supervisor', 'SUPERVISOR', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('warehouse_user', 'user@wms-fi.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lw2x5D1C2wQ9Z7X8Y', 'Warehouse', 'User', 'USER', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');

-- Create sample inventory with some initial stock
INSERT INTO inventory_balances (
    company_id, warehouse_id, location_id, item_id, 
    available_quantity, total_quantity, batch_number, manufacturing_date, expiry_date
) 
SELECT 
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    l.id,
    i.id,
    CASE 
        WHEN i.abc_classification = 'A' THEN RANDOM() * 500 + 100
        WHEN i.abc_classification = 'B' THEN RANDOM() * 300 + 50
        ELSE RANDOM() * 100 + 20
    END,
    CASE 
        WHEN i.abc_classification = 'A' THEN RANDOM() * 500 + 100
        WHEN i.abc_classification = 'B' THEN RANDOM() * 300 + 50
        ELSE RANDOM() * 100 + 20
    END,
    CASE 
        WHEN i.batch_tracking THEN 'BATCH-' || TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')
        ELSE NULL
    END,
    CASE 
        WHEN i.batch_tracking THEN CURRENT_DATE - INTERVAL '30 days'
        ELSE NULL
    END,
    CASE 
        WHEN i.expiry_tracking THEN CURRENT_DATE + INTERVAL '1 year'
        ELSE NULL
    END
FROM items i
CROSS JOIN (
    SELECT id FROM locations 
    WHERE location_type = 'STORAGE' 
    LIMIT 5
) l
WHERE i.item_code IN ('ITM-001', 'ITM-002', 'ITM-003', 'ITM-004', 'ITM-005');

-- Create some sample ASN data
INSERT INTO asn_headers (
    company_id, asn_number, vendor_id, warehouse_id, po_number, dr_number,
    asn_date, expected_delivery_date, status, total_quantity, total_pallets
)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001',
    'ASN-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001',
    v.id,
    '550e8400-e29b-41d4-a716-446655440002',
    'PO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001',
    'DR-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 day',
    'PENDING',
    1000,
    5
FROM vendors v
WHERE v.vendor_code = 'V001'
LIMIT 1;

-- Get the ASN ID for line items
DO $$
DECLARE
    asn_id UUID;
BEGIN
    SELECT id INTO asn_id FROM asn_headers WHERE asn_number = 'ASN-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001';
    
    -- Insert ASN line items
    INSERT INTO asn_lines (asn_header_id, line_number, item_id, expected_quantity, batch_number, pallet_id, pallet_quantity)
    SELECT 
        asn_id,
        ROW_NUMBER() OVER(),
        i.id,
        CASE 
            WHEN i.abc_classification = 'A' THEN 200
            WHEN i.abc_classification = 'B' THEN 100
            ELSE 50
        END,
        CASE 
            WHEN i.batch_tracking THEN 'BATCH-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD')
            ELSE NULL
        END,
        'PLT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(ROW_NUMBER() OVER()::text, 3, '0'),
        1
    FROM items i
    WHERE i.item_code IN ('ITM-001', 'ITM-002', 'ITM-003')
    LIMIT 3;
END $$;

-- Create sample Sales Order
INSERT INTO so_headers (
    company_id, so_number, customer_id, warehouse_id, customer_po, 
    so_date, requested_delivery_date, status, total_quantity, delivery_address
)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001',
    'SO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001',
    c.id,
    '550e8400-e29b-41d4-a716-446655440002',
    'CUST-PO-001',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    'PENDING',
    150,
    '456 Customer Address, Manila, Philippines'
FROM customers c
WHERE c.customer_code = 'C001'
LIMIT 1;

-- Get the SO ID for line items
DO $$
DECLARE
    so_id UUID;
BEGIN
    SELECT id INTO so_id FROM so_headers WHERE so_number = 'SO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001';
    
    -- Insert SO line items
    INSERT INTO so_lines (so_header_id, line_number, item_id, ordered_quantity, unit_price, line_total)
    SELECT 
        so_id,
        ROW_NUMBER() OVER(),
        i.id,
        CASE 
            WHEN i.abc_classification = 'A' THEN 50
            WHEN i.abc_classification = 'B' THEN 30
            ELSE 20
        END,
        CASE 
            WHEN i.item_code = 'ITM-001' THEN 45.00
            WHEN i.item_code = 'ITM-002' THEN 85.00
            WHEN i.item_code = 'ITM-003' THEN 55.00
            ELSE 25.00
        END,
        CASE 
            WHEN i.item_code = 'ITM-001' THEN 50 * 45.00
            WHEN i.item_code = 'ITM-002' THEN 30 * 85.00
            WHEN i.item_code = 'ITM-003' THEN 20 * 55.00
            ELSE 20 * 25.00
        END
    FROM items i
    WHERE i.item_code IN ('ITM-001', 'ITM-002', 'ITM-003')
    LIMIT 3;
END $$;

-- Create views for easier data access
CREATE VIEW v_current_inventory AS
SELECT 
    c.name as company_name,
    w.warehouse_name,
    l.location_code,
    i.item_code,
    i.item_name,
    i.unit_of_measure,
    ib.available_quantity,
    ib.allocated_quantity,
    ib.picked_quantity,
    ib.total_quantity,
    ib.batch_number,
    ib.expiry_date,
    ib.status,
    ib.last_movement_date
FROM inventory_balances ib
JOIN companies c ON ib.company_id = c.id
JOIN warehouses w ON ib.warehouse_id = w.id
JOIN locations l ON ib.location_id = l.id
JOIN items i ON ib.item_id = i.id
WHERE ib.total_quantity > 0
ORDER BY i.item_code, l.location_code;

CREATE VIEW v_asn_details AS
SELECT 
    ah.asn_number,
    ah.asn_date,
    ah.expected_delivery_date,
    ah.status as asn_status,
    v.vendor_name,
    al.line_number,
    i.item_code,
    i.item_name,
    al.expected_quantity,
    al.received_quantity,
    al.batch_number,
    al.pallet_id,
    al.status as line_status
FROM asn_headers ah
JOIN vendors v ON ah.vendor_id = v.id
JOIN asn_lines al ON ah.id = al.asn_header_id
JOIN items i ON al.item_id = i.id
ORDER BY ah.asn_number, al.line_number;

CREATE VIEW v_so_details AS
SELECT 
    sh.so_number,
    sh.so_date,
    sh.requested_delivery_date,
    sh.status as so_status,
    c.customer_name,
    sl.line_number,
    i.item_code,
    i.item_name,
    sl.ordered_quantity,
    sl.allocated_quantity,
    sl.picked_quantity,
    sl.shipped_quantity,
    sl.unit_price,
    sl.line_total,
    sl.status as line_status
FROM so_headers sh
JOIN customers c ON sh.customer_id = c.id
JOIN so_lines sl ON sh.id = sl.so_header_id
JOIN items i ON sl.item_id = i.id
ORDER BY sh.so_number, sl.line_number;

-- Create sequences for document numbering
CREATE SEQUENCE seq_asn_number START 1;
CREATE SEQUENCE seq_so_number START 1;
CREATE SEQUENCE seq_pallet_number START 1;
CREATE SEQUENCE seq_document_number START 1;