'use client';

import { Button, useDisclosure } from '@heroui/react';
import { AlertCircle } from 'lucide-react';
import { ContestationModal } from './contestation-modal';

interface ContestationButtonProps {
    factureId: string;
}

export function ContestationButton({ factureId }: ContestationButtonProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                size="sm"
                color="warning"
                variant="flat"
                startContent={<AlertCircle className="w-4 h-4" />}
                onPress={onOpen}
            >
                Contester
            </Button>
            <ContestationModal isOpen={isOpen} onClose={onClose} factureId={factureId} />
        </>
    );
}

