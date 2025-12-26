import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import { Plus, Users, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportCSV';

const VendorManagement = () => {
    const { vendors, addVendor, updateVendor, deleteVendor } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        category: '',
        npwp: '',
        status: 'active',
    });

    const categories = ['Shipping', 'Warehouse', 'Equipment', 'Event Supplies', 'General'];
    const statuses = ['active', 'inactive'];

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData(vendor);
        } else {
            setEditingVendor(null);
            setFormData({
                name: '',
                contact: '',
                email: '',
                phone: '',
                category: '',
                npwp: '',
                status: 'active',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVendor) {
            updateVendor(editingVendor.id, formData);
        } else {
            addVendor(formData);
        }
        setIsModalOpen(false);
    };

    const handleRemove = (vendor) => {
        if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
            deleteVendor(vendor.id);
        }
    };

    const columns = [
        { header: 'Name', key: 'name' },
        { header: 'Contact', key: 'contact' },
        { header: 'Email', key: 'email' },
        { header: 'Phone', key: 'phone' },
        { header: 'Category', key: 'category' },
        {
            header: 'Status',
            key: 'status',
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    // Export to CSV handler
    const handleExportCSV = () => {
        const columns = [
            { key: 'name', header: 'Vendor Name' },
            { key: 'contact', header: 'Contact Person' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'category', header: 'Category' },
            { key: 'npwp', header: 'NPWP' },
            { key: 'status', header: 'Status' }
        ];

        exportToCSV(vendors, 'Data_Vendor', columns);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Vendor Management</h1>
                    <p className="text-silver-dark">Centralized vendor database for all modules</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleExportCSV} variant="secondary" icon={Download}>
                        Export CSV
                    </Button>
                    <Button onClick={() => handleOpenModal()} icon={Plus}>
                        Add Vendor
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-silver" />
                        <div>
                            <p className="text-silver-dark text-sm">Total Vendors</p>
                            <p className="text-3xl font-bold text-silver-light">{vendors.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div>
                            <p className="text-silver-dark text-sm">Active</p>
                            <p className="text-3xl font-bold text-silver-light">
                                {vendors.filter((v) => v.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div>
                            <p className="text-silver-dark text-sm">Inactive</p>
                            <p className="text-3xl font-bold text-silver-light">
                                {vendors.filter((v) => v.status === 'inactive').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                data={vendors}
                columns={columns}
                onRowClick={handleOpenModal}
                searchPlaceholder="Cari vendor..."
                emptyMessage="No vendors found. Click 'Add Vendor' to get started."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            Vendor Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter vendor name"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            Contact Person
                        </label>
                        <input
                            type="text"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="Enter contact person name"
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="vendor@example.com"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+62 xxx xxxx xxxx"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            NPWP
                        </label>
                        <input
                            type="text"
                            value={formData.npwp}
                            onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                            placeholder="00.000.000.0-000.000"
                            className="w-full"
                            maxLength="20"
                        />
                        <p className="text-xs text-silver-dark mt-1">Format: 00.000.000.0-000.000</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-6">
                        {editingVendor && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleRemove(editingVendor)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                            >
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{editingVendor ? 'Update' : 'Create'} Vendor</Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VendorManagement;
