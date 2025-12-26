import React, { useState } from 'react';
import { ArrowDownCircle, Search, Eye, Package, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/Common/Button';
import { formatCurrency } from '../../utils/currencyFormatter';
import { exportToCSV } from '../../utils/exportCSV';

const BarangMasuk = () => {
    const { inboundTransactions = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    // Filter transactions
    const filteredTransactions = inboundTransactions.filter(item =>
        item.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customsDocNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customsDocType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Export to CSV handler
    const handleExportCSV = () => {
        const columns = [
            { key: 'customsDocType', header: 'Jenis Dokumen' },
            { key: 'customsDocNumber', header: 'No. Dokumen (Pabean)' },
            { key: 'customsDocDate', header: 'Tanggal Dokumen' },
            { key: 'receiptNumber', header: 'No. Bukti' },
            { key: 'date', header: 'Tanggal Terima' },
            { key: 'sender', header: 'Pengirim' },
            { key: 'itemCode', header: 'Kode' },
            { key: 'assetName', header: 'Nama Barang' },
            { key: 'quantity', header: 'Quantity' },
            { key: 'unit', header: 'Satuan' },
            { key: 'value', header: 'Nilai' },
            { key: 'currency', header: 'Currency' }
        ];

        exportToCSV(filteredTransactions, 'Barang_Masuk', columns);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text">Barang Masuk</h1>
                <p className="text-silver-dark mt-1">Daftar Transaksi Barang Masuk & BC Inbound</p>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 glass-card p-4 rounded-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-dark" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama barang atau nomor BC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver-light focus:border-accent-blue focus:outline-none"
                        />
                    </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-accent-blue">
                    <p className="text-xs text-silver-dark">Total Transaksi</p>
                    <p className="text-2xl font-bold text-accent-blue">{inboundTransactions.length}</p>
                </div>
                <div className="glass-card p-4 rounded-lg border border-accent-green">
                    <p className="text-xs text-silver-dark">Hari Ini</p>
                    <p className="text-2xl font-bold text-accent-green">
                        {inboundTransactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-lg overflow-hidden">
                <div className="p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                        <ArrowDownCircle className="w-5 h-5 text-accent-blue" />
                        <h2 className="text-lg font-semibold text-silver-light">Daftar Barang Masuk</h2>
                        <span className="ml-auto text-sm text-silver-dark">{filteredTransactions.length} entri</span>
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


                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-accent-blue/10">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Jenis Dokumen</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Dokumen (Pabean)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Tanggal Dokumen</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Bukti</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Tanggal Terima</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Pengirim</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Kode</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Nama Barang</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Quantity</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Satuan</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-silver">Nilai</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="px-4 py-12 text-center">
                                        <Package className="w-16 h-16 mx-auto mb-4 opacity-30 text-silver-dark" />
                                        <p className="text-lg text-silver-dark">Belum ada data barang masuk</p>
                                        <p className="text-sm text-silver-dark mt-2">Transaksi inbound akan muncul di sini</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        onClick={() => setSelectedItem(item)}
                                        className="border-t border-dark-border hover:bg-dark-surface/50 cursor-pointer"
                                    >
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">{idx + 1}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{item.customsDocType || 'BC 2.3'}</td>
                                        <td className="px-4 py-3 text-sm text-accent-blue">{item.customsDocNumber}</td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">
                                            {item.customsDocDate ? new Date(item.customsDocDate).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{item.receiptNumber || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">
                                            {new Date(item.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver-light">{item.sender || item.supplier || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-mono text-xs">{item.itemCode || item.hsCode || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-medium">{item.assetName}</td>
                                        <td className="px-4 py-3 text-sm text-center text-accent-blue font-semibold">{item.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">{item.unit}</td>
                                        <td className="px-4 py-3 text-sm text-right text-silver-light">
                                            {formatCurrency(item.value)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-silver-light">{item.currency || 'IDR'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="glass-card rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold gradient-text">Detail Barang Masuk</h3>
                            <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-dark-border rounded">
                                <span className="text-silver">✕</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Item Photo */}
                            {selectedItem.itemPhoto && (
                                <div className="flex justify-center">
                                    <img
                                        src={selectedItem.itemPhoto}
                                        alt={selectedItem.assetName}
                                        className="max-w-xs max-h-48 rounded-lg object-cover border border-dark-border"
                                    />
                                </div>
                            )}

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-silver-dark">Kode Barang</label>
                                    <p className="text-sm text-silver-light font-mono">{selectedItem.itemCode || selectedItem.hsCode || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Nama Barang</label>
                                    <p className="text-sm text-silver-light font-medium">{selectedItem.assetName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Tanggal Masuk</label>
                                    <p className="text-sm text-silver-light">{new Date(selectedItem.date).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">PIC</label>
                                    <p className="text-sm text-silver-light">{selectedItem.pic || selectedItem.receivedBy || 'Admin'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Jenis BC</label>
                                    <p className="text-sm text-silver-light">{selectedItem.customsDocType}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">No. Dokumen</label>
                                    <p className="text-sm text-accent-blue">{selectedItem.customsDocNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Pengirim</label>
                                    <p className="text-sm text-silver-light">{selectedItem.sender || selectedItem.supplier || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">No. Bukti</label>
                                    <p className="text-sm text-silver-light">{selectedItem.receiptNumber || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Jumlah</label>
                                    <p className="text-lg font-bold text-accent-blue">{selectedItem.quantity} {selectedItem.unit}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-silver-dark">Nilai</label>
                                    <p className="text-lg font-bold text-accent-green">{formatCurrency(selectedItem.value)}</p>
                                </div>
                            </div>

                            {/* Supporting Documents */}
                            {selectedItem.documents && selectedItem.documents.length > 0 && (
                                <div>
                                    <label className="text-xs text-silver-dark block mb-2">Dokumen Pendukung</label>
                                    <div className="space-y-2">
                                        {selectedItem.documents.map((doc, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-dark-surface rounded border border-dark-border">
                                                <span className="text-sm text-silver-light flex-1">{doc.name || `Dokumen ${idx + 1}`}</span>
                                                {doc.url && (
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-accent-blue text-xs hover:underline"
                                                    >
                                                        Lihat
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button variant="secondary" onClick={() => setSelectedItem(null)}>Tutup</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarangMasuk;
