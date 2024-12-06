'use client';

import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { getProfileOrganisations } from '@/src/actions/organisations.actions';
import { duplicateRole } from '@/src/actions/roles.actions';
import { _duplicateRoleSchema, duplicateRoleSchema } from '@/src/schemas/roles.schema';
import { ProfileOrganisations, Organisation as ProfileOrganisation } from '@/types';
import { Role } from '@/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function DuplicateRoleModal({ open, onClose, role }: { open: boolean; onClose: () => void; role: Role }) {
    const router = useRouter();

    const [organisations, setOrganisations] = useState<ProfileOrganisation[]>([]);
    const organisationsSelection = organisations.map((org) => ({
        label: org.name,
        value: org.id,
    }));
    useEffect(() => {
        const fetchOrganisations = async () => {
            const profileOrganisation: ProfileOrganisations | null = await getProfileOrganisations();
            setOrganisations(profileOrganisation?.organisations || []);
        };
        fetchOrganisations();
    }, []);

    const [, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await duplicateRole(formData, role.id);

            if (result.status === 'success') {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }

            return result;
        },
        {
            data: null,
            message: '',
            errors: {},
            status: 'idle',
            code: undefined,
        },
    );

    const {
        formState: { errors },
        control,
    } = useForm<_duplicateRoleSchema>({
        resolver: zodResolver(duplicateRoleSchema),
        defaultValues: {
            name: role.name,
            organisation: role.organisation?.id || '',
        },
    });

    return (
        <Modal isOpen={open} onOpenChange={onClose}>
                <ModalContent>
                    {(onClose) => (
                        
                <form action={formAction}>
                            <ModalHeader className="flex flex-col gap-1">Duplication de rôle</ModalHeader>
                            <ModalBody>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            isRequired
                                            aria-invalid={errors.name ? 'true' : 'false'}
                                            aria-label="name input"
                                            errorMessage={errors.name?.message ?? ''}
                                            isInvalid={!!errors.name}
                                            name="name"
                                            placeholder="Entrez le nom du rôle"
                                            radius="sm"
                                            type="text"
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="organisation"
                                    render={({ field }) => {
                                        const isValueInCollection = organisationsSelection.some((org: any) => org.value === field.value);

                                        return (
                                            <Select
                                                {...field}
                                                isRequired
                                                required
                                                aria-invalid={errors.organisation ? 'true' : 'false'}
                                                aria-label="organisation Select"
                                                disabled={!organisationsSelection}
                                                isInvalid={!!errors.organisation}
                                                label="Où dupliquer le rôle ?"
                                                labelPlacement="outside"
                                                name="organisation"
                                                placeholder="Entrez l'organisation"
                                                radius="sm"
                                                selectedKeys={isValueInCollection ? [field.value] : []}
                                            >
                                                {organisationsSelection.map((org: any) => (
                                                    <SelectItem key={org.value} color="primary" textValue={org.label} value={org.value}>
                                                        {org.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        );
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <SubmitButton className="w-fit" color="primary" type="submit" disabled={organisationsSelection.length === 0}>
                                    Confirmer la duplication
                                </SubmitButton>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
    );
}
