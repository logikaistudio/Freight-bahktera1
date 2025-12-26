/**
 * Run database migrations on Supabase
 * This script executes the SQL migration file to create all tables
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://nkyoszmtyrpdwfjxggmb.supabase.co';
const supabaseKey = 'sb_publishable_GhpLPJQyE7IIlmFStBqKVQ_aKcbgleV';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('🚀 Starting database migration...\n');

        // Read the SQL migration file
        const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Migration file loaded successfully');
        console.log(`📊 SQL length: ${sql.length} characters\n`);

        // Execute the SQL
        console.log('⚙️  Executing migration...');
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }

        console.log('✅ Migration executed successfully!\n');

        // Verify tables were created
        console.log('🔍 Verifying tables...');
        const tables = [
            'theme',
            'freight_vendors',
            'freight_customers',
            'freight_bc_codes',
            'freight_quotations',
            'freight_invoices',
            'freight_inbound',
            'freight_outbound',
            'freight_reject',
            'freight_warehouse',
            'freight_inventory',
            'freight_mutation_logs',
            'freight_movements',
            'freight_inventory_version',
            'freight_customs',
            'freight_inspections',
            'freight_purchases',
            'freight_finance',
            'freight_shipments',
            'freight_assets',
            'freight_events'
        ];

        let successCount = 0;
        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (!error) {
                console.log(`  ✓ ${table}`);
                successCount++;
            } else {
                console.log(`  ✗ ${table} - ${error.message}`);
            }
        }

        console.log(`\n📊 Summary: ${successCount}/${tables.length} tables verified`);

        if (successCount === tables.length) {
            console.log('\n🎉 All tables created successfully!');
        } else {
            console.log('\n⚠️  Some tables may not have been created. Check errors above.');
        }

    } catch (err) {
        console.error('\n💥 Fatal error:', err);
        process.exit(1);
    }
}

// Run the migration
runMigration();
