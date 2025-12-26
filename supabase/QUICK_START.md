# ⚡ Quick Migration Guide

## 🎯 Execute Migration in 3 Steps

### Step 1: Open Supabase SQL Editor
```
https://supabase.com/dashboard/project/nkyoszmtyrpdwfjxggmb/sql/new
```

### Step 2: Copy & Paste SQL
Open file: `supabase/migrations/001_initial_schema.sql`
- Select All (Cmd+A)
- Copy (Cmd+C)
- Paste in SQL Editor (Cmd+V)

### Step 3: Execute
Click **"Run"** button or press `Ctrl+Enter`

---

## ✅ Verification

After execution, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'freight_%'
ORDER BY table_name;
```

**Expected Result:** 20 tables

---

## 📊 Expected Tables (21 total)

### Core (5)
- ✅ theme
- ✅ freight_vendors
- ✅ freight_customers  
- ✅ freight_bc_codes
- ✅ freight_inventory

### TPPB Workflow (5)
- ✅ freight_quotations
- ✅ freight_invoices
- ✅ freight_inbound
- ✅ freight_outbound
- ✅ freight_reject

### Warehouse (4)
- ✅ freight_warehouse
- ✅ freight_mutation_logs
- ✅ freight_movements
- ✅ freight_inventory_version

### Supporting (4)
- ✅ freight_customs
- ✅ freight_inspections
- ✅ freight_purchases
- ✅ freight_finance

### Modules (3)
- ✅ freight_shipments (Blink)
- ✅ freight_assets (Bridge)
- ✅ freight_events (Big)

---

## 🔍 Quick Health Check

```sql
-- Count all freight tables
SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'freight_%';
-- Expected: 20

-- Check foreign keys
SELECT COUNT(*) as fk_count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public';
-- Expected: 10+

-- Check indexes
SELECT COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE 'freight_%';
-- Expected: 13+
```

---

## ⚠️ Troubleshooting

### Error: "relation already exists"
**Solution:** Tables already created. Skip migration or drop tables first.

### Error: "permission denied"
**Solution:** Ensure you're logged in to correct Supabase project.

### Error: "syntax error"
**Solution:** Ensure entire SQL file was copied (check line 1 and last line).

---

## 📞 Need Help?

1. Check `supabase/MIGRATION_GUIDE.md` for detailed steps
2. Review `supabase/DATABASE_SCHEMA.md` for schema details
3. Check Supabase Dashboard > Logs for errors

---

**Ready to proceed!** 🚀
