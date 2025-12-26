import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import Button from './Button';
import { formatCurrency } from '../../utils/currencyFormatter';

const CustomCostsManager = ({ costs = [], onChange }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: ''
    });

    const handleAdd = () => {
        if (!formData.description || !formData.amount) {
            // Silently skip if fields are empty - user doesn't have to add custom costs
            return;
        }

        const newCost = {
            id: `cost-${Date.now()}`,
            description: formData.description,
            amount: Number(formData.amount),
            total: Number(formData.amount)
        };

        onChange([...costs, newCost]);
        setFormData({ description: '', amount: '' });
    };

    const handleRemove = (costId) => {
        onChange(costs.filter(cost => cost.id !== costId));
    };

    const totalCustomCosts = costs.reduce((sum, cost) => sum + cost.total, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-orange" />
                <h3 className="text-lg font-semibold text-silver-light">Biaya Tambahan</h3>
                <span className="text-xs text-silver-dark">
                    ({costs.length} items, total: Rp {formatCurrency(totalCustomCosts)})
                </span>
            </div>

            {/* Add Form */}
            <div className="glass-card p-4 rounded-lg border border-dark-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">
                            Deskripsi Biaya
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="contoh: Biaya Administrasi, Biaya Sewa Alat"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">
                            Jumlah (Rp)
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            min="0"
                            placeholder="0"
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="button" size="sm" onClick={handleAdd} icon={Plus}>
                        Tambah Biaya
                    </Button>
                </div>
            </div>

            {/* Costs List */}
            {costs.length > 0 && (
                <div className="glass-card rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-accent-orange">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                                    Deskripsi
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                                    Jumlah
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-white">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {costs.map(cost => (
                                <tr key={cost.id} className="hover:bg-dark-surface smooth-transition">
                                    <td className="px-4 py-3 text-sm text-silver-light font-medium">
                                        {cost.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-accent-green">
                                        Rp {formatCurrency(cost.total)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(cost.id)}
                                                className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded smooth-transition"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomCostsManager;
