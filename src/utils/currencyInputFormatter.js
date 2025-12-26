// Currency formatting utility for Indonesian Rupiah format
export const formatCurrencyInput = (value) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');

    // Format with dots as thousand separators
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseCurrencyInput = (formattedValue) => {
    // Remove dots and parse to number
    return parseInt(formattedValue.replace(/\./g, '') || '0', 10);
};

export const formatCurrencyDisplay = (value) => {
    if (!value && value !== 0) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
