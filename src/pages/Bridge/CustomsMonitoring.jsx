import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/Common/StatCard';
import { formatCurrency } from '../../utils/currencyFormatter';

const CustomsMonitoring = () => {
    const { inboundTransactions, outboundTransactions } = useData();
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedGoodsType, setSelectedGoodsType] = useState('all');

    // Aggregate movements
    const movements = [];

    // Add inbound movements (IN)
    inboundTransactions.forEach(trans => {
        const items = trans.items || [];
        items.forEach(item => {
            movements.push({
                id: `in-${trans.id}-${item.id}`,
                date: trans.date,
                type: 'IN',
                bcDocNumber: trans.bcDocNumber || trans.id,
                bcDocDate: trans.date,
                goodsType: item.goodsType,
                packageNumber: item.packageNumber,
                quantity: item.quantity,
                unit: item.unit,
                serialNumber: item.serialNumber,
                condition: item.condition,
                officer: trans.officer || 'N/A',
                status: trans.status || 'cleared',
                customer: trans.supplier,
                notes: item.notes
            });
        });
    });

    // Add outbound movements (OUT)
    outboundTransactions.forEach(trans => {
        const items = trans.items || [];
        items.forEach(item => {
            movements.push({
                id: `out-${trans.id}-${item.id}`,
                date: trans.date,
                type: 'OUT',
                bcDocNumber: trans.bcDocNumber || trans.id,
                bcDocDate: trans.date,
                goodsType: item.goodsType,
                packageNumber: item.packageNumber,
                quantity: -item.quantity, // Negative for OUT
                unit: item.unit,
                serialNumber: item.serialNumber,
                condition: item.condition,
                officer: trans.officer || 'N/A',
                status: trans.status || 'cleared',
                customer: trans.recipient,
                notes: item.notes
            });
        });
    });

    // Calculate stock position by goods type
    const stockPosition = {};
    movements.forEach(mov => {
        if (!stockPosition[mov.goodsType]) {
            stockPosition[mov.goodsType] = {
                goodsType: mov.goodsType,
                totalIn: 0,
                totalOut: 0,
                broke: 0,
                currentStock: 0,
                unit: mov.unit,
                movements: []
            };
        }

        const stock = stockPosition[mov.goodsType];
        stock.movements.push(mov);

        if (mov.type === 'IN') {
            stock.totalIn += mov.quantity;
            stock.currentStock += mov.quantity;
        } else if (mov.type === 'OUT') {
            stock.totalOut += Math.abs(mov.quantity);
            stock.currentStock += mov.quantity; // Already negative
        } else if (mov.type === 'BROKE') {
            stock.broke += Math.abs(mov.quantity);
            stock.currentStock += mov.quantity; // Already negative
        }
    });

    const stockPositions = Object.values(stockPosition);

    // Calculate totals
    const totalInbound = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0);
    const totalOutbound = Math.abs(movements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0));
    const totalBroke = Math.abs(movements.filter(m => m.type === 'BROKE').reduce((sum, m) => sum + m.quantity, 0));
    const totalStock = stockPositions.reduce((sum, s) => sum + s.currentStock, 0);

    // Get unique goods types for filter
    const goodsTypes = ['all', ...new Set(movements.map(m => m.goodsType))];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Customs Monitoring (Pabean)</h1>
                    <p className="text-silver-dark mt-1">Goods Movement Tracking & Compliance</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={selectedGoodsType}
                        onChange={(e) => setSelectedGoodsType(e.target.value)}
                        className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-silver"
                    >
                        {goodsTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All Goods Types' : type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Inbound (IN)"
                    value={`${totalInbound} units`}
                    icon={TrendingUp}
                    iconColor="text-accent-green"
                />
                <StatCard
                    title="Total Outbound (OUT)"
                    value={`${totalOutbound} units`}
                    icon={TrendingDown}
                    iconColor="text-accent-blue"
                />
                <StatCard
                    title="Broke/Damaged"
                    value={`${totalBroke} units`}
                    icon={AlertTriangle}
                    iconColor="text-red-500"
                />
                <StatCard
                    title="Current Stock"
                    value={`${totalStock} units`}
                    icon={Shield}
                    iconColor="text-accent-cyan"
                />
            </div>

            {/* Stock Position Report */}
            <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-bold text-silver-light mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-cyan" />
                    Stock Position by Goods Type
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-surface">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Goods Type</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-silver-light">Total IN</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-silver-light">Total OUT</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-silver-light">Broke</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-silver-light">Current Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {stockPositions
                                .filter(s => selectedGoodsType === 'all' || s.goodsType === selectedGoodsType)
                                .map((stock, index) => (
                                    <tr key={index} className="hover:bg-dark-surface smooth-transition">
                                        <td className="px-4 py-3 text-sm font-medium text-silver-light">{stock.goodsType}</td>
                                        <td className="px-4 py-3 text-sm text-right text-accent-green">
                                            +{stock.totalIn} {stock.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-accent-blue">
                                            -{stock.totalOut} {stock.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-red-400">
                                            -{stock.broke} {stock.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right font-bold text-accent-cyan">
                                            {stock.currentStock} {stock.unit}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Movement History */}
            <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-bold text-silver-light mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent-blue" />
                    Movement History
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-surface">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">BC Doc #</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Goods Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Package #</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-silver-light">Quantity</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-silver-light">Customer</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {movements
                                .filter(m => selectedGoodsType === 'all' || m.goodsType === selectedGoodsType)
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0, 50)
                                .map((movement) => (
                                    <tr key={movement.id} className="hover:bg-dark-surface smooth-transition">
                                        <td className="px-4 py-3 text-sm text-silver">
                                            {new Date(movement.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${movement.type === 'IN' ? 'bg-green-500/20 text-green-400' :
                                                movement.type === 'OUT' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {movement.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver font-mono">{movement.bcDocNumber}</td>
                                        <td className="px-4 py-3 text-sm text-silver-light font-medium">{movement.goodsType}</td>
                                        <td className="px-4 py-3 text-sm text-silver">{movement.packageNumber || '-'}</td>
                                        <td className={`px-4 py-3 text-sm text-right font-semibold ${movement.type === 'IN' ? 'text-accent-green' : 'text-accent-blue'
                                            }`}>
                                            {movement.type === 'IN' ? '+' : ''}{movement.quantity} {movement.unit}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${movement.status === 'cleared' ? 'bg-accent-green/20 text-accent-green' :
                                                movement.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {movement.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-silver">{movement.customer || '-'}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomsMonitoring;
