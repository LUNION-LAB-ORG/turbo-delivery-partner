import { generateXlsTickets } from '@/features/tickets/utils/ticket-export.utils';
import { toast } from 'react-toastify';
import { BonLivraisonTerminee } from '@/types';

function useTicketsExport() {
    const handleExcelExport = (dataToExport: BonLivraisonTerminee[]) => {
        const xlsxData = generateXlsTickets(dataToExport);
        const blob = new Blob([xlsxData], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `tickets_${new Date().toISOString().split('T')[0]}.xls`;
        a.click();

        window.URL.revokeObjectURL(url);

        toast.success(`${dataToExport.length} ligne(s) exportée(s) en Excel`);
    };

    return {
        handleExcelExport
    };
}

export default useTicketsExport;