import React, { useState } from 'react';
import { Activity, Search, Package, Calendar, User, ArrowRight, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/Common/Button';

const PergerakanBarang = () => {
    const { mutationLogs = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    // Filter mutation logs
    const filteredLogs = mutationLogs.filter(log =>
        log.pengajuanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.bcDocumentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.pic?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format location
    const formatLocation = (origin, destination) => {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        return `${capitalize(origin)} → ${capitalize(destination)}`;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text">Pergerakan Barang</h1>
                <p className="text-silver-dark mt-1">Riwayat Mutasi & Tracking Pergerakan Barang</p>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="glass-card p-4 rounded-lg border border-accent-purple">
                    <p className="text-xs text-silver-dark">Total Mutasi</p>
                    <p className="text-2xl font-bold text-accent-purple">{mutationLogs.length}</p>
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
                        <Activity className="w-5 h-5 text-accent-purple" />
                        <h2 className="text-lg font-semibold text-silver-light">Riwayat Pergerakan</h2>
                        <span className="ml-auto text-sm text-silver-dark">{filteredLogs.length} entri</span>
                    </div>
                </div>

                {filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-silver-dark">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Belum ada riwayat pergerakan</p>
                        <p className="text-sm mt-2">Mutasi barang akan muncul di sini</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-accent-purple/10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Pendaftaran</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Dokumen</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Nama Item</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Tanggal</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Jam</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">PIC</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-blue">Total</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-orange">Mutasi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-accent-green">Sisa</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Lokasi Mutasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, idx) => (
                                    <tr
                                        key={idx}
                                        onClick={() => setSelectedLog(log)}
                                        className="border-t border-dark-border hover:bg-dark-surface/50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3 text-sm text-accent-blue">{log.pengajuanNumber}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{log.bcDocumentNumber}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-medium">{log.itemName}</td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">
                                            {new Date(log.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">{log.time}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{log.pic}</td>
                                        <td className="px-4 py-3 text-sm text-center text-accent-blue font-semibold">
                                            {log.totalStock}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-accent-orange font-semibold">
                                            {log.mutatedQty}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-accent-green font-semibold">
                                            {log.remainingStock}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver-light">
                                            <div className="flex items-center gap-1">
                                                <span className="capitalize">{log.origin}</span>
                                                <ArrowRight className="w-3 h-3" />
                                                <span className="capitalize">{log.destination}</span>
                                            </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="glass-card rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold gradient-text">Detail Pergerakan</h3>
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
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant="secondary" onClick={() => setSelectedLog(null)}>Tutup</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PergerakanBarang;
