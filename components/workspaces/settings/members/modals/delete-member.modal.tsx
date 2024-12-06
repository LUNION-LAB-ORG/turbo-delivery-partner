import { deleteMember } from '@/src/actions/member.actions';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function DeleteMemberModal({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
    const router = useRouter();
    const handleDeleteMember = async () => {
        const response = await deleteMember(id);
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
                            <ModalHeader className="flex flex-col gap-1">Suppression du membre</ModalHeader>
                            <ModalBody>
                                <p>Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={handleDeleteMember}>
                                    Confirmer la suppression
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
