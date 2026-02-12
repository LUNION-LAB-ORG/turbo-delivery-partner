export interface IContestation {
    id: string;
    facture_id: string;
    description: string;
    status: 'RESOLUE' | 'ACTIVE';
    created_at: string;
    updated_at: string;
}