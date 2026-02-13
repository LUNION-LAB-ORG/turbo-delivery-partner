'use client';

import { Badge, Button, useDisclosure } from '@heroui/react';
import { AlertCircle } from 'lucide-react';
import { ContestationDrawer } from './contestation-drawer';

interface ContestationButtonProps {
    factureId: string;
    nbrContestations?: number;
}

export function ContestationButton({ factureId, nbrContestations = 0 }: ContestationButtonProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Badge content={nbrContestations} color="danger" isInvisible={nbrContestations === 0} size="sm">
                <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    startContent={<AlertCircle className="w-4 h-4" />}
                    onPress={onOpen}
                >
                    Contester
                </Button>
            </Badge>
            <ContestationDrawer isOpen={isOpen} onClose={onClose} factureId={factureId} />
        </>
    );
}

