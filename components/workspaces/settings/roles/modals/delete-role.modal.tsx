import { deleteRole } from '@/src/actions/roles.actions';
import { Role } from '@/types/models';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function DeleteRoleModal({ open, onClose, role }: { open: boolean; onClose: () => void; role: Role }) {
    const router = useRouter();
    const handleDeleteRole = async () => {
        const response = await deleteRole(role.id);
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
                            <ModalHeader className="flex flex-col gap-1">Suppression de rôle</ModalHeader>
                            <ModalBody>
                                <p>
                                    Êtes-vous sûr de vouloir supprimer le rôle {role.name} ? Cette action est irréversible et toutes les membres liés à ce rôle seront affectés au rôle par anonyme
                                    défaut.
                                </p>
                                <p>Si vous avez des questions ou des préoccupations, veuillez contacter notre support.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={handleDeleteRole}>
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
