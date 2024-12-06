import { initializePassword } from '@/src/actions/member.actions';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function InitializePasswordMemberModal({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
    const router = useRouter();
    const handleInitializePassword = async () => {
        const response = await initializePassword(id);
        if (response.status === 'success') {
            onClose();
            router.refresh();
        } else {
            toast.error(response.message);
        }
    };
    return (
        <>
            <Modal isOpen={open} onOpenChange={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Rénitialisation du mot de passe</ModalHeader>
                            <ModalBody>
                                <p>Êtes-vous sûr de vouloir rénitialiser le mot de passe de ce membre ?</p>
                                <p>Ce membre devra renseigner un nouveau mot de passe lors de sa prochaine connexion.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={handleInitializePassword}>
                                    Confirmer la rénitialisation
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
