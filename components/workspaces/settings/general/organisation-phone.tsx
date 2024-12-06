'use client';

import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';

import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { updateOrganisation } from '@/src/actions/organisations.actions';
import { _createOrganisationSchema, createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';

import { InputPhone } from '@/components/ui/form-ui/input-phone';
import { toast } from 'react-toastify';

export const OrganisationPhone = ({ phone_number }: { phone_number: string; }) => {
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
            phone: phone_number,
        },
    });

    return (
        <form action={formAction}>
            <Card className="max-w-screen-xl p-1" id="org-phone">
                <CardHeader>
                    <div className="flex flex-col gap-2 max-w-screen-sm">
                        <h1
                            className={title({
                                size: 'h5',
                            })}
                        >
                            Numéro de téléphone de l&apos;organisation
                        </h1>
                        <p className="text-sm text-muted-foreground">C&apos;est le numéro de téléphone visible de votre organisation au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => (
                                <InputPhone
                                    isRequired
                                    aria-invalid={errors.phone ? 'true' : 'false'}
                                    errorMessage={errors.phone?.message ?? ''}
                                    isInvalid={!!errors.phone}
                                    label="Numéro de téléphone de l'organisation"
                                    name="phone"
                                    placeholder="Entrez le numéro de téléphone de l'organisation"
                                    radius="sm"
                                    setValue={(value: string) => {
                                        field.onChange(value);
                                    }}
                                    type="tel"
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
