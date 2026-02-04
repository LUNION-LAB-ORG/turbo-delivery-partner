import { generatePdfTemplate, generateXlsTickets } from '@/features/tickets/utils/ticket-export.utils';
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

    const handlePdfExport = (dataToExport: BonLivraisonTerminee[]) => {
        const htmlContent = generatePdfTemplate(dataToExport);
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            toast.error('Impossible d’ouvrir la fenêtre d’impression. Veuillez autoriser les pop-ups.');
            return;
        }

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
            toast.success(`${dataToExport.length} ligne(s) prêtes pour export PDF. Utilisez "Enregistrer en PDF" dans la boîte de dialogue d'impression.`);
        }, 250);
    };

    return {
        handleExcelExport,
        handlePdfExport
    };
}

export default useTicketsExport;