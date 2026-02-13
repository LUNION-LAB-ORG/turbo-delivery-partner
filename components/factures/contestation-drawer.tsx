'use client';

import { Button, Modal, ModalBody, ModalContent, ModalHeader, Pagination } from '@heroui/react';
import { AlertCircle, Plus } from 'lucide-react';
import { ContestationList } from './contestation-list';
import { useContestations } from '@/features/factures/hooks/use-contestations';
import { useState } from 'react';
import { ContestationModal } from './contestation-modal';

interface ContestationDrawerProps {
    factureId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ContestationDrawer({ factureId, isOpen, onClose }: ContestationDrawerProps) {
    const {
        contestations,
        isLoading,
        totalPages,
        totalElements,
        currentPage,
        handlePageChange
    } = useContestations({ factureId, enabled: isOpen });

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
                scrollBehavior="inside"
                classNames={{
                    base: 'max-h-[90vh]'
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-warning" />
                                <h2 className="text-xl font-semibold">Contestations</h2>
                            </div>
                            <Button
                                size="sm"
                                color="primary"
                                startContent={<Plus className="w-4 h-4" />}
                                onPress={() => setIsModalOpen(true)}
                            >
                                Nouvelle contestation
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 font-normal">
                            {totalElements > 0
                                ? `${totalElements} contestation(s) pour cette facture`
                                : 'Aucune contestation pour le moment'}
                        </p>
                    </ModalHeader>
                    <ModalBody className="py-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                <ContestationList contestations={contestations} />

                                {totalPages > 1 && (
                                    <div className="flex justify-center pt-4">
                                        <Pagination
                                            total={totalPages}
                                            page={currentPage + 1}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="sm"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <ContestationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                factureId={factureId}
            />
        </>
    );
}



