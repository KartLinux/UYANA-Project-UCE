export const formatters = {
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Guayaquil'
    });
  },

  formatValue(value: string | null): string {
    return value !== null && value !== undefined ? value : '0';
  },

  formatNumber(value: string | null): string {
    if (value === null || value === undefined) return '0';
    return isNaN(Number(value)) ? value : Number(value).toLocaleString('es-ES');
  },

  formatCoordinate(coordinate: string | null): string {
    if (!coordinate) return '0';
    return coordinate.replace(',', '.');
  },
 
};