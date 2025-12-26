-- =====================================================
-- 002_add_missing_columns.sql
-- Add missing columns for Vendors and Customers to match UI
-- =====================================================

-- FREIGHT_VENDORS
ALTER TABLE freight_vendors ADD COLUMN IF NOT EXISTS npwp TEXT;
ALTER TABLE freight_vendors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE freight_vendors ADD COLUMN IF NOT EXISTS category TEXT; -- To match 'category' in UI

-- FREIGHT_CUSTOMERS
ALTER TABLE freight_customers ADD COLUMN IF NOT EXISTS npwp TEXT;
ALTER TABLE freight_customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE freight_customers ADD COLUMN IF NOT EXISTS company TEXT;

-- Comments
COMMENT ON COLUMN freight_vendors.category IS 'Vendor category (e.g. Shipping, Warehouse) matching UI';
COMMENT ON COLUMN freight_customers.company IS 'Company name if different from Customer Name';
