import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/Common/StatCard';

const PabeanDashboard = () => {
    const { inboundTransactions = [], outboundTransactions = [], rejectTransactions = [], quotations = [] } = useData();

    // Calculate totals
    const totalInbound = inboundTransactions.length;
    const totalOutbound = outboundTransactions.length;
    const totalReject = rejectTransactions.length;

    // Filter quotations by status
    const pendingDocs = quotations.filter(q => q.status === 'pending' || q.status === 'draft');
    const approvedDocs = quotations.filter(q => q.status === 'approved');
    const rejectedDocs = quotations.filter(q => q.status === 'rejected');

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text">Dashboard Pabean</h1>
                <p className="text-silver-dark mt-1">Monitoring Transaksi & Status Dokumen Kepabeanan</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Barang Masuk"
                    value={totalInbound}
                    icon={ArrowDownCircle}
                    iconColor="text-accent-blue"
                    borderColor="border-accent-blue"
                />
                <StatCard
                    title="Total Barang Keluar"
                    value={totalOutbound}
                    icon={ArrowUpCircle}
                    iconColor="text-accent-orange"
                    borderColor="border-accent-orange"
                />
                <StatCard
                    title="Total Barang Reject"
                    value={totalReject}
                    icon={AlertTriangle}
                    iconColor="text-red-500"
                    borderColor="border-red-500"
                />
            </div>

            {/* Document Status Table */}
            <div className="glass-card rounded-lg overflow-hidden">
                <div className="p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent-purple" />
                        <h2 className="text-lg font-semibold text-silver-light">Status Dokumen Pendaftaran</h2>
                        <span className="ml-auto text-sm text-silver-dark">{quotations.length} total dokumen</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-accent-purple/10">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Pendaftaran</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">No. Dokumen BC</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Judul</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {quotations.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-12 text-center">
                                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30 text-silver-dark" />
                                        <p className="text-lg text-silver-dark">Belum ada dokumen pendaftaran</p>
                                        <p className="text-sm text-silver-dark mt-2">Data pendaftaran akan muncul di sini</p>
                                    </td>
                                </tr>
                            ) : (
                                quotations.map((doc, idx) => {
                                    let statusConfig = {
                                        icon: Clock,
                                        color: 'text-yellow-400',
                                        bg: 'bg-yellow-500/20',
                                        label: 'Pending'
                                    };

                                    if (doc.status === 'approved') {
                                        statusConfig = {
                                            icon: CheckCircle,
                                            color: 'text-accent-green',
                                            bg: 'bg-accent-green/20',
                                            label: 'Approved'
                                        };
                                    } else if (doc.status === 'rejected') {
                                        statusConfig = {
                                            icon: XCircle,
                                            color: 'text-red-400',
                                            bg: 'bg-red-500/20',
                                            label: 'Rejected'
                                        };
                                    }

                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <tr key={doc.id} className="hover:bg-dark-surface/50 smooth-transition">
                                            <td className="px-4 py-3 text-sm text-center text-silver-light font-medium">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-accent-blue font-medium">
                                                {doc.quotationNumber || doc.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-light">
                                                {doc.customer}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-light font-mono text-xs">
                                                {doc.bcDocumentNumber || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-silver-light">
                                                {new Date(doc.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-light max-w-xs truncate">
                                                {doc.title}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-dark max-w-xs truncate">
                                                {doc.notes || '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center gap-3">
                        <Clock className="w-10 h-10 text-yellow-400" />
                        <div>
                            <p className="text-xs text-silver-dark">Pending</p>
                            <p className="text-2xl font-bold text-yellow-400">{pendingDocs.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-accent-green/30">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-10 h-10 text-accent-green" />
                        <div>
                            <p className="text-xs text-silver-dark">Approved</p>
                            <p className="text-2xl font-bold text-accent-green">{approvedDocs.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-10 h-10 text-red-400" />
                        <div>
                            <p className="text-xs text-silver-dark">Rejected</p>
                            <p className="text-2xl font-bold text-red-400">{rejectedDocs.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PabeanDashboard;
