import React, { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/Common/Button';

const InspectionManagement = () => {
    const {goodsMovements = [], inspections = [], addInspection} = useData();
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [inspectionItems, setInspectionItems] = useState([]);

    // Only show movements pending inspection
    const pendingMovements = goodsMovements.filter(m => m.status === 'pending_inspection');

    const handleSelectMovement = (movement) => {
        setSelectedMovement(movement);
        // Initialize inspection items from movement items
        const items = (movement.items || []).map(item => ({
        packageNumber: item.packageNumber,
    goodsType: item.goodsType,
    bcQuantity: item.quantity,
    actualQuantity: item.quantity,
    unit: item.unit,
    discrepancy: 0,
    condition: 'good',
    conditionNotes: '',
    verified: true
        }));
    setInspectionItems(items);
    };

    const handleItemChange = (index, field, value) => {
        const updated = [...inspectionItems];
    updated[index][field] = value;

    // Auto-calculate discrepancy
    if (field === 'actualQuantity' || field === 'bcQuantity') {
            const actual = Number(updated[index].actualQuantity);
    const bc = Number(updated[index].bcQuantity);
    updated[index].discrepancy = actual - bc;
        }

    setInspectionItems(updated);
    };

    const calculateOverallStatus = () => {
        const hasDiscrepancy = inspectionItems.some(item => item.discrepancy !== 0);
        const hasDamaged = inspectionItems.some(item => item.condition !== 'good');
        const allVerified = inspectionItems.every(item => item.verified);

    if (!allVerified) return 'failed';
    if (hasDiscrepancy || hasDamaged) return 'with_notes';
    return 'passed';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    const inspectionData = {
        goodsMovementId: selectedMovement.id,
    bcDocId: selectedMovement.bcDocId,
    bcNumber: selectedMovement.bcNumber,
    inspectionDate: new Date().toISOString().split('T')[0],
    inspector: 'System Inspector',
    items: inspectionItems,
    overallStatus: calculateOverallStatus(),
    notes: ''
        };

    addInspection(inspectionData);

    setSelectedMovement(null);
    setInspectionItems([]);
    alert('Inspection completed! Goods will be stored in warehouse.');
    };

    return (
    <div className="p-6 space-y-6">
        <div>
            <h1 className="text-3xl font-bold gradient-text">Inspection & Verification</h1>
            <p className="text-silver-dark mt-1">Physical Goods Inspection & BC Verification</p>
        </div>

        {/* Pending Movements */}
        {!selectedMovement && (
            <div className="glass-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-silver-light mb-4">
                    Goods Awaiting Inspection
                </h3>

                {pendingMovements.length === 0 ? (
                    <div className="text-center py-8 text-silver-dark">
                        <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No goods awaiting inspection</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingMovements.map(movement => (
                            <div key={movement.id} className="p-4 bg-dark-surface rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-silver-light">{movement.bcNumber}</p>
                                    <p className="text-sm text-silver-dark">
                                        {movement.type === 'inbound' ? 'Inbound' : 'Outbound'} • {movement.items?.length || 0} items
                                    </p>
                                    <p className="text-xs text-silver-dark mt-1">
                                        Movement Date: {new Date(movement.movementDate).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <Button size="sm" onClick={() => handleSelectMovement(movement)} icon={ClipboardCheck}>
                                    Start Inspection
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Inspection Form */}
        {selectedMovement && (
            <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-semibold text-silver-light">Inspection Form</h3>

                <div className="bg-dark-surface p-4 rounded-lg">
                    <p className="text-sm text-silver-dark mb-1">BC Document:</p>
                    <p className="font-semibold text-silver-light">{selectedMovement.bcNumber}</p>
                </div>

                {/* Inspection Items */}
                <div className="space-y-4">
                    {inspectionItems.map((item, index) => (
                        <div key={index} className="glass-card p-4 rounded-lg border border-dark-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <p className="font-semibold text-silver-light mb-2">
                                        {item.goodsType}
                                        {item.packageNumber && ` - Package: ${item.packageNumber}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-silver mb-2">
                                        BC Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={item.bcQuantity}
                                        disabled
                                        className="w-full bg-dark-surface"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-silver mb-2">
                                        Actual Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={item.actualQuantity}
                                        onChange={(e) => handleItemChange(index, 'actualQuantity', e.target.value)}
                                        min="0"
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-silver mb-2">
                                        Discrepancy
                                    </label>
                                    <input
                                        type="number"
                                        value={item.discrepancy}
                                        disabled
                                        className={`w-full ${item.discrepancy > 0 ? 'text-green-400' :
                                                item.discrepancy < 0 ? 'text-red-400' :
                                                    'text-silver'
                                            } bg-dark-surface`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-silver mb-2">
                                        Condition *
                                    </label>
                                    <select
                                        value={item.condition}
                                        onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="good">Good</option>
                                        <option value="damaged">Damaged</option>
                                        <option value="broken">Broken</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-silver mb-2">
                                        Condition Notes
                                    </label>
                                    <input
                                        type="text"
                                        value={item.conditionNotes}
                                        onChange={(e) => handleItemChange(index, 'conditionNotes', e.target.value)}
                                        placeholder="Details about condition, damage, etc."
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.verified}
                                            onChange={(e) => handleItemChange(index, 'verified', e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-silver">Verified</span>
                                    </label>
                                </div>
                            </div>

                            {/* Alerts */}
                            {item.discrepancy !== 0 && (
                                <div className={`mt-3 p-2 rounded-lg border ${item.discrepancy > 0
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                    }`}>
                                    <p className={`text-sm ${item.discrepancy > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {item.discrepancy > 0 ? '↑' : '↓'}
                                        {Math.abs(item.discrepancy)} {item.unit} discrepancy
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Overall Status */}
                <div className={`p-4 rounded-lg border ${calculateOverallStatus() === 'passed' ? 'bg-green-500/10 border-green-500/30' :
                        calculateOverallStatus() === 'with_notes' ? 'bg-yellow-500/10 border-yellow-500/30' :
                            'bg-red-500/10 border-red-500/30'
                    }`}>
                    <p className={`font-semibold mb-1 ${calculateOverallStatus() === 'passed' ? 'text-green-400' :
                            calculateOverallStatus() === 'with_notes' ? 'text-yellow-400' :
                                'text-red-400'
                        }`}>
                        Overall Status: {calculateOverallStatus().toUpperCase().replace('_', ' ')}
                    </p>
                    <p className="text-sm text-silver-dark">
                        {calculateOverallStatus() === 'passed' && 'All items verified and match BC document'}
                        {calculateOverallStatus() === 'with_notes' && 'Discrepancies or damaged items noted'}
                        {calculateOverallStatus() === 'failed' && 'Some items not verified'}
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="secondary" onClick={() => {
                        setSelectedMovement(null);
                        setInspectionItems([]);
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit" icon={CheckCircle}>
                        Complete Inspection
                    </Button>
                </div>
            </form>
        )}

        {/* Recent Inspections */}
        <div className="glass-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-silver-light mb-4">Recent Inspections</h3>

            {inspections.length === 0 ? (
                <div className="text-center py-8 text-silver-dark">
                    <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No inspections completed yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {inspections.slice(0, 10).map(inspection => (
                        <div key={inspection.id} className="p-4 bg-dark-surface rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-silver-light">{inspection.bcNumber}</p>
                                    <p className="text-sm text-silver-dark">
                                        Inspected: {new Date(inspection.inspectionDate).toLocaleDateString('id-ID')}
                                    </p>
                                    <p className="text-xs text-silver-dark mt-1">
                                        Inspector: {inspection.inspector}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${inspection.overallStatus === 'passed' ? 'bg-green-500/20 text-green-400' :
                                        inspection.overallStatus === 'with_notes' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {inspection.overallStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="text-xs text-silver-dark">
                                {inspection.items?.length || 0} items inspected
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
    );
};

    export default InspectionManagement;
