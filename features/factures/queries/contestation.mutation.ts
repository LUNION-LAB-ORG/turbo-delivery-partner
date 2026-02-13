import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { creerContestationRequest, modifierContestationRequest } from '@/features/factures/requests/factures.request';
import { createContestationDTO, updateContestationDTO } from '@/features/factures/schemas/contestation.schema';
import { useInvalidateContestationsQuery } from './index.query';
import { factureKeys } from '@/features/factures/queries/facture.query';

/**
 * Hook pour créer une contestation
 */
export function useCreerContestation() {
    const queryClient = useQueryClient();
    const invalidateContestations = useInvalidateContestationsQuery();

    return useMutation({
        mutationFn: (data: createContestationDTO) => creerContestationRequest(data),
        onSuccess: async (_) => {
            toast.success('Contestation créée avec succès');
            // Invalider et recharger toutes les contestations
            await invalidateContestations();
            // Invalider la liste des factures pour mettre à jour le compteur
            queryClient.invalidateQueries({ queryKey: factureKeys.lists() });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erreur lors de la création de la contestation');
        },
    });
}

/**
 * Hook pour modifier une contestation
 */
export function useModifierContestation() {
    const queryClient = useQueryClient();
    const invalidateContestations = useInvalidateContestationsQuery();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: updateContestationDTO }) => modifierContestationRequest(id, data),
        onSuccess: async () => {
            toast.success('Contestation modifiée avec succès');
            // Invalider et recharger toutes les contestations
            await invalidateContestations();
            // Invalider la liste des factures
            queryClient.invalidateQueries({ queryKey: factureKeys.lists() });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erreur lors de la modification de la contestation');
        },
    });
}


