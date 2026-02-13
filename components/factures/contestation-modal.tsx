'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { ContestationForm } from './contestation-form';
import { useCreerContestation, useModifierContestation } from '@/features/factures/queries/contestation.mutation';
import { createContestationDTO, updateContestationDTO } from '@/features/factures/schemas/contestation.schema';
import { IContestation } from '@/features/factures/types/contestation.types';

interface ContestationModalProps {
    isOpen: boolean;
    onClose: () => void;
    factureId: string;
    contestation?: IContestation; // Pour la modification
}

export function ContestationModal({ isOpen, onClose, factureId, contestation }: ContestationModalProps) {
    const { mutate: creerContestation, isPending: isCreating } = useCreerContestation();
    const { mutate: modifierContestation, isPending: isUpdating } = useModifierContestation();

    const isEditing = !!contestation;
    const isPending = isCreating || isUpdating;

    const handleSubmit = (data: createContestationDTO | updateContestationDTO) => {
        if (isEditing && contestation) {
            modifierContestation(
                { id: contestation.id, data: data as updateContestationDTO },
                {
                    onSuccess: () => {
                        onClose();
                    }
                }
            );
        } else {
            creerContestation(data as createContestationDTO, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <Modal isDismissable={false} isOpen={isOpen} onClose={onClose} size="2xl" placement="center" backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold">{isEditing ? 'Modifier la contestation' : 'Contester la facture'}</h3>
                    <p className="text-sm text-gray-500">Décrivez le motif de votre contestation</p>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <ContestationForm factureId={factureId} contestation={contestation} onSubmit={handleSubmit}
                                      isSubmitting={isPending} onCancel={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}


