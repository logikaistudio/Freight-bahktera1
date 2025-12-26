import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const QuotationSummary = ({
    itemsSubtotal = 0,
    serviceSubtotal = 0,
    customCostsSubtotal = 0,
    discountType = 'percentage',
    discountValue = 0,
    taxRate = 11,
    onDiscountChange,
    onTaxRateChange
}) => {
    // Calculate discount amount
    const subtotalBeforeDiscount = itemsSubtotal + serviceSubtotal + customCostsSubtotal;
    let discountAmount = 0;
    if (discountType === 'percentage') {
        discountAmount = (subtotalBeforeDiscount * discountValue) / 100;
    } else {
        discountAmount = discountValue;
    }

    // Calculate totals
    const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
    const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
    const grandTotal = subtotalAfterDiscount + taxAmount;

    return (
        <div className="glass-card p-6 rounded-lg border border-dark-border space-y-4">
            <h3 className="text-lg font-semibold text-silver-light mb-4">
                Ringkasan Biaya
            </h3>

            {/* Breakdown */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-silver-dark">
                    <span>Nilai Barang (Pabean):</span>
                    <span>Rp {formatCurrency(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-silver-dark">
                    <span>Biaya Layanan:</span>
                    <span>Rp {formatCurrency(serviceSubtotal)}</span>
                </div>
                {customCostsSubtotal > 0 && (
                    <div className="flex justify-between text-silver-dark">
                        <span>Biaya Tambahan:</span>
                        <span>Rp {formatCurrency(customCostsSubtotal)}</span>
                    </div>
                )}
                <div className="flex justify-between font-semibold text-silver-light pt-2 border-t border-dark-border">
                    <span>Subtotal:</span>
                    <span>Rp {formatCurrency(subtotalBeforeDiscount)}</span>
                </div>

                {/* Discount Control */}
                <div className="flex justify-between items-center py-2 bg-dark-surface p-3 rounded">
                    <label className="text-silver-dark font-medium">Discount:</label>
                    <div className="flex gap-2 items-center">
                        <select
                            value={discountType}
                            onChange={(e) => onDiscountChange({ type: e.target.value, value: discountValue })}
                            className="text-sm py-1 px-2"
                        >
                            <option value="percentage">%</option>
                            <option value="nominal">Rp</option>
                        </select>
                        <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => onDiscountChange({ type: discountType, value: Number(e.target.value) })}
                            min="0"
                            className="w-24 text-sm py-1 px-2"
                            placeholder="0"
                        />
                    </div>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-accent-orange">
                        <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'amount'}):</span>
                        <span>- Rp {formatCurrency(discountAmount)}</span>
                    </div>
                )}

                <div className="flex justify-between font-semibold text-silver-light pt-2 border-t border-dark-border">
                    <span>Subtotal setelah Discount:</span>
                    <span>Rp {formatCurrency(subtotalAfterDiscount)}</span>
                </div>

                {/* Tax Rate Control */}
                <div className="flex justify-between items-center py-2 bg-dark-surface p-3 rounded">
                    <label className="text-silver-dark font-medium">Pajak (PPN):</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            value={taxRate}
                            onChange={(e) => onTaxRateChange(Number(e.target.value))}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-20 text-sm py-1 px-2"
                        />
                        <span className="text-sm text-silver-dark">%</span>
                    </div>
                </div>
                <div className="flex justify-between text-accent-blue">
                    <span>Pajak ({taxRate}%):</span>
                    <span>Rp {formatCurrency(taxAmount)}</span>
                </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-accent-green">
                <span className="text-xl font-bold text-silver-light">TOTAL:</span>
                <span className="text-2xl font-bold text-accent-green">
                    Rp {formatCurrency(grandTotal)}
                </span>
            </div>
        </div>
    );
};

export default QuotationSummary;
