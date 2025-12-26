import React, { useState } from 'react';
import { Plus, Package, X, Edit2, Save } from 'lucide-react';
import Button from './Button';
import { formatCurrency, parseCurrency } from '../../utils/currencyFormatter';

const PackageItemManager = ({ items = [], onChange, itemMaster = [] }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        itemCode: '',
        serialNumber: '',
        quantity: '1',
        condition: 'new',
        currency: 'IDR',
        value: '',
        weight: '',
        dimensions: '',
        notes: ''
    });

    const conditionOptions = [
        { value: 'new', label: 'Baru' },
        { value: 'used', label: 'Bekas' },
        { value: 'refurbished', label: 'Rekondisi' },
        { value: 'damaged', label: 'Rusak' }
    ];

    const handleAdd = () => {
        if (!formData.name.trim()) {
            alert('Nama barang wajib diisi');
            return;
        }

        if (editingId) {
            // Update existing item
            const updated = items.map(item =>
                item.id === editingId
                    ? { ...formData, id: editingId, value: parseCurrency(formData.value) }
                    : item
            );
            onChange(updated);
            setEditingId(null);
        } else {
            // Add new item
            const newItem = {
                id: `item-${Date.now()}`,
                name: formData.name.trim(),
                serialNumber: formData.serialNumber.trim(),
                quantity: parseInt(formData.quantity) || 1,
                condition: formData.condition,
                value: parseCurrency(formData.value),
                weight: formData.weight.trim(),
                dimensions: formData.dimensions.trim(),
                notes: formData.notes.trim()
            };
            onChange([...items, newItem]);
        }

        // Reset form
        setFormData({
            name: '',
            itemCode: '',
            serialNumber: '',
            quantity: '1',
            condition: 'new',
            currency: 'IDR',
            value: '',
            weight: '',
            dimensions: '',
            notes: ''
        });
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            itemCode: item.itemCode || '',
            serialNumber: item.serialNumber || '',
            quantity: item.quantity?.toString() || '1',
            condition: item.condition || 'new',
            currency: item.currency || 'IDR',
            value: formatCurrency(item.value || 0),
            weight: item.weight || '',
            dimensions: item.dimensions || '',
            notes: item.notes || ''
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleRemove = (itemId) => {
        if (window.confirm('Hapus barang ini?')) {
            onChange(items.filter(item => item.id !== itemId));
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            serialNumber: '',
            quantity: '1',
            condition: 'new',
            value: '',
            weight: '',
            dimensions: '',
            notes: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent-green" />
                    <h3 className="text-lg font-semibold text-silver-light">Daftar Barang dalam Package</h3>
                    <span className="text-xs text-silver-dark">
                        ({items.length} jenis barang, {totalItems} total item, nilai: Rp {formatCurrency(totalValue)})
                    </span>
                </div>
                {!showForm && (
                    <Button size="sm" onClick={() => setShowForm(true)} icon={Plus}>
                        Tambah Barang
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="glass-card p-4 rounded-lg border-2 border-accent-green bg-accent-green/10">
                    <h4 className="text-sm font-semibold text-silver-light mb-4">
                        {editingId ? 'Edit Barang' : 'Tambah Barang Baru'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Kode Barang */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Kode Barang *
                            </label>
                            <select
                                value={formData.itemCode}
                                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                                className="w-full"
                            >
                                <option value="">-- Pilih Kode Barang --</option>
                                {itemMaster.map(item => (
                                    <option key={item.id} value={item.itemCode}>
                                        {item.itemCode} - {item.itemType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nama Barang */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-silver mb-2">
                                Nama Barang *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="contoh: Mesin CNC Model X200"
                                className="w-full"
                            />
                        </div>

                        {/* Serial Number */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Serial Number (SN)
                            </label>
                            <input
                                type="text"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                placeholder="SN1234567890"
                                className="w-full"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Jumlah *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full"
                            />
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Kondisi *
                            </label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="w-full"
                            >
                                {conditionOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Currency *
                            </label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full"
                            >
                                <option value="IDR">IDR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Nilai (Rp)
                            </label>
                            <input
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: formatCurrency(e.target.value) })}
                                placeholder="0"
                                className="w-full"
                            />
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Berat
                            </label>
                            <input
                                type="text"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                placeholder="contoh: 100 kg"
                                className="w-full"
                            />
                        </div>

                        {/* Dimensions */}
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">
                                Ukuran
                            </label>
                            <input
                                type="text"
                                value={formData.dimensions}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                placeholder="contoh: 100x50x30 cm"
                                className="w-full"
                            />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-silver mb-2">
                                Keterangan
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Catatan tambahan tentang barang ini..."
                                rows={2}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={handleCancel}>
                            Batal
                        </Button>
                        <Button type="button" size="sm" onClick={handleAdd} icon={editingId ? Save : Plus}>
                            {editingId ? 'Simpan Perubahan' : 'Tambah Barang'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Items List */}
            {items.length > 0 && (
                <div className="glass-card rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-accent-green">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">No</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nama Barang</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">SN</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Jml</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Kondisi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nilai</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Berat</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Ukuran</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {items.map((item, index) => (
                                <tr key={item.id} className="hover:bg-dark-surface smooth-transition">
                                    <td className="px-4 py-3 text-sm text-silver-dark font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-silver-light">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.notes && (
                                                <p className="text-xs text-silver-dark mt-1">{item.notes}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-silver-dark">
                                        {item.serialNumber || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-silver">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${item.condition === 'new' ? 'bg-green-500/20 text-green-400' :
                                            item.condition === 'used' ? 'bg-blue-500/20 text-blue-400' :
                                                item.condition === 'refurbished' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {conditionOptions.find(c => c.value === item.condition)?.label || item.condition}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-accent-green font-semibold">
                                        {item.value ? `Rp ${formatCurrency(item.value)}` : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-silver-dark">
                                        {item.weight || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-silver-dark">
                                        {item.dimensions || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                                className="p-1 hover:bg-blue-500 hover:bg-opacity-20 rounded smooth-transition"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4 text-blue-400" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item.id)}
                                                className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded smooth-transition"
                                                title="Hapus"
                                            >
                                                <X className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {items.length === 0 && !showForm && (
                <div className="glass-card p-8 rounded-lg text-center text-silver-dark">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada barang ditambahkan</p>
                    <p className="text-xs mt-1">Klik "Tambah Barang" untuk mulai</p>
                </div>
            )}
        </div>
    );
};

export default PackageItemManager;
