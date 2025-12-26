/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the CSV file
 * @param {Array} columns - Array of column definitions {key, header}
 */
export const exportToCSV = (data, filename, columns) => {
    if (!data || data.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
    }

    // Create CSV header
    const headers = columns.map(col => col.header).join(',');

    // Create CSV rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value = item[col.key];

            // Handle different data types
            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            } else if (typeof value === 'string' && value.includes(',')) {
                // Escape commas in strings
                value = `"${value}"`;
            }

            return value;
        }).join(',');
    });

    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
