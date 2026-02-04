export function formatDateFR(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatHoursMinutes(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
}
