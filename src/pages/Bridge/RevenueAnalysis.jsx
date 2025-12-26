import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/Common/StatCard';
import { formatCurrency } from '../../utils/currencyFormatter';

const RevenueAnalysis = () => {
    const { inboundTransactions, outboundTransactions } = useData();
    const [period, setPeriod] = useState('month'); // month, quarter, year, all

    // Filter transactions by period
    const filterByPeriod = (transactions) => {
        const now = new Date();
        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (period === 'month') {
                return transactionDate.getMonth() === now.getMonth() &&
                    transactionDate.getFullYear() === now.getFullYear();
            } else if (period === 'quarter') {
                const currentQuarter = Math.floor(now.getMonth() / 3);
                const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
                return transactionQuarter === currentQuarter &&
                    transactionDate.getFullYear() === now.getFullYear();
            } else if (period === 'year') {
                return transactionDate.getFullYear() === now.getFullYear();
            }
            return true; // 'all'
        });
    };

    const filteredInbound = filterByPeriod(inboundTransactions);
    const filteredOutbound = filterByPeriod(outboundTransactions);

    // Calculate financial metrics
    const totalSalesRevenue = filteredOutbound.reduce((sum, t) => sum + (Number(t.value) || 0), 0);

    const totalCOGS = filteredOutbound.reduce((sum, t) => {
        // COGS is calculated from inventory unit cost × quantity
        const qty = Number(t.quantity) || 0;
        const unitCost = Number(t.unitCost) || 0; // This should come from inventory
        return sum + (qty * unitCost);
    }, 0);

    const totalInboundCost = filteredInbound.reduce((sum, t) => sum + (Number(t.value) || 0), 0);
    const totalInboundOpCost = filteredInbound.reduce((sum, t) => sum + (Number(t.totalOperationalCost) || 0), 0);

    const totalOutboundOpCost = filteredOutbound.reduce((sum, t) => sum + (Number(t.totalOperationalCost) || 0), 0);

    const totalOperationalCosts = totalInboundOpCost + totalOutboundOpCost;

    const grossProfit = totalSalesRevenue - totalCOGS;
    const netProfit = grossProfit - totalOperationalCosts;
    const profitMargin = totalSalesRevenue > 0 ? (netProfit / totalSalesRevenue) * 100 : 0;

    const totalTransactions = filteredInbound.length + filteredOutbound.length;

    // Calculate average transaction value
    const avgTransactionValue = totalTransactions > 0 ? (totalSalesRevenue + totalInboundCost) / totalTransactions : 0;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Analisis Revenue</h1>
                    <p className="text-silver-dark mt-1">Financial Performance & Profitability</p>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2">
                    {['month', 'quarter', 'year', 'all'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg font-medium smooth-transition ${period === p
                                    ? 'bg-accent-blue text-white'
                                    : 'bg-dark-surface text-silver-dark hover:bg-dark-border'
                                }`}
                        >
                            {p === 'month' ? 'This Month' : p === 'quarter' ? 'This Quarter' : p === 'year' ? 'This Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Sales Revenue"
                    value={`Rp ${formatCurrency(totalSalesRevenue)}`}
                    icon={DollarSign}
                    iconColor="text-accent-green"
                />
                <StatCard
                    title="Gross Profit"
                    value={`Rp ${formatCurrency(grossProfit)}`}
                    icon={TrendingUp}
                    iconColor="text-accent-cyan"
                />
                <StatCard
                    title="Net Profit"
                    value={`Rp ${formatCurrency(netProfit)}`}
                    icon={netProfit >= 0 ? TrendingUp : TrendingDown}
                    iconColor={netProfit >= 0 ? 'text-accent-green' : 'text-red-500'}
                />
                <StatCard
                    title="Profit Margin"
                    value={`${profitMargin.toFixed(2)}%`}
                    icon={PieChart}
                    iconColor={profitMargin >= 0 ? 'text-accent-blue' : 'text-red-500'}
                />
            </div>

            {/* Profit Breakdown */}
            <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-bold text-silver-light mb-6">Profit Breakdown</h2>

                <div className="space-y-4">
                    {/* Sales Revenue */}
                    <div className="flex justify-between items-center p-4 bg-dark-surface rounded-lg border border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-green bg-opacity-20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="text-sm text-silver-dark">Sales Revenue</p>
                                <p className="text-xs text-silver-dark">{filteredOutbound.length} outbound transactions</p>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-accent-green">Rp {formatCurrency(totalSalesRevenue)}</p>
                    </div>

                    {/* COGS */}
                    <div className="flex justify-between items-center p-4 bg-dark-surface rounded-lg border border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500 bg-opacity-20 flex items-center justify-center">
                                <Package className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-silver-dark">Cost of Goods Sold (COGS)</p>
                                <p className="text-xs text-silver-dark">Inventory costs</p>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-red-400">- Rp {formatCurrency(totalCOGS)}</p>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex justify-between items-center p-4 bg-dark-card rounded-lg border-2 border-accent-cyan">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-cyan bg-opacity-20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-accent-cyan" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-silver-light">Gross Profit</p>
                                <p className="text-xs text-silver-dark">Revenue - COGS</p>
                            </div>
                        </div>
                        <p className={`text-xl font-bold ${grossProfit >= 0 ? 'text-accent-cyan' : 'text-red-500'}`}>
                            Rp {formatCurrency(grossProfit)}
                        </p>
                    </div>

                    {/* Operational Costs */}
                    <div className="flex justify-between items-center p-4 bg-dark-surface rounded-lg border border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-orange bg-opacity-20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-accent-orange" />
                            </div>
                            <div>
                                <p className="text-sm text-silver-dark">Total Operational Costs</p>
                                <p className="text-xs text-silver-dark">
                                    Inbound: Rp {formatCurrency(totalInboundOpCost)} | Outbound: Rp {formatCurrency(totalOutboundOpCost)}
                                </p>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-accent-orange">- Rp {formatCurrency(totalOperationalCosts)}</p>
                    </div>

                    {/* Net Profit */}
                    <div className="flex justify-between items-center p-4 bg-dark-card rounded-lg border-2 border-accent-green">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-green bg-opacity-20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-silver-light">Net Profit</p>
                                <p className="text-xs text-silver-dark">Gross Profit - Operational Costs</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
                                Rp {formatCurrency(netProfit)}
                            </p>
                            <p className="text-sm text-silver-dark">Margin: {profitMargin.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inbound Summary */}
                <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-silver-light mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent-blue" />
                        Inbound Transactions
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Total Transactions:</span>
                            <span className="font-semibold text-silver-light">{filteredInbound.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Total Goods Value:</span>
                            <span className="font-semibold text-silver-light">Rp {formatCurrency(totalInboundCost)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Operational Costs:</span>
                            <span className="font-semibold text-accent-orange">Rp {formatCurrency(totalInboundOpCost)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-dark-border">
                            <span className="font-semibold text-silver-light">Total Cost:</span>
                            <span className="font-bold text-accent-blue">Rp {formatCurrency(totalInboundCost + totalInboundOpCost)}</span>
                        </div>
                    </div>
                </div>

                {/* Outbound Summary */}
                <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-silver-light mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent-green" />
                        Outbound Transactions
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Total Transactions:</span>
                            <span className="font-semibold text-silver-light">{filteredOutbound.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Total Sales Revenue:</span>
                            <span className="font-semibold text-accent-green">Rp {formatCurrency(totalSalesRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-silver-dark">Operational Costs:</span>
                            <span className="font-semibold text-accent-orange">Rp {formatCurrency(totalOutboundOpCost)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-dark-border">
                            <span className="font-semibold text-silver-light">Net Revenue:</span>
                            <span className="font-bold text-accent-green">Rp {formatCurrency(totalSalesRevenue - totalOutboundOpCost)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm text-silver-dark mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-silver-light">{totalTransactions}</p>
                    <p className="text-xs text-silver-dark mt-1">
                        {filteredInbound.length} in, {filteredOutbound.length} out
                    </p>
                </div>
                <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm text-silver-dark mb-1">Avg Transaction Value</p>
                    <p className="text-2xl font-bold text-silver-light">Rp {formatCurrency(avgTransactionValue)}</p>
                    <p className="text-xs text-silver-dark mt-1">Combined average</p>
                </div>
                <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm text-silver-dark mb-1">OpCost Ratio</p>
                    <p className="text-2xl font-bold text-silver-light">
                        {totalSalesRevenue > 0 ? ((totalOperationalCosts / totalSalesRevenue) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-xs text-silver-dark mt-1">Of revenue</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalysis;
