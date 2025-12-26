import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import MainLayout from './components/Layout/MainLayout';
import { testSupabaseConnection, getSupabaseStatus } from './lib/supabase';

// Main Dashboard
import FreightDashboard from './pages/FreightDashboard';

// Centralized Modules
import VendorManagement from './pages/Centralized/VendorManagement';
import CustomerManagement from './pages/Centralized/CustomerManagement';
import Finance from './pages/Centralized/Finance';

// Blink Module
import BlinkDashboard from './pages/Blink/BlinkDashboard';
import ShipmentManagement from './pages/Blink/ShipmentManagement';

// Bridge Module
import BridgeDashboard from './pages/Bridge/BridgeDashboard';
import BCMaster from './pages/Bridge/BCMaster';
import ItemMaster from './pages/Bridge/ItemMaster';
import PengajuanManagement from './pages/Bridge/PengajuanManagement';
import BridgeFinance from './pages/Bridge/BridgeFinance';
import GoodsMovement from './pages/Bridge/GoodsMovement';
import WarehouseInventory from './pages/Bridge/WarehouseInventory';
import ActivityLogger from './pages/Bridge/ActivityLogger';
import ApprovalManager from './pages/Bridge/ApprovalManager';

// Big Module
import BigDashboard from './pages/Big/BigDashboard';
import EventManagement from './pages/Big/EventManagement';

// Pabean Module
import PabeanDashboard from './pages/Pabean/PabeanDashboard';
import BarangMasuk from './pages/Pabean/BarangMasuk';
import BarangKeluar from './pages/Pabean/BarangKeluar';
import BarangReject from './pages/Pabean/BarangReject';
import PergerakanBarang from './pages/Pabean/PergerakanBarang';

function App() {
  // Test Supabase connection on app initialization
  useEffect(() => {
    const initSupabase = async () => {
      console.log('🚀 Bakhtera-1 Application Starting...');
      const status = getSupabaseStatus();
      console.log('📊 Supabase Status:', status);

      if (status.configured) {
        const result = await testSupabaseConnection();
        if (result.success) {
          console.log('✅ Supabase connection verified!');
        } else {
          console.error('❌ Supabase connection failed:', result.error);
        }
      } else {
        console.warn('⚠️ Supabase not configured. Check .env file.');
      }
    };

    initSupabase();
  }, []);
  return (
    <DataProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<FreightDashboard />} />

            {/* Centralized Modules */}
            <Route path="/vendors" element={<VendorManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/finance" element={<Finance />} />

            {/* Blink Module */}
            <Route path="/blink" element={<BlinkDashboard />} />
            <Route path="/blink/shipments" element={<ShipmentManagement />} />

            {/* Bridge Module */}
            <Route path="/bridge" element={<BridgeDashboard />} />
            <Route path="/bridge/bc-master" element={<BCMaster />} />
            <Route path="/bridge/item-master" element={<ItemMaster />} />
            <Route path="/bridge/pengajuan" element={<PengajuanManagement />} />
            <Route path="/bridge/finance" element={<BridgeFinance />} />
            <Route path="/bridge/goods-movement" element={<GoodsMovement />} />
            <Route path="/bridge/inventory" element={<WarehouseInventory />} />
            <Route path="/bridge/logger" element={<ActivityLogger />} />
            <Route path="/bridge/approvals" element={<ApprovalManager />} />

            {/* Big Module */}
            <Route path="/big" element={<BigDashboard />} />
            <Route path="/big/events" element={<EventManagement />} />

            {/* Pabean Module */}
            <Route path="/pabean" element={<PabeanDashboard />} />
            <Route path="/pabean/barang-masuk" element={<BarangMasuk />} />
            <Route path="/pabean/barang-keluar" element={<BarangKeluar />} />
            <Route path="/pabean/barang-reject" element={<BarangReject />} />
            <Route path="/pabean/pergerakan" element={<PergerakanBarang />} />
          </Routes>
        </MainLayout>
      </Router>
    </DataProvider>
  );
}

export default App;
