import React, { useState } from 'react';
import { Search, Calendar, Package, User, ArrowRight, Eye, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/Common/Button';
import { exportToCSV } from '../../utils/exportCSV';

const GoodsMovement = () => {
    const { mutationLogs = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    // Filter mutation logs based on search
    const filteredLogs = mutationLogs.filter(log =>
        log.pengajuanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.bcDocumentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.pic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format location display
    const formatLocation = (origin, destination) => {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        return `${capitalize(origin)} → ${capitalize(destination)}`;
    };

    // Export to CSV handler
    const handleExportCSV = () => {
        const columns = [
            { key: 'pengajuanNumber', header: 'No. Pendaftaran' },
            { key: 'itemCode', header: 'Kode Barang' },
            { key: 'bcDocumentNumber', header: 'No. Dokumen' },
            { key: 'itemName', header: 'Nama Item' },
            { key: 'serialNumber', header: 'Serial Number' },
            { key: 'date', header: 'Tanggal' },
            { key: 'time', header: 'Jam' },
            { key: 'pic', header: 'PIC' },
            { key: 'totalStock', header: 'Total Stock' },
            { key: 'mutatedQty', header: 'Qty Mutasi' },
            { key: 'remainingStock', header: 'Sisa Stock' },
            { key: 'origin', header: 'Dari' },
            { key: 'destination', header: 'Ke' },
            { key: 'remarks', header: 'Keterangan' }
        ];

        exportToCSV(filteredLogs, 'Pergerakan_Barang', columns);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text">Pergerakan Barang</h1>
                <p className="text-silver-dark mt-1">Riwayat Mutasi & Pergerakan Inventaris Gudang</p>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 glass-card p-4 rounded-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-dark" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan No. Pendaftaran, Item, atau PIC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver-light focus:border-accent-blue focus:outline-none"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="glass-card p-4 rounded-lg border border-accent-blue">
                    <p className="text-xs text-silver-dark">Total Mutasi</p>
                    <p className="text-2xl font-bold text-accent-blue">{mutationLogs.length}</p>
                </div>
                <div className="glass-card p-4 rounded-lg border border-accent-green">
                    <p className="text-xs text-silver-dark">Hari Ini</p>
                    <p className="text-2xl font-bold text-accent-green">
                        {mutationLogs.filter(log => log.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                </div>
            </div>

            {/* Mutation Logs Table */}
            <div className="glass-card rounded-lg overflow-hidden">
                <div className="p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent-purple" />
                        <h2 className="text-lg font-semibold text-silver-light">
                            Riwayat Mutasi Barang
                        </h2>
                        <span className="ml-auto text-sm text-silver-dark">
                            {filteredLogs.length} entri
                        </span>
                        <Button
                            onClick={handleExportCSV}
                            variant="secondary"
                            icon={Download}
                            className="ml-2"
                        >
                            Export CSV
                        </Button>
                    </div>
                </div>

                {filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-silver-dark">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Belum ada riwayat mutasi</p>
                        <p className="text-sm mt-2">Mutasi barang akan muncul di sini setelah submit dari Inventaris Gudang</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-accent-purple/10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Pendaftaran</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Kode Barang</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Dokumen</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Nama Item</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Tanggal</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Jam</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">PIC</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-blue">Total</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-orange">Mutasi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-green">Sisa</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Lokasi Mutasi</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Keterangan</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {filteredLogs.map((log, idx) => (
                                    <tr key={log.id} className="hover:bg-dark-surface/50 cursor-pointer" onClick={() => setSelectedLog(log)}>
                                        <td className="px-4 py-3 text-sm text-silver-light font-medium">{log.pengajuanNumber}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-mono text-xs">{log.itemCode || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-silver">{log.bcDocumentNumber}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light">
                                            <div>{log.itemName}</div>
                                            <div className="text-xs text-silver-dark">{log.serialNumber}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver text-center">
                                            {new Date(log.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver text-center">{log.time}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{log.pic}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-semibold text-accent-blue">{log.totalStock}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-semibold text-accent-orange">{log.mutatedQty}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-semibold text-accent-green">{log.remainingStock}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver">
                                            <div className="flex items-center gap-1">
                                                <span className="capitalize">{log.origin}</span>
                                                <ArrowRight className="w-3 h-3 text-silver-dark" />
                                                <span className="capitalize">{log.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver-dark max-w-xs truncate">
                                            {log.remarks || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="p-1 hover:bg-dark-border rounded">
                                                <Eye className="w-4 h-4 text-accent-blue" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="glass-card rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold gradient-text">Detail Mutasi</h3>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-dark-border rounded">
                                <span className="text-silver">✕</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-silver-dark">No. Pengajuan</label>
                                <p className="text-sm text-silver-light font-medium">{selectedLog.pengajuanNumber}</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">No. Dokumen Pabean</label>
                                <p className="text-sm text-silver-light font-medium">{selectedLog.bcDocumentNumber}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-silver-dark">Nama Item</label>
                                <p className="text-sm text-silver-light font-medium">{selectedLog.itemName}</p>
                                <p className="text-xs text-silver-dark mt-1">SN: {selectedLog.serialNumber}</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">Tanggal & Jam</label>
                                <p className="text-sm text-silver-light">
                                    {new Date(selectedLog.date).toLocaleDateString('id-ID')} - {selectedLog.time}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">PIC</label>
                                <p className="text-sm text-silver-light">{selectedLog.pic}</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">Stock Awal</label>
                                <p className="text-lg font-bold text-accent-blue">{selectedLog.totalStock} unit</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">Dimutasi</label>
                                <p className="text-lg font-bold text-accent-orange">{selectedLog.mutatedQty} unit</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">Sisa Stock</label>
                                <p className="text-lg font-bold text-accent-green">{selectedLog.remainingStock} unit</p>
                            </div>
                            <div>
                                <label className="text-xs text-silver-dark">Lokasi Mutasi</label>
                                <p className="text-sm text-silver-light">{formatLocation(selectedLog.origin, selectedLog.destination)}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-silver-dark">Keterangan</label>
                                <p className="text-sm text-silver-light">{selectedLog.remarks || 'Tidak ada keterangan'}</p>
                            </div>
                            {selectedLog.documents && selectedLog.documents.length > 0 && (
                                <div className="col-span-2">
                                    <label className="text-xs text-silver-dark">Dokumen Pendukung</label>
                                    <p className="text-sm text-silver-light">{selectedLog.documents.length} file(s)</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant="secondary" onClick={() => setSelectedLog(null)}>
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoodsMovement;
