'use client';
import { Button, Card, CardBody, CardFooter, CardHeader, Switch, useDisclosure } from '@nextui-org/react';
import React from 'react';
import DeleteAccountModal from './modals/delete-account.modal';

export const DeactivateAccountSection: React.FC = () => (
    <Card>
        <CardHeader>
            <h5 className="mb-4 text-lg font-semibold">Désactiver mon compte</h5>
        </CardHeader>
        <CardBody>
            <p>Vous ne pourrez pas recevoir de messages, notifications pendant 24 heures.</p>
        </CardBody>
        <CardFooter>
            <Switch />
        </CardFooter>
    </Card>
);

export const DeleteAccountSection: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <DeleteAccountModal open={isOpen} onClose={onClose} />
            <Card>
                <CardHeader>
                    <h5 className="mb-4 text-lg font-semibold">Supprimer mon compte</h5>
                </CardHeader>
                <CardBody>
                    <p>Une fois que vous supprimez le compte, il n&apos;est pas possible de revenir en arrière. Soyez certain.</p>
                </CardBody>
                <CardFooter>
                    <Button color="danger" variant="light" onPress={onOpen}>
                        Supprimer mon compte
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default function DangerZoneTab() {
    return (
        <div className="switch">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* <DeactivateAccountSection /> */}
                <DeleteAccountSection />
            </div>
        </div>
    );
}
