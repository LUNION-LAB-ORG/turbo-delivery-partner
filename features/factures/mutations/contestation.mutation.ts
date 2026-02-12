import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { creerContestationRequest, modifierContestationRequest } from '@/features/factures/requests/factures.request';
import { createContestationDTO, updateContestationDTO } from '@/features/factures/schemas/contestation.schema';

/**
 * Hook pour créer une contestation
 */
export function useCreerContestation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: createContestationDTO) => creerContestationRequest(data),
        onSuccess: () => {
            toast.success('Contestation créée avec succès');
            queryClient.invalidateQueries({ queryKey: ['factures'] });
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

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: updateContestationDTO }) => modifierContestationRequest(id, data),
        onSuccess: () => {
            toast.success('Contestation modifiée avec succès');
            queryClient.invalidateQueries({ queryKey: ['factures'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erreur lors de la modification de la contestation');
        },
    });
}


