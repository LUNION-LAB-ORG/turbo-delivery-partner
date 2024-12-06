'use client';

import { Card, CardBody, CardFooter, CardHeader, Input, Divider, Select, SelectItem } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import fr from 'react-phone-number-input/locale/fr.json';

import { updateOrganisation } from '@/src/actions/organisations.actions';
import { _createOrganisationSchema, createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { fetchCountries } from '@/components/ui/form-ui/select-country';
import { toast } from 'react-toastify';

export const OrganisationCoordonnees = ({ address, city, country }: { address: string; city: string; country: string; }) => {
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
            address: address,
            city: city,
            country: country,
        },
    });
    const countries = fetchCountries({ labels: fr });

    return (
        <form action={formAction}>
            <Card className="max-w-screen-xl p-1" id="org-coordonnees">
                <CardHeader>
                    <div className="flex flex-col gap-2 max-w-screen-sm">
                        <h1
                            className={title({
                                size: 'h5',
                            })}
                        >
                            Coordonnées de l&apos;organisation
                        </h1>
                        <p className="text-sm text-muted-foreground">Ce sont les coordonnées visibles de votre organisation au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    aria-invalid={errors.city ? 'true' : 'false'}
                                    aria-label="city input"
                                    errorMessage={errors.city?.message ?? ''}
                                    isInvalid={!!errors.city}
                                    label="Ville d'implentation de l'organisation"
                                    name="city"
                                    placeholder="Entrez la ville d'implentation de l'organisation"
                                    radius="sm"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => {
                                const isValueInCollection = countries.some((country: any) => country.value === field.value);

                                return (
                                    <Select
                                        {...field}
                                        isRequired
                                        required
                                        aria-invalid={errors.country ? 'true' : 'false'}
                                        aria-label="country Select"
                                        disabled={!countries}
                                        isInvalid={!!errors.country}
                                        label="Pays d'implentation de l'organisation"
                                        name="country"
                                        placeholder="Entrez le pays d'implentation de l'organisation"
                                        radius="sm"
                                        selectedKeys={isValueInCollection ? [field.value] : []}
                                    >
                                        {countries.map((country) => (
                                            <SelectItem key={country.value} color="primary" startContent={country.flag} textValue={country.label} value={country.value}>
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                );
                            }}
                        />
                    </div>
                    <Controller
                        control={control}
                        name="address"
                        render={({ field }) => (
                            <Input
                                {...field}
                                isRequired
                                aria-invalid={errors.address ? 'true' : 'false'}
                                aria-label="address input"
                                errorMessage={errors.address?.message ?? ''}
                                isInvalid={!!errors.address}
                                label="Adresse d'implentation de l'organisation"
                                name="address"
                                placeholder="Entrez l'adresse d'implentation de l'organisation"
                                radius="sm"
                                value={field.value ?? ''}
                            />
                        )}
                    />
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
