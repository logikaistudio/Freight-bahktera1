# 🗄️ Bakhtera-1 Database Schema Documentation

## 📊 Database Overview

**Total Tables:** 21  
**Database Type:** PostgreSQL (Supabase)  
**Schema:** public  

---

## 📋 Table List & Purpose

### Core Configuration
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `theme` | User theme preferences | theme_mode (dark/light) |

### Master Data
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `freight_vendors` | Vendor management | name, contact, service_type |
| `freight_customers` | Customer management | name, contact, company_type |
| `freight_bc_codes` | BC document codes (CEISA 4.0) | code, name, category |
| `freight_inventory` | Item master (Kode Barang) | item_code, item_type |

### TPPB Workflow (Bridge Module)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `freight_quotations` | Pendaftaran/Registration | quotation_number, document_status |
| `freight_invoices` | Invoice management | invoice_number, grand_total |
| `freight_inbound` | Barang Masuk | customs_doc_number, quantity |
| `freight_outbound` | Barang Keluar | customs_doc_number, destination |
| `freight_reject` | Barang Reject/Scrap | reject_reason, quantity |

### Warehouse & Movement
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `freight_warehouse` | Inventaris Gudang | location, entry_date, exit_date |
| `freight_mutation_logs` | Pergerakan Barang | origin, destination, mutated_qty |
| `freight_movements` | Inventory movements | movement_type, quantity |
| `freight_inventory_version` | Inventory versioning | version, data (JSONB) |

### Supporting Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `freight_customs` | Customs documentation | document_type, status |
| `freight_inspections` | Inspection records | inspection_date, findings |
| `freight_purchases` | Purchase orders | purchase_number, total |
| `freight_finance` | Financial transactions | type, amount, module |

### Module-Specific
| Table | Purpose | Module | Key Fields |
|-------|---------|--------|------------|
| `freight_shipments` | Shipment tracking | Blink | origin, destination, status |
| `freight_assets` | Asset management | Bridge | name, type, status |
| `freight_events` | Event management | Big | name, date, budget |

---

## 🔗 Foreign Key Relationships

### Primary Relationships
```
freight_customers (id)
  ├─→ freight_quotations (customer_id)
  ├─→ freight_invoices (customer_id)
  └─→ freight_shipments (customer_id)

freight_vendors (id)
  ├─→ freight_shipments (vendor_id)
  └─→ freight_purchases (vendor_id)

freight_quotations (id)
  ├─→ freight_invoices (quotation_id)
  ├─→ freight_inbound (pengajuan_id)
  ├─→ freight_outbound (pengajuan_id)
  ├─→ freight_reject (pengajuan_id)
  ├─→ freight_warehouse (pengajuan_id)
  ├─→ freight_mutation_logs (pengajuan_id)
  ├─→ freight_customs (quotation_id)
  └─→ freight_inspections (quotation_id)
```

---

## 📐 Data Types Used

| PostgreSQL Type | Usage | Example Fields |
|----------------|-------|----------------|
| `TEXT` | IDs, names, descriptions | id, name, notes |
| `NUMERIC(15,2)` | Currency amounts | amount, total, value |
| `INTEGER` | Quantities, counts | quantity, stock |
| `DATE` | Date fields | date, entry_date |
| `BOOLEAN` | Flags | is_active |
| `JSONB` | Complex data | packages, documents, services |
| `TIMESTAMP WITH TIME ZONE` | Audit fields | created_at, updated_at |

---

## 🎯 Key Design Decisions

### 1. **TEXT IDs**
- All primary keys use `TEXT` type
- Matches existing localStorage structure
- Allows custom ID formats (e.g., "QUOT-2025-001")

### 2. **JSONB for Flexibility**
- `packages`: Array of package objects with items
- `documents`: Array of document attachments
- `services`: Service breakdown with amounts
- `location`: Warehouse location (room/rack/slot)

### 3. **Audit Trail**
- All tables have `created_at` and `updated_at`
- Automatic timestamp management
- Supports data versioning

### 4. **Soft References**
- Some foreign keys are optional (nullable)
- Supports data migration from localStorage
- Maintains backward compatibility

---

## 🔍 Performance Indexes

### Created Indexes
```sql
-- Quotations
idx_quotations_customer
idx_quotations_status
idx_quotations_doc_status

-- Invoices
idx_invoices_customer
idx_invoices_quotation

-- Pabean (Customs)
idx_inbound_pengajuan
idx_outbound_pengajuan
idx_reject_pengajuan

-- Warehouse
idx_warehouse_pengajuan
idx_mutation_pengajuan

-- Finance
idx_finance_type
idx_finance_module

-- Shipments
idx_shipments_customer
```

---

## 📊 Sample Data Structure

### freight_quotations (Pendaftaran)
```json
{
  "id": "QUOT-2025-001",
  "quotation_number": "QT-2025-001",
  "customer": "PT Maju Jaya",
  "document_status": "approved",
  "packages": [
    {
      "id": "pkg-001",
      "packageNumber": "PKG-001",
      "items": [
        {
          "itemName": "Laptop Dell XPS 15",
          "quantity": 10,
          "value": 250000000
        }
      ]
    }
  ],
  "services": {
    "tppbFee": { "amount": 15000000 },
    "customsClearance": { "amount": 10000000 }
  }
}
```

### freight_warehouse (Inventaris Gudang)
```json
{
  "id": "WH-001",
  "pengajuan_id": "QUOT-2025-001",
  "location": {
    "room": "A1",
    "rack": "R01",
    "slot": "S05"
  },
  "entry_date": "2025-01-15",
  "quantity": 10
}
```

---

## 🚀 Migration Status

- ✅ Schema designed
- ✅ SQL migration file created
- ⏳ **Awaiting execution in Supabase Dashboard**
- ⏳ Table verification pending

---

## 📝 Next Steps

1. Execute migration in Supabase SQL Editor
2. Verify all 21 tables created
3. Test foreign key constraints
4. Implement data sync from localStorage
5. Add Row Level Security (RLS) policies

---

## 🔐 Security Considerations

### To Be Implemented:
- Row Level Security (RLS) policies
- User authentication integration
- API key rotation
- Audit logging
- Data encryption at rest

---

## 📞 Support

For issues or questions:
- Check migration logs
- Verify Supabase project status
- Review foreign key constraints
- Test with sample data

---

**Last Updated:** 2025-12-26  
**Schema Version:** 1.0.0  
**Migration File:** `001_initial_schema.sql`
