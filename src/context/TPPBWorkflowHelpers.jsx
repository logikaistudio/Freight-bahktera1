// TPPB Workflow Helper Methods
// This file contains stub/temporary methods for TPPB workflow
// These should be integrated into DataContext.jsx

export const tppbWorkflowMethods = {
    // Quotation operations
    addQuotation: (quotation, setQuotations, quotations, setCustomsDocuments, customsDocuments) => {
        const newQuotation = {
            ...quotation,
            id: `QT-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setQuotations([...quotations, newQuotation]);
        return newQuotation;
    },

    confirmQuotation: (quotationId, quotations, setQuotations, customsDocuments, setCustomsDocuments) => {
        const quotation = quotations.find(q => q.id === quotationId);
        if (!quotation) return;

        // Update quotation status
        setQuotations(quotations.map(q =>
            q.id === quotationId ? { ...q, status: 'confirmed' } : q
        ));

        // Auto-create BC document
        const bcDoc = {
            id: `BC-${Date.now()}`,
            bcType: quotation.type === 'inbound' ? 'BC 2.3' : 'BC 2.7',
            bcNumber: `${quotation.type === 'inbound' ? 'BC23' : 'BC27'}-${Date.now().toString().slice(-6)}`,
            submittedDate: new Date().toISOString().split('T')[0],
            quotationId: quotation.id,
            type: quotation.type,
            customer: quotation.customer,
            origin: quotation.origin || '',
            destination: quotation.destination || '',
            items: quotation.items,
            totalItems: quotation.items.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: quotation.items.reduce((sum, item) => sum + (item.value || 0), 0),
            status: 'pending',
            approvedDate: null,
            approvedBy: null,
            rejectionReason: null,
            notes: ''
        };
        setCustomsDocuments([...customsDocuments, bcDoc]);
    },

    // BC Document operations
    approveBC: (bcDocId, approvedBy, customsDocuments, setCustomsDocuments) => {
        setCustomsDocuments(customsDocuments.map(doc =>
            doc.id === bcDocId ? {
                ...doc,
                status: 'approved',
                approvedDate: new Date().toISOString().split('T')[0],
                approvedBy
            } : doc
        ));
    },

    rejectBC: (bcDocId, reason, customsDocuments, setCustomsDocuments) => {
        setCustomsDocuments(customsDocuments.map(doc =>
            doc.id === bcDocId ? {
                ...doc,
                status: 'rejected',
                rejectionReason: reason
            } : doc
        ));
    },

    // Goods Movement operations
    addGoodsMovement: (movement, goodsMovements, setGoodsMovements) => {
        const newMovement = {
            ...movement,
            id: `GM-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setGoodsMovements([...goodsMovements, newMovement]);
        return newMovement;
    },

    // Inspection operations
    addInspection: (inspection, inspections, setInspections, goodsMovements, setGoodsMovements) => {
        const newInspection = {
            ...inspection,
            id: `INS-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setInspections([...inspections, newInspection]);

        // Update goods movement status
        setGoodsMovements(goodsMovements.map(m =>
            m.id === inspection.goodsMovementId ? { ...m, status: 'stored' } : m
        ));

        return newInspection;
    }
};
