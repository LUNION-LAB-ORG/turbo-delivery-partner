'use client';

import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { IContestation } from '@/features/factures/types/contestation.types';

interface ContestationListProps {
    contestations: IContestation[];
}

export function ContestationList({ contestations }: ContestationListProps) {
    if (!contestations || contestations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune contestation pour cette facture</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {contestations.map((contestation) => (
                <Card key={contestation.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            {contestation.status === 'RESOLUE' ? (
                                <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-warning" />
                            )}
                            <span className="text-sm font-medium">
                                {format(new Date(contestation.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </span>
                        </div>
                        <Chip color={contestation.status === 'RESOLUE' ? 'success' : 'warning'} size="sm"
                              variant="flat">
                            {contestation.status === 'RESOLUE' ? 'Résolue' : 'Active'}
                        </Chip>
                    </CardHeader>
                    <CardBody className="pt-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{contestation.description}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

