import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../../utils/currencyFormatter';

const LineItemManager = ({ items = [], onChange, itemMaster = [] }) => {
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        packageNumber: '',
        itemCode: '',
        goodsType: '',
        quantity: '',
        unit: 'pcs',
        condition: 'good',
        serialNumber: '',
        value: '',
        notes: ''
    });

    const conditions = ['good', 'damaged', 'broken'];
    const unit = ['pcs', 'kg', 'ton', 'm', 'm2', 'm3', 'set', 'box', 'pallet'];

    const handleAdd = () => {
        if (!formData.goodsType || !formData.quantity) {
            alert('Jenis Barang dan Jumlah wajib diisi');
            return;
        }

        const newItem = {
            ...formData,
            id: editingItem?.id || `item-${Date.now()}`,
            quantity: Number(formData.quantity),
            value: Number(formData.value || 0)
        };

        if (editingItem) {
            // Update existing
            onChange(items.map(item => item.id === editingItem.id ? newItem : item));
            setEditingItem(null);
        } else {
            // Add new
            const updatedItems = [...items, newItem];
            console.log("🔍 onChange called in LineItemManager with:", updatedItems);
            onChange(updatedItems);
        }

        // Reset form
        setFormData({
            packageNumber: '',
            itemCode: '',
            goodsType: '',
            quantity: '',
            unit: 'pcs',
            condition: 'good',
            serialNumber: '',
            value: '',
            notes: ''
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
    };

    const handleRemove = (itemId) => {
        onChange(items.filter(item => item.id !== itemId));
    };

    const handleCancel = () => {
        setEditingItem(null);
        setFormData({
            packageNumber: '',
            goodsType: '',
            quantity: '',
            unit: 'pcs',
            condition: 'good',
            serialNumber: '',
            value: '',
            notes: ''
        });
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent-blue" />
                    <h3 className="text-lg font-semibold text-silver-light">Item Barang</h3>
                    <span className="text-sm text-silver-dark">
                        ({items.length} {items.length === 1 ? 'item' : 'items'}, {totalItems} total unit)
                    </span>
                </div>
            </div>

            {/* Item Form */}
            <div className="glass-card p-4 rounded-lg border border-dark-border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Nomor Paket</label>
                        <input
                            type="text"
                            value={formData.packageNumber}
                            onChange={(e) => setFormData({ ...formData, packageNumber: e.target.value })}
                            placeholder="PKG-001"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Kode Barang *</label>
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

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Jenis Barang *</label>
                        <input
                            type="text"
                            value={formData.goodsType}
                            onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                            placeholder="contoh: Pipa Baja, Panel Kaca, Stand Pameran"
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">Jumlah *</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                min="1"
                                placeholder="0"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-silver mb-2">Satuan</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full"
                            >
                                {unit.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Kondisi</label>
                        <select
                            value={formData.condition}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                            className="w-full"
                        >
                            {conditions.map(c => (
                                <option key={c} value={c}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Nomor Seri</label>
                        <input
                            type="text"
                            value={formData.serialNumber}
                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            placeholder="SN-XXXX-XXXX"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Nilai (Rp)</label>
                        <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            min="0"
                            placeholder="0"
                            className="w-full"
                        />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-silver mb-2">Catatan</label>
                        <input
                            type="text"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan tambahan"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    {editingItem && (
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            Batal
                        </Button>
                    )}
                    <Button type="button" onClick={handleAdd} icon={editingItem ? null : Plus}>
                        {editingItem ? 'Perbarui Item' : 'Tambah Item'}
                    </Button>
                </div>
            </div>

            {/* Items List */}
            {items.length > 0 && (
                <div className="glass-card rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-accent-blue">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Paket #</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Jenis Barang</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Jumlah</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Kondisi</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Serial #</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nilai</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-white">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {items.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-dark-surface smooth-transition">
                                        <td className="px-4 py-3 text-sm text-silver">{item.packageNumber || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-medium">{item.goodsType}</td>
                                        <td className="px-4 py-3 text-sm text-silver">
                                            {item.quantity} {item.unit}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.condition === 'good' ? 'bg-green-500/20 text-green-400' :
                                                item.condition === 'damaged' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver">{item.serialNumber || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-silver">
                                            Rp {formatCurrency(item.value)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1 hover:bg-accent-blue hover:bg-opacity-20 rounded smooth-transition"
                                                >
                                                    <span className="text-xs text-accent-blue">Edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item.id)}
                                                    className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded smooth-transition"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-dark-surface">
                                <tr>
                                    <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-silver-light">
                                        Total ({items.length} {items.length === 1 ? 'item' : 'items'})
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-accent-blue">
                                        {totalItems} unit
                                    </td>
                                    <td colSpan="2"></td>
                                    <td className="px-4 py-3 text-sm font-bold text-accent-green">
                                        Rp {formatCurrency(totalValue)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {items.length === 0 && (
                <div className="text-center py-8 text-silver-dark">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada item. Klik "Tambah Item" untuk memulai.</p>
                </div>
            )}
        </div>
    );
};

export default LineItemManager;
