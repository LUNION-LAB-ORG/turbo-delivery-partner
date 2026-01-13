import { CalendarDate } from "@heroui/react";

export function formatCFA(value: number | string) {
    const number = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
}

export function calendarToDate(date: CalendarDate): Date {
    return new Date(date.year, date.month - 1, date.day);
};

export function getStatusColor(statut: string) {
    switch (statut?.toUpperCase()) {
        case 'VALIDER':
            return 'warning';
        case 'TERMINER':
            return 'success';
        case 'ANNULER':
            return 'danger';
        case 'EN_ATTENTE':
            return 'secondary';
        default:
            return 'default';
    }
};
