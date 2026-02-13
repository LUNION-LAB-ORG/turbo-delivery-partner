export interface IContestation {
    id: string;
    facture_id: string;
    description: string;
    status: 'RESOLUE' | 'ACTIVE';
    createdAt: string;
}

export interface IContestationSearchParams {
    factureId: string;
    debut?: string;
    fin?: string;
    page: number;
    size: number;
}