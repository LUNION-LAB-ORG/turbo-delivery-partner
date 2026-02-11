import React from 'react';
import { title } from '@/components/primitives';
import { FactureTable } from '@/components/factures/facture-table';

function FacturesPage() {
    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className={title({ size: 'h3', class: 'text-primary' })}>Mes Factures</h3>
            </div>
            <FactureTable/>
        </div>
    );
}

export default FacturesPage;