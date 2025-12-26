-- =====================================================
-- Bakhtera-1 Database Schema for Supabase
-- =====================================================
-- This migration creates all tables needed for the application
-- without modifying existing localStorage structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. THEME TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS theme (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    theme_mode TEXT DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. FREIGHT_VENDORS
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    service_type TEXT,
    rating NUMERIC(3,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. FREIGHT_CUSTOMERS
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    company_type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. FREIGHT_BC_CODES (BC Master)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_bc_codes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('inbound', 'outbound', 'monitoring')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. FREIGHT_QUOTATIONS (Pendaftaran/Registration)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_quotations (
    id TEXT PRIMARY KEY,
    quotation_number TEXT UNIQUE NOT NULL,
    customer TEXT NOT NULL,
    customer_id TEXT REFERENCES freight_customers(id),
    bc_document_number TEXT,
    bc_document_date DATE,
    bc_document_type TEXT,
    title TEXT,
    date DATE NOT NULL,
    submission_date DATE,
    valid_until DATE,
    status TEXT DEFAULT 'draft',
    document_status TEXT DEFAULT 'pengajuan' CHECK (document_status IN ('pengajuan', 'approved', 'rejected')),
    customs_status TEXT DEFAULT 'pending',
    type TEXT CHECK (type IN ('inbound', 'outbound')),
    item_code TEXT,
    shipper TEXT,
    origin TEXT,
    destination TEXT,
    packages JSONB,
    services JSONB,
    custom_costs JSONB,
    discount_type TEXT,
    discount_value NUMERIC(15,2),
    tax_rate NUMERIC(5,2),
    subtotal_before_discount NUMERIC(15,2),
    discount_amount NUMERIC(15,2),
    subtotal_after_discount NUMERIC(15,2),
    tax_amount NUMERIC(15,2),
    grand_total NUMERIC(15,2),
    notes TEXT,
    rejection_reason TEXT,
    rejection_date DATE,
    pic TEXT,
    bc_supporting_documents JSONB,
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FREIGHT_INVOICES
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    quotation_id TEXT REFERENCES freight_quotations(id),
    customer_id TEXT REFERENCES freight_customers(id),
    customer_name TEXT,
    date DATE NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'unpaid',
    items JSONB,
    subtotal NUMERIC(15,2),
    tax NUMERIC(15,2),
    discount NUMERIC(15,2),
    grand_total NUMERIC(15,2),
    paid_amount NUMERIC(15,2) DEFAULT 0,
    payment_method TEXT,
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. FREIGHT_INBOUND (Barang Masuk)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_inbound (
    id TEXT PRIMARY KEY,
    pengajuan_id TEXT REFERENCES freight_quotations(id),
    pengajuan_number TEXT,
    customs_doc_type TEXT,
    customs_doc_number TEXT,
    customs_doc_date DATE,
    receipt_number TEXT,
    date DATE NOT NULL,
    sender TEXT,
    item_code TEXT,
    asset_name TEXT,
    quantity INTEGER,
    unit TEXT,
    value NUMERIC(15,2),
    currency TEXT DEFAULT 'IDR',
    item_photo TEXT,
    documents JSONB,
    pic TEXT,
    received_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. FREIGHT_OUTBOUND (Barang Keluar)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_outbound (
    id TEXT PRIMARY KEY,
    pengajuan_id TEXT REFERENCES freight_quotations(id),
    pengajuan_number TEXT,
    customs_doc_type TEXT,
    customs_doc_number TEXT,
    customs_doc_date DATE,
    receipt_number TEXT,
    date DATE NOT NULL,
    destination TEXT,
    receiver TEXT,
    item_code TEXT,
    asset_name TEXT,
    quantity INTEGER,
    unit TEXT,
    value NUMERIC(15,2),
    currency TEXT DEFAULT 'IDR',
    item_photo TEXT,
    documents JSONB,
    pic TEXT,
    shipped_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. FREIGHT_REJECT (Barang Reject)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_reject (
    id TEXT PRIMARY KEY,
    pengajuan_id TEXT REFERENCES freight_quotations(id),
    pengajuan_number TEXT,
    customs_doc_type TEXT,
    customs_doc_number TEXT,
    customs_doc_date DATE,
    receipt_number TEXT,
    date DATE NOT NULL,
    reject_reason TEXT,
    item_code TEXT,
    asset_name TEXT,
    quantity INTEGER,
    unit TEXT,
    value NUMERIC(15,2),
    currency TEXT DEFAULT 'IDR',
    item_photo TEXT,
    documents JSONB,
    pic TEXT,
    inspected_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. FREIGHT_WAREHOUSE (Warehouse Inventory)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_warehouse (
    id TEXT PRIMARY KEY,
    pengajuan_id TEXT REFERENCES freight_quotations(id),
    pengajuan_number TEXT,
    bc_document_number TEXT,
    package_number TEXT,
    item_code TEXT,
    item_name TEXT,
    asset_name TEXT,
    serial_number TEXT,
    quantity INTEGER,
    unit TEXT,
    condition TEXT,
    value NUMERIC(15,2),
    location JSONB,
    entry_date DATE,
    exit_date DATE,
    submission_date DATE,
    remarks TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. FREIGHT_INVENTORY (Item Master)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_inventory (
    id TEXT PRIMARY KEY,
    item_code TEXT UNIQUE NOT NULL,
    item_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. FREIGHT_MUTATION_LOGS (Goods Movement/Pergerakan Barang)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_mutation_logs (
    id TEXT PRIMARY KEY,
    pengajuan_id TEXT REFERENCES freight_quotations(id),
    pengajuan_number TEXT,
    bc_document_number TEXT,
    item_code TEXT,
    item_name TEXT,
    serial_number TEXT,
    date DATE NOT NULL,
    time TEXT,
    pic TEXT,
    total_stock INTEGER,
    mutated_qty INTEGER,
    remaining_stock INTEGER,
    origin TEXT,
    destination TEXT,
    remarks TEXT,
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. FREIGHT_MOVEMENTS (Inventory Movements)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_movements (
    id TEXT PRIMARY KEY,
    inventory_id TEXT,
    movement_type TEXT CHECK (movement_type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    position TEXT,
    origin TEXT,
    destination TEXT,
    date DATE NOT NULL,
    time TEXT,
    pic TEXT,
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 14. FREIGHT_INVENTORY_VERSION (Inventory Versioning)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_inventory_version (
    id TEXT PRIMARY KEY,
    version INTEGER NOT NULL,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. FREIGHT_CUSTOMS (Customs Documentation)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_customs (
    id TEXT PRIMARY KEY,
    quotation_id TEXT REFERENCES freight_quotations(id),
    document_type TEXT,
    document_number TEXT,
    document_date DATE,
    status TEXT,
    notes TEXT,
    documents JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 16. FREIGHT_INSPECTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_inspections (
    id TEXT PRIMARY KEY,
    quotation_id TEXT REFERENCES freight_quotations(id),
    inspection_date DATE NOT NULL,
    inspector TEXT,
    status TEXT,
    findings TEXT,
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 17. FREIGHT_PURCHASES
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_purchases (
    id TEXT PRIMARY KEY,
    vendor_id TEXT REFERENCES freight_vendors(id),
    purchase_number TEXT UNIQUE,
    date DATE NOT NULL,
    items JSONB,
    subtotal NUMERIC(15,2),
    tax NUMERIC(15,2),
    total NUMERIC(15,2),
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 18. FREIGHT_FINANCE
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_finance (
    id TEXT PRIMARY KEY,
    type TEXT CHECK (type IN ('income', 'expense')),
    module TEXT,
    category TEXT,
    amount NUMERIC(15,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    reference_id TEXT,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 19. FREIGHT_SHIPMENTS (Blink Module)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_shipments (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    customer_id TEXT REFERENCES freight_customers(id),
    customer_name TEXT,
    vendor_id TEXT REFERENCES freight_vendors(id),
    vendor_name TEXT,
    status TEXT DEFAULT 'pending',
    cost NUMERIC(15,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 20. FREIGHT_ASSETS (Bridge Module)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'available',
    location TEXT,
    value NUMERIC(15,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 21. FREIGHT_EVENTS (Big Module)
-- =====================================================
CREATE TABLE IF NOT EXISTS freight_events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'planning',
    budget NUMERIC(15,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON freight_quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON freight_quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_doc_status ON freight_quotations(document_status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON freight_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_quotation ON freight_invoices(quotation_id);
CREATE INDEX IF NOT EXISTS idx_inbound_pengajuan ON freight_inbound(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_outbound_pengajuan ON freight_outbound(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_reject_pengajuan ON freight_reject(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_pengajuan ON freight_warehouse(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_mutation_pengajuan ON freight_mutation_logs(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_shipments_customer ON freight_shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_type ON freight_finance(type);
CREATE INDEX IF NOT EXISTS idx_finance_module ON freight_finance(module);

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================
COMMENT ON TABLE freight_quotations IS 'Pendaftaran/Registration management for TPPB services';
COMMENT ON TABLE freight_inbound IS 'Barang Masuk - Inbound transactions';
COMMENT ON TABLE freight_outbound IS 'Barang Keluar - Outbound transactions';
COMMENT ON TABLE freight_reject IS 'Barang Reject/Scrap - Rejected items';
COMMENT ON TABLE freight_warehouse IS 'Warehouse inventory tracking';
COMMENT ON TABLE freight_mutation_logs IS 'Pergerakan Barang - Goods movement logs';
COMMENT ON TABLE freight_bc_codes IS 'Master Kode BC - Customs document codes (CEISA 4.0)';
COMMENT ON TABLE freight_inventory IS 'Master Kode Barang - Item master data';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
