'use client';

import { Card, CardBody, CardFooter, CardHeader, Input, Divider } from '@nextui-org/react';

import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { updateOrganisation } from '@/src/actions/organisations.actions';
import { _createOrganisationSchema, createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { toast } from 'react-toastify';

export const ManagerInfo = ({ manager_name, manager_email }: { manager_name: string; manager_email: string; }) => {
    const router = useRouter();

    const [, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await updateOrganisation(prevState, formData);

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
    } = useForm<_createOrganisationSchema>({
        resolver: zodResolver(createOrganisationSchema),
        defaultValues: {
            manager_name: manager_name,
            manager_email: manager_email,
        },
    });

    return (
        <form action={formAction}>
            <Card className="max-w-screen-xl p-1" id="org-manager">
                <CardHeader>
                    <div className="flex flex-col gap-2 max-w-screen-sm">
                        <h1
                            className={title({
                                size: 'h5',
                            })}
                        >
                            Informations sur le manager de l&apos;organisation
                        </h1>
                        <p className="text-sm text-muted-foreground">Ce sont les informations visible de votre organisation au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
                        <Controller
                            control={control}
                            name="manager_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    aria-invalid={errors.manager_name ? 'true' : 'false'}
                                    aria-label="manager name input"
                                    errorMessage={errors.manager_name?.message ?? ''}
                                    isInvalid={!!errors.manager_name}
                                    label="Nom du manager"
                                    name="manager_name"
                                    placeholder="Entrez le nom du manager"
                                    radius="sm"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="manager_email"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    aria-invalid={errors.manager_email ? 'true' : 'false'}
                                    aria-label="manager email input"
                                    errorMessage={errors.manager_email?.message ?? ''}
                                    isInvalid={!!errors.manager_email}
                                    label="E-mail du manager"
                                    name="manager_email"
                                    placeholder="Entrez l'email du manager"
                                    radius="sm"
                                    type="email"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 items-center">
                    <SubmitButton className="w-fit" color="primary" type="submit">
                        Sauvegarder
                    </SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
};
