import React from 'react';
import { Wrench } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../../utils/currencyFormatter';

const DirectCosts = ({ costs = {}, onChange }) => {
    const handleCostChange = (field, value) => {
        const numericValue = parseCurrency(value);
        const updatedCosts = {
            ...costs,
            [field]: numericValue
        };

        // Calculate total
        updatedCosts.total = Object.keys(updatedCosts)
            .filter(key => key !== 'total')
            .reduce((sum, key) => sum + (updatedCosts[key] || 0), 0);

        onChange(updatedCosts);
    };

    const defaultCosts = {
        laborCost: costs.laborCost || 0,
        warehouseOpCost: costs.warehouseOpCost || 0,
        equipmentCost: costs.equipmentCost || 0,
        utilities: costs.utilities || 0,
        externalServices: costs.externalServices || 0,
        other: costs.other || 0,
        total: costs.total || 0
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-accent-orange" />
                <h3 className="text-lg font-semibold text-silver-light">Direct Costs (COGS)</h3>
                <span className="text-xs text-silver-dark">(Actual costs incurred)</span>
            </div>

            <div className="glass-card p-4 rounded-lg border border-dark-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Labor Cost</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.laborCost)}
                            onChange={(e) => handleCostChange('laborCost', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Staff wages & overtime</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Warehouse Operating Cost</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.warehouseOpCost)}
                            onChange={(e) => handleCostChange('warehouseOpCost', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Rent, maintenance, security</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Equipment Cost</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.equipmentCost)}
                            onChange={(e) => handleCostChange('equipmentCost', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Forklift, pallet jack usage</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Utilities</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.utilities)}
                            onChange={(e) => handleCostChange('utilities', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Electricity, water, gas</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">External Services</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.externalServices)}
                            onChange={(e) => handleCostChange('externalServices', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Outsourced transport, insurance premium</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver mb-2">Other Costs</label>
                        <input
                            type="text"
                            value={formatCurrency(defaultCosts.other)}
                            onChange={(e) => handleCostChange('other', e.target.value)}
                            placeholder="0"
                            className="w-full"
                        />
                        <p className="text-xs text-silver-dark mt-1">Miscellaneous direct costs</p>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-silver-light">Total COGS:</span>
                        <span className="text-2xl font-bold text-accent-orange">
                            Rp {formatCurrency(defaultCosts.total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectCosts;
