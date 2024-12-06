import { deleteProfile } from '@/src/actions/auth.actions';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function DeleteAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const handleDeleteAccount = async () => {
        const response = await deleteProfile();
        if (response.status === 'success') {
            onClose();
            router.push('/auth/signout');
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
                            <ModalHeader className="flex flex-col gap-1">Suppression de compte</ModalHeader>
                            <ModalBody>
                                <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.</p>
                                <p>Si vous avez des questions ou des préoccupations, veuillez contacter notre support.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={handleDeleteAccount}>
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
