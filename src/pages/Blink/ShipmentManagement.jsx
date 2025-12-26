import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import { Plus, Plane, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShipmentManagement = () => {
    const { shipments, addShipment, updateShipment, deleteShipment, customers, vendors } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        customerId: '',
        vendorId: '',
        status: 'pending',
        cost: '',
        notes: '',
    });

    const navigate = useNavigate();
    const statuses = ['pending', 'in-transit', 'delivered', 'completed'];

    const handleOpenModal = (shipment = null) => {
        if (shipment) {
            setEditingShipment(shipment);
            setFormData(shipment);
        } else {
            setEditingShipment(null);
            setFormData({
                origin: '',
                destination: '',
                customerId: '',
                vendorId: '',
                status: 'pending',
                cost: '',
                notes: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customer = customers.find((c) => c.id === formData.customerId);
        const vendor = vendors.find((v) => v.id === formData.vendorId);

        const shipmentData = {
            ...formData,
            customerName: customer?.name || '',
            vendorName: vendor?.name || '',
        };

        if (editingShipment) {
            updateShipment(editingShipment.id, shipmentData);
        } else {
            addShipment(shipmentData);
        }
        setIsModalOpen(false);
    };

    const handleRemove = (shipment) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            deleteShipment(shipment.id);
        }
    };

    const columns = [
        { header: 'Origin', key: 'origin' },
        { header: 'Destination', key: 'destination' },
        { header: 'Customer', key: 'customerName' },
        { header: 'Vendor', key: 'vendorName' },
        {
            header: 'Status',
            key: 'status',
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : row.status === 'in-transit'
                            ? 'bg-blue-500/20 text-blue-400'
                            : row.status === 'delivered'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Cost',
            key: 'cost',
            render: (row) => `Rp ${parseFloat(row.cost || 0).toLocaleString('id-ID')}`,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/blink')}
                    className="p-2 rounded-lg hover:bg-dark-surface smooth-transition text-silver-dark hover:text-silver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Shipment Management</h1>
                    <p className="text-silver-dark">Manage Bakhtera-1 shipments</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>
                    Add Shipment
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={shipments}
                columns={columns}
                onEdit={handleOpenModal}
                onRemove={handleRemove}
                searchPlaceholder="Search shipments..."
                emptyMessage="No shipments found. Click 'Add Shipment' to get started."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Origin *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                placeholder="Origin city/port"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Destination *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                placeholder="Destination city/port"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Customer *
                            </label>
                            <select
                                required
                                value={formData.customerId}
                                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                className="w-full"
                            >
                                <option value="">Select customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Vendor
                            </label>
                            <select
                                value={formData.vendorId}
                                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                                className="w-full"
                            >
                                <option value="">Select vendor</option>
                                {vendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Status *
                            </label>
                            <select
                                required
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

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Cost *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                placeholder="0.00"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes"
                            rows={3}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editingShipment ? 'Update' : 'Create'} Shipment</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ShipmentManagement;
