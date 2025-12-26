# Bakhtera-1 Database Migration Guide

## 📋 Migration Steps

### 1. Open Supabase SQL Editor
Navigate to: https://supabase.com/dashboard/project/nkyoszmtyrpdwfjxggmb/sql

### 2. Copy the Migration SQL
The complete migration SQL is located in:
`supabase/migrations/001_initial_schema.sql`

### 3. Execute the Migration
1. Open the SQL Editor in Supabase Dashboard
2. Create a new query
3. Paste the entire contents of `001_initial_schema.sql`
4. Click "Run" to execute

### 4. Verify Tables Created
After running the migration, verify all 21 tables were created:

**Core Tables:**
- ✅ theme
- ✅ freight_vendors
- ✅ freight_customers
- ✅ freight_bc_codes
- ✅ freight_inventory (Item Master)

**TPPB Workflow Tables:**
- ✅ freight_quotations (Pendaftaran)
- ✅ freight_invoices
- ✅ freight_inbound (Barang Masuk)
- ✅ freight_outbound (Barang Keluar)
- ✅ freight_reject (Barang Reject)

**Warehouse & Movement:**
- ✅ freight_warehouse (Inventaris Gudang)
- ✅ freight_mutation_logs (Pergerakan Barang)
- ✅ freight_movements
- ✅ freight_inventory_version

**Supporting Tables:**
- ✅ freight_customs
- ✅ freight_inspections
- ✅ freight_purchases
- ✅ freight_finance

**Module Tables:**
- ✅ freight_shipments (Blink)
- ✅ freight_assets (Bridge)
- ✅ freight_events (Big)

## 🔍 Verification Query

Run this query to check all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'freight_%'
ORDER BY table_name;
```

Expected result: 20 tables (all freight_* tables)

## 📊 Table Relationships

### Primary Foreign Keys:
- `freight_quotations.customer_id` → `freight_customers.id`
- `freight_invoices.quotation_id` → `freight_quotations.id`
- `freight_invoices.customer_id` → `freight_customers.id`
- `freight_inbound.pengajuan_id` → `freight_quotations.id`
- `freight_outbound.pengajuan_id` → `freight_quotations.id`
- `freight_reject.pengajuan_id` → `freight_quotations.id`
- `freight_warehouse.pengajuan_id` → `freight_quotations.id`
- `freight_mutation_logs.pengajuan_id` → `freight_quotations.id`
- `freight_shipments.customer_id` → `freight_customers.id`
- `freight_shipments.vendor_id` → `freight_vendors.id`

## ⚠️ Important Notes

1. **No Data Loss**: This migration only creates tables. Existing localStorage data is preserved.
2. **Primary Keys**: All tables use TEXT type for IDs to match existing application structure.
3. **JSONB Fields**: Complex data (packages, documents, services) stored as JSONB for flexibility.
4. **Indexes**: Performance indexes created on frequently queried columns.
5. **Timestamps**: All tables have `created_at` and `updated_at` fields.

## 🔄 Next Steps

After migration is complete:
1. Verify all tables exist in Supabase Dashboard
2. Check foreign key constraints are in place
3. Review indexes for query optimization
4. Ready to implement data sync from localStorage to Supabase
