import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventManagement = () => {
    const { events, addEvent, updateEvent, deleteEvent, customers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        customerId: '',
        budget: '',
        status: 'planning',
        notes: '',
    });

    const navigate = useNavigate();
    const statuses = ['planning', 'confirmed', 'ongoing', 'completed'];

    const handleOpenModal = (event = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData(event);
        } else {
            setEditingEvent(null);
            setFormData({
                name: '',
                date: '',
                location: '',
                customerId: '',
                budget: '',
                status: 'planning',
                notes: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customer = customers.find((c) => c.id === formData.customerId);

        const eventData = {
            ...formData,
            customerName: customer?.name || '',
        };

        if (editingEvent) {
            updateEvent(editingEvent.id, eventData);
        } else {
            addEvent(eventData);
        }
        setIsModalOpen(false);
    };

    const handleRemove = (event) => {
        if (window.confirm(`Are you sure you want to delete ${event.name}?`)) {
            deleteEvent(event.id);
        }
    };

    const columns = [
        { header: 'Event Name', key: 'name' },
        {
            header: 'Date',
            key: 'date',
            render: (row) => new Date(row.date).toLocaleDateString('id-ID'),
        },
        { header: 'Location', key: 'location' },
        { header: 'Customer', key: 'customerName' },
        {
            header: 'Status',
            key: 'status',
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : row.status === 'ongoing'
                                ? 'bg-purple-500/20 text-purple-400'
                                : row.status === 'confirmed'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Budget',
            key: 'budget',
            render: (row) => `Rp ${parseFloat(row.budget || 0).toLocaleString('id-ID')}`,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/big')}
                    className="p-2 rounded-lg hover:bg-dark-surface smooth-transition text-silver-dark hover:text-silver"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Event Management</h1>
                    <p className="text-silver-dark">Manage events and scheduling</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={Plus}>
                    Add Event
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={events}
                columns={columns}
                onEdit={handleOpenModal}
                onRemove={handleRemove}
                searchPlaceholder="Search events..."
                emptyMessage="No events found. Click 'Add Event' to get started."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEvent ? 'Edit Event' : 'Add New Event'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            Event Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter event name"
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Event location"
                                className="w-full"
                            />
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-silver-dark mb-2">
                                Budget *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="0.00"
                                className="w-full"
                            />
                        </div>

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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver-dark mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Event details and notes"
                            rows={3}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editingEvent ? 'Update' : 'Create'} Event</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventManagement;
