import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Search, FileText, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ApprovalManager = () => {
    const { pendingApprovals = [], approveRequest, rejectRequest } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    // Filter approvals
    const filteredApprovals = pendingApprovals.filter(req => {
        const matchesSearch =
            req.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.details?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Stats
    const pendingCount = pendingApprovals.filter(r => r.status === 'pending').length;
    const approvedCount = pendingApprovals.filter(r => r.status === 'approved').length;
    const rejectedCount = pendingApprovals.filter(r => r.status === 'rejected').length;

    // Handle approve
    const handleApprove = (requestId) => {
        approveRequest(requestId, 'Manager');
        setSelectedRequest(null);
    };

    // Handle reject
    const handleReject = () => {
        if (selectedRequest && rejectReason.trim()) {
            rejectRequest(selectedRequest.id, 'Manager', rejectReason);
            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectReason('');
        }
    };

    // Get type config
    const getTypeConfig = (type) => {
        const configs = {
            edit: { icon: Edit, color: 'text-accent-blue', bg: 'bg-accent-blue/20', label: 'Edit' },
            delete: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Delete' }
        };
        return configs[type] || configs.edit;
    };

    // Get status config
    const getStatusConfig = (status) => {
        const configs = {
            pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
            approved: { icon: CheckCircle, color: 'text-accent-green', bg: 'bg-accent-green/20', label: 'Approved' },
            rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' }
        };
        return configs[status] || configs.pending;
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text">Approval Manager</h1>
                <p className="text-silver-dark mt-1">Persetujuan untuk edit dan delete data di Bridge</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-lg border border-yellow-500">
                    <div className="flex items-center gap-3">
                        <Clock className="w-10 h-10 text-yellow-400" />
                        <div>
                            <p className="text-xs text-silver-dark">Pending Approvals</p>
                            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-accent-green">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-10 h-10 text-accent-green" />
                        <div>
                            <p className="text-xs text-silver-dark">Approved</p>
                            <p className="text-2xl font-bold text-accent-green">{approvedCount}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-red-500">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-10 h-10 text-red-400" />
                        <div>
                            <p className="text-xs text-silver-dark">Rejected</p>
                            <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="glass-card p-4 rounded-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-silver-dark" />
                        <input
                            type="text"
                            placeholder="Cari approval request..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver-light focus:border-accent-blue focus:outline-none"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="glass-card p-4 rounded-lg">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver-light focus:border-accent-blue focus:outline-none"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">Semua Status</option>
                    </select>
                </div>
            </div>

            {/* Approval Requests Table */}
            <div className="glass-card rounded-lg overflow-hidden">
                <div className="p-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent-purple" />
                        <h2 className="text-lg font-semibold text-silver-light">Approval Requests</h2>
                        <span className="ml-auto text-sm text-silver-dark">{filteredApprovals.length} requests</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-accent-purple/10">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Request Date</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Module</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Entity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Requested By</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-silver">Details</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-silver">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {filteredApprovals.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-12 text-center">
                                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30 text-silver-dark" />
                                        <p className="text-lg text-silver-dark">Tidak ada approval request</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApprovals.map((req, idx) => {
                                    const typeConfig = getTypeConfig(req.type);
                                    const statusConfig = getStatusConfig(req.status);
                                    const TypeIcon = typeConfig.icon;
                                    const StatusIcon = statusConfig.icon;
                                    const { date, time } = formatTimestamp(req.requestDate);

                                    return (
                                        <tr key={req.id} className="hover:bg-dark-surface/50 smooth-transition">
                                            <td className="px-4 py-3 text-sm text-center text-silver-light font-medium">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm text-silver-light">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{date}</span>
                                                    <span className="text-xs text-silver-dark">{time}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}>
                                                    <TypeIcon className="w-3 h-3" />
                                                    {typeConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded">{req.module}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-light max-w-xs truncate">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{req.entityName}</span>
                                                    <span className="text-xs text-silver-dark font-mono">{req.entityId}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-silver-light">{req.requestedBy}</td>
                                            <td className="px-4 py-3 text-sm text-silver-dark max-w-xs truncate">{req.details}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {req.status === 'pending' && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            className="px-3 py-1 bg-accent-green/20 text-accent-green rounded hover:bg-accent-green/30 transition-colors text-xs font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(req);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-xs font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowRejectModal(false)}>
                    <div className="glass-card p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-silver-light mb-4">Reject Request</h3>
                        <p className="text-silver-dark mb-4">
                            Reject request untuk {selectedRequest.type} <span className="text-accent-blue font-medium">{selectedRequest.entityName}</span>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-silver-light text-sm font-medium mb-2">
                                Alasan Rejection <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Masukkan alasan rejection..."
                                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver-light focus:border-accent-blue focus:outline-none"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="px-4 py-2 bg-dark-surface text-silver-light rounded-lg hover:bg-dark-card transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalManager;
