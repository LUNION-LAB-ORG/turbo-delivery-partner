'use client';

import { Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { updateOrganisation } from '@/src/actions/organisations.actions';
import { _createOrganisationSchema, createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import enumToOptions, { CustomLabels } from '@/utils/enumToOptions';
import { OrganisationCategory as OrganisationCategoryType } from '@/types/models';
import { toast } from 'react-toastify';

export const OrganisationCategory = ({ category }: { category: string; }) => {
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
            category: category,
        },
    });

    const customLabels: CustomLabels<OrganisationCategoryType> = {
        HOTEL: 'Hôtel',
        RESIDENCE: 'Résidence',
        GUEST_HOUSE: "Maison d'hôtes",
        COMPANY: 'Entreprise',
    };

    const categories = enumToOptions(OrganisationCategoryType, customLabels);

    return (
        <form action={formAction}>
            <Card className="max-w-screen-xl p-1" id="org-category">
                <CardHeader>
                    <div className="flex flex-col gap-2 max-w-screen-sm">
                        <h1
                            className={title({
                                size: 'h5',
                            })}
                        >
                            Type d&apos;organisation
                        </h1>
                        <p className="text-sm text-muted-foreground">C&apos;est la catégorie visible de votre organisation au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => {
                                const isValueInCollection = categories.some((cat: any) => cat.value === field.value);

                                return (
                                    <Select
                                        {...field}
                                        isRequired
                                        required
                                        aria-invalid={errors.category ? 'true' : 'false'}
                                        aria-label="category Select"
                                        disabled={!categories}
                                        isInvalid={!!errors.category}
                                        name="category"
                                        placeholder="Entrez le type d'organisation"
                                        radius="sm"
                                        selectedKeys={isValueInCollection ? [field.value] : []}
                                    >
                                        {categories.map((cat: any) => (
                                            <SelectItem key={cat.value} color="primary" textValue={cat.label} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                );
                            }}
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
