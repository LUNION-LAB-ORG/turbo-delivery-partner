'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea, Button } from '@heroui/react';
import { Label } from '@/components/ui/label';
import { createContestationDTO, createContestationSchema, updateContestationDTO, updateContestationSchema } from '@/features/factures/schemas/contestation.schema';
import { IContestation } from '@/features/factures/types/contestation.types';

interface ContestationFormProps {
    factureId: string;
    contestation?: IContestation; // Pour la modification
    onSubmit: (data: createContestationDTO | updateContestationDTO) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

export function ContestationForm({ factureId, contestation, onSubmit, isSubmitting, onCancel }: ContestationFormProps) {
    const isEditing = !!contestation;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<createContestationDTO | updateContestationDTO>({
        resolver: zodResolver(isEditing ? updateContestationSchema : createContestationSchema),
        defaultValues: isEditing
            ? {
                  description: contestation.description || '',
              }
            : {
                  factureId: factureId,
                  description: '',
              },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description de la contestation <span className="text-red-500">*</span>
                </Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id="description"
                            placeholder="Décrivez le motif de votre contestation... (minimum 10 caractères)"
                            minRows={4}
                            maxRows={8}
                            isInvalid={!!errors.description}
                            errorMessage={errors.description?.message}
                            classNames={{
                                input: 'resize-y',
                            }}
                        />
                    )}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 caractères, maximum 1000 caractères</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="light" onPress={onCancel} isDisabled={isSubmitting}>
                        Annuler
                    </Button>
                )}
                <Button type="submit" color="primary" isLoading={isSubmitting} isDisabled={isSubmitting}>
                    {isEditing ? 'Modifier la contestation' : 'Créer la contestation'}
                </Button>
            </div>
        </form>
    );
}


