import React from 'react';

type StatsCardProps = {
    title: string;
    value: string | number;
    variant?: 'primary' | 'default';
    isLoading?: boolean;
};

export function TicketStatsCard({ title, value, variant = 'default', isLoading = false }: StatsCardProps) {
    const isPrimary = variant === 'primary';
    const base = 'rounded-xl p-4 sm:p-6';
    const primary = 'bg-gradient-to-br from-orange-400 to-orange-500 text-white';
    const secondary = 'bg-white border border-gray-200 text-gray-900';

    if (isLoading) {
        return <TicketStatsCardSkeleton />;
    }

    return (
        <div className={`${base} ${isPrimary ? primary : secondary}`}>
            <p className={`text-xs sm:text-sm mb-2 ${isPrimary ? 'opacity-90' : 'text-gray-500'}`}>{title}</p>
            <p className="text-lg sm:text-3xl font-bold break-words">{value}</p>
        </div>
    );
}

function TicketStatsCardSkeleton() {
    return (
        <div className="rounded-xl p-4 sm:p-6 bg-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
    );
}
