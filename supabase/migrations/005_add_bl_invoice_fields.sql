-- =====================================================
-- Add BL and Invoice Fields to freight_quotations
-- =====================================================

ALTER TABLE freight_quotations
ADD COLUMN IF NOT EXISTS bl_number TEXT,
ADD COLUMN IF NOT EXISTS bl_date DATE,
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS invoice_value NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS invoice_currency TEXT DEFAULT 'IDR',
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(10,4),
ADD COLUMN IF NOT EXISTS exchange_rate_date DATE;

-- Add comments for documentation
COMMENT ON COLUMN freight_quotations.bl_number IS 'Bill of Lading Number';
COMMENT ON COLUMN freight_quotations.bl_date IS 'Bill of Lading Date';
COMMENT ON COLUMN freight_quotations.invoice_number IS 'Invoice Number';
COMMENT ON COLUMN freight_quotations.invoice_value IS 'Invoice Value';
COMMENT ON COLUMN freight_quotations.invoice_currency IS 'Invoice Currency (USD, EUR, IDR, etc)';
COMMENT ON COLUMN freight_quotations.exchange_rate IS 'Exchange Rate for Invoice';
COMMENT ON COLUMN freight_quotations.exchange_rate_date IS 'Exchange Rate Date';
