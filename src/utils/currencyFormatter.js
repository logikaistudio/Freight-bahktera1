// Helper function to format number to Indonesian currency format (xxx.xxx.xxx)
export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return '0';
    }

    const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;

    if (isNaN(num)) {
        return '0';
    }

    return num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};

// Helper function to parse formatted currency back to number
export const parseCurrency = (value) => {
    if (!value) return 0;
    // Remove all dots (thousand separators)
    return parseInt(value.replace(/\./g, ''), 10) || 0;
};

// Hook for currency input handling
export const useCurrencyInput = (initialValue = 0) => {
    const [displayValue, setDisplayValue] = React.useState(formatCurrency(initialValue));
    const [numericValue, setNumericValue] = React.useState(initialValue);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatCurrency(inputValue);
        const numeric = parseCurrency(formatted);

        setDisplayValue(formatted);
        setNumericValue(numeric);

        return numeric;
    };

    const setValue = (value) => {
        const formatted = formatCurrency(value);
        const numeric = parseCurrency(formatted);
        setDisplayValue(formatted);
        setNumericValue(numeric);
    };

    return {
        displayValue,
        numericValue,
        handleChange,
        setValue
    };
};
