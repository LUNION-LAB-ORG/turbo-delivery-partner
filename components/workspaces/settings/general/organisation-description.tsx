'use client';

import { Textarea } from '@nextui-org/react';
import { Divider, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { updateOrganisation } from '@/src/actions/organisations.actions';
import { _createOrganisationSchema, createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { toast } from 'react-toastify';

export const OrganisationDescription = ({ description }: { description: string; }) => {
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
            description: description,
        },
    });

    return (
        <form action={formAction}>
            <Card className="max-w-screen-xl p-1" id="org-description">
                <CardHeader>
                    <div className="flex flex-col gap-2 max-w-screen-sm">
                        <h1
                            className={title({
                                size: 'h5',
                            })}
                        >
                            Description de l&apos;organisation
                        </h1>
                        <p className="text-sm text-muted-foreground">C&apos;est la description visible de votre organisation au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="">
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    isRequired
                                    aria-invalid={errors.description ? 'true' : 'false'}
                                    aria-label="description input"
                                    errorMessage={errors.description?.message ?? ''}
                                    isInvalid={!!errors.description}
                                    name="description"
                                    placeholder="Entrez la description de l'organisation"
                                    radius="sm"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <span className={body({ size: 'caption' })}>Veuillez utiliser 32 caractères au maximum.</span>
                    <SubmitButton className="w-fit" color="primary" type="submit">
                        Sauvegarder
                    </SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
};
